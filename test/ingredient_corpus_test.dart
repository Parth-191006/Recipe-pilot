import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import 'package:pantry_pilot/data/ingredient_parser.dart';
import 'package:pantry_pilot/data/models.dart';

/// Golden-file regression suite for the offline parser.
///
/// `test/golden/ingredient_corpus.txt` is a checked-in list of real recipe
/// lines (the way published recipes actually write them: mixed metric and
/// imperial, bullets, numbering, unicode fractions, prep commas) with the
/// outcome each line must produce. Every row is asserted, so a rule tweak that
/// quietly breaks a line someone cooks from fails the build instead of
/// shipping.
///
/// Three layers:
///   1. the corpus file's own per-line expectation (`clean` / `review` /
///      `ignored`),
///   2. invariants that must hold for every single line (never invent an
///      amount, never lose a line, never crash),
///   3. a pinned table of exact parses (name, amount, unit, aisle) plus
///      whole-corpus properties (stable ids, canonical aisle order).
void main() {
  const parser = IngredientParser();

  Recipe recipeOf(List<String> lines) =>
      Recipe(id: 'corpus', title: 'Corpus', emoji: '🍽️', ingredients: lines);

  List<GroceryItem> itemsOf(GroceryListResult result) =>
      [for (final section in result.sections) ...section.items];

  // ---------------------------------------------------------------------
  // The corpus file
  // ---------------------------------------------------------------------

  final corpusFile = File('test/golden/ingredient_corpus.txt');
  final rows = <_Row>[];

  for (final raw in corpusFile.readAsLinesSync()) {
    final line = raw.trim();
    if (line.isEmpty || line.startsWith('#')) continue;
    final parts = line.split('|');
    // Thrown at load time: a malformed golden file must fail the run loudly,
    // not silently skip a row it cannot understand.
    if (parts.length != 2) {
      throw FormatException('malformed corpus row: $line');
    }
    rows.add(_Row(parts[0].trim(), parts[1].trim()));
  }

  group('golden corpus', () {
    test('the corpus is well formed and broad', () {
      expect(rows.length, greaterThanOrEqualTo(100),
          reason: 'the corpus should stay a real regression net');
      expect(rows.where((r) => r.kind == 'clean').length,
          greaterThanOrEqualTo(80),
          reason: 'most real-world lines must parse cleanly');
      expect(rows.where((r) => r.kind == 'review').length,
          greaterThanOrEqualTo(3),
          reason: 'the honest-degradation rows must stay in the corpus');
    });

    test('every row parses to what the file says it should', () {
      for (final row in rows) {
        final items = parser.itemsForLine(row.line);
        final flagged = items.where((i) => i.needsReview).toList();
        switch (row.kind) {
          case 'ignored':
            expect(items, isEmpty, reason: 'should be ignored: ${row.line}');
          case 'clean':
            expect(items.length, row.count, reason: row.line);
            expect(flagged, isEmpty, reason: row.line);
          case 'review':
            expect(items.length, row.count, reason: row.line);
            expect(flagged, isNotEmpty, reason: row.line);
          default:
            fail('unknown expectation "${row.expectation}" on: ${row.line}');
        }
      }
    });

    test('no line is ever dropped, guessed at, or crashes the parser', () {
      for (final row in rows) {
        final items = parser.itemsForLine(row.line);
        if (row.kind != 'ignored') {
          expect(items, isNotEmpty, reason: 'dropped: ${row.line}');
        }
        for (final item in items) {
          expect(item.name.trim(), isNotEmpty, reason: row.line);
          if (item.needsReview) {
            // The bargain: a flagged row invents nothing at all.
            expect(item.quantity, '', reason: row.line);
            expect(item.unit, '', reason: row.line);
            expect(item.category, GroceryCategory.other, reason: row.line);
          } else {
            // Leftover digits/brackets in a *name* mean a rule missed.
            expect(RegExp(r'[0-9½¼¾]').hasMatch(item.name), isFalse,
                reason: '${item.name} <- ${row.line}');
            expect(item.name, isNot(contains('(')), reason: row.line);
          }
        }
      }
    });

    test('the corpus yields one stable, canonically ordered list', () {
      final recipe = recipeOf([for (final r in rows) r.line]);
      final first = parser.parse(recipe);
      final second = parser.parse(recipe);

      expect(first.totalItems, greaterThanOrEqualTo(100));
      // Only the documented messy rows may need review — if a rule change
      // floods the bucket, this fails loudly.
      expect(first.reviewCount, lessThanOrEqualTo(8));

      // Ids are persisted Hive keys: unique, and identical run to run.
      final ids = [for (final item in itemsOf(first)) item.id];
      expect(ids.toSet().length, ids.length,
          reason: 'duplicate item ids in the corpus');

      String signature(GroceryListResult r) => [
            for (final section in r.sections)
              '${section.category.name}:'
                  '${[
                for (final i in section.items)
                  '${i.id}|${i.name}|${i.quantity}|${i.unit}'
              ].join(',')}'
          ].join(' / ');

      expect(signature(second), signature(first));

      // Aisles in enum order (produce first), and never an empty section.
      final order = [for (final s in first.sections) s.category.index];
      expect(order, [...order]..sort());
      for (final section in first.sections) {
        expect(section.items, isNotEmpty);
      }
    });
  });

  // ---------------------------------------------------------------------
  // Pinned parses — one test per line, so a failure names the exact line.
  // ---------------------------------------------------------------------

  group('pinned parses', () {
    for (final pin in _pinned) {
      test(pin.line, () {
        final items = parser.itemsForLine(pin.line);
        expect(items.length, 1, reason: 'items for "${pin.line}"');
        final item = items.single;
        expect(item.name, pin.name, reason: pin.line);
        expect(item.quantity, pin.quantity, reason: '${pin.line} (amount)');
        expect(item.unit, pin.unit, reason: '${pin.line} (unit)');
        expect(item.category, pin.category, reason: '${pin.line} (aisle)');
      });
    }
  });

  // ---------------------------------------------------------------------
  // Multi-item lines: one row of prose, two things to buy.
  // ---------------------------------------------------------------------

  group('splitting one line into several items', () {
    test('"Salt and pepper, to taste" is two staples', () {
      final items = parser.itemsForLine('Salt and pepper, to taste');
      expect(items.map((i) => i.name).toList(), ['Salt', 'Pepper']);
      expect(items.every((i) => i.category == GroceryCategory.spices), isTrue);
      expect(items.every((i) => i.quantity.isEmpty), isTrue);
    });

    test('"1 cup milk, 2 tbsp butter" keeps both halves', () {
      final items = parser.itemsForLine('1 cup milk, 2 tbsp butter');
      expect(items.length, 2);
      expect(items[0].name, 'Milk');
      expect(items[0].unit, 'cups');
      expect(items[1].name, 'Butter');
      expect(items[1].unit, 'tbsp');
    });

    test('"4 skinless, boneless chicken thighs, trimmed" reads as one buy', () {
      final items = parser.itemsForLine(
          '4 skinless, boneless chicken thighs, trimmed');
      expect(items.length, 1);
      expect(items.single.name, 'Chicken thighs');
      expect(items.single.quantity, '4');
      expect(items.single.category, GroceryCategory.meat);
    });
  });
}

/// One corpus row: the recipe line and the outcome the file claims for it.
class _Row {
  const _Row(this.line, this.expectation);

  final String line;

  /// `clean`, `clean:N`, `review`, `review:N` or `ignored`.
  final String expectation;

  String get kind => expectation.split(':').first;

  /// How many items the line must produce.
  int get count => int.tryParse(expectation.split(':').last) ?? 1;
}

/// A line whose parse is pinned down to the aisle it must land in.
class _Pinned {
  const _Pinned(this.line, this.name, this.quantity, this.unit, this.category);

  final String line;
  final String name;
  final String quantity;
  final String unit;
  final GroceryCategory category;
}

const List<_Pinned> _pinned = [
  // Amounts: integers, fractions, decimals, unicode glyphs, ranges, words.
  _Pinned('2 cups all-purpose flour', 'Flour', '2', 'cups', GroceryCategory.pantry),
  _Pinned('1 cup milk', 'Milk', '1', 'cups', GroceryCategory.dairy),
  _Pinned('3 eggs', 'Eggs', '3', '', GroceryCategory.dairy),
  _Pinned('½ cup parmesan', 'Parmesan', '0.5', 'cups', GroceryCategory.dairy),
  _Pinned('2-3 cloves garlic', 'Garlic', '2–3', 'cloves', GroceryCategory.produce),
  _Pinned('1.5 kg chicken thighs', 'Chicken thighs', '1.5', 'kg',
      GroceryCategory.meat),
  _Pinned('500 g paneer', 'Paneer', '500', 'g', GroceryCategory.other),
  _Pinned('1 kg chicken thighs', 'Chicken thighs', '1', 'kg',
      GroceryCategory.meat),
  _Pinned('1 lb ground beef', 'Beef', '1', 'lb', GroceryCategory.meat),

  // Units: canonical spellings, containers, package sizes, parentheticals.
  _Pinned('1 teaspoon salt', 'Salt', '1', 'tsp', GroceryCategory.spices),
  _Pinned('2 tablespoons olive oil', 'Olive oil', '2', 'tbsp',
      GroceryCategory.pantry),
  _Pinned('1 bunch cilantro', 'Cilantro', '1', 'bunch', GroceryCategory.produce),
  _Pinned('1 can coconut milk', 'Coconut milk', '1', 'can',
      GroceryCategory.pantry),
  _Pinned('2 15-ounce cans black beans', 'Black beans', '2', 'can',
      GroceryCategory.pantry),
  _Pinned('1 (14 oz) can diced tomatoes', 'Tomatoes', '1', 'can',
      GroceryCategory.produce),
  _Pinned('300 ml coconut cream', 'Coconut cream', '300', 'ml',
      GroceryCategory.pantry),
  _Pinned('8 oz cream cheese, softened', 'Cream cheese', '8', 'oz',
      GroceryCategory.dairy),
  _Pinned('1 head broccoli', 'Broccoli', '1', 'head', GroceryCategory.produce),
  _Pinned('2 ribs celery, chopped', 'Celery', '2', 'rib', GroceryCategory.produce),

  // Size / state adjectives that are not part of what you buy.
  _Pinned('1 large onion, diced', 'Onion', '1', '', GroceryCategory.produce),
  _Pinned('1 lb baby potatoes, halved', 'Potatoes', '1', 'lb',
      GroceryCategory.produce),
  _Pinned('3 ripe bananas', 'Bananas', '3', '', GroceryCategory.produce),
  _Pinned('4 tbsp unsalted butter, melted', 'Butter', '4', 'tbsp',
      GroceryCategory.dairy),
  _Pinned('2 cups frozen peas', 'Peas', '2', 'cups', GroceryCategory.produce),
  _Pinned('1 tsp ground cumin', 'Cumin', '1', 'tsp', GroceryCategory.spices),

  // Trailing prep phrases, totals without a unit, verbs.
  _Pinned('2 cups spinach, chopped', 'Spinach', '2', 'cups',
      GroceryCategory.produce),
  _Pinned('4 cloves garlic, minced', 'Garlic', '4', 'cloves',
      GroceryCategory.produce),
  _Pinned('1 lb shrimp, peeled and deveined', 'Shrimp', '1', 'lb',
      GroceryCategory.meat),
  _Pinned('2 chicken breasts, boneless and skinless', 'Chicken breasts', '2',
      '', GroceryCategory.meat),
  _Pinned('Juice of 1 lemon', 'Lemon', '1', '', GroceryCategory.produce),
  _Pinned('Zest of 1 orange', 'Orange', '1', '', GroceryCategory.produce),
  _Pinned('Salt to taste', 'Salt', '', '', GroceryCategory.spices),
  _Pinned('Freshly ground black pepper', 'Black pepper', '', '',
      GroceryCategory.spices),
  _Pinned('1 tsp salt, or more to taste', 'Salt', '1', 'tsp',
      GroceryCategory.spices),

  // Synonym folding and phrase rules (the aisle a substring match would miss).
  _Pinned('3 scallions, thinly sliced', 'Scallions', '3', '',
      GroceryCategory.produce),
  _Pinned('1 green onion', 'Scallions', '1', '', GroceryCategory.produce),
  _Pinned('2 aubergines', 'Eggplant', '2', '', GroceryCategory.produce),
  _Pinned('1 can chickpeas, drained and rinsed', 'Chickpeas', '1', 'can',
      GroceryCategory.pantry),
  _Pinned('1 cup tomato sauce', 'Tomato sauce', '1', 'cups',
      GroceryCategory.pantry),
  _Pinned('1 cup vegetable broth', 'Vegetable broth', '1', 'cups',
      GroceryCategory.pantry),
  _Pinned('2 tsp hot sauce', 'Hot sauce', '2', 'tsp', GroceryCategory.pantry),
  _Pinned('1 tsp vanilla extract', 'Vanilla', '1', 'tsp',
      GroceryCategory.spices),
  _Pinned('1 tsp baking powder', 'Baking powder', '1', 'tsp',
      GroceryCategory.spices),

  // Bullets, numbering and pasted blocks.
  _Pinned('- 3 cloves garlic, minced', 'Garlic', '3', 'cloves',
      GroceryCategory.produce),
  _Pinned('* 1 tbsp olive oil', 'Olive oil', '1', 'tbsp',
      GroceryCategory.pantry),
  _Pinned('1. 2 cups milk', 'Milk', '2', 'cups', GroceryCategory.dairy),
  _Pinned('2) 1 tsp salt', 'Salt', '1', 'tsp', GroceryCategory.spices),
];
