import 'package:flutter_test/flutter_test.dart';

import 'package:pantry_pilot/data/ingredient_parser.dart';
import 'package:pantry_pilot/data/models.dart';

/// Merging rules: two lines for one ingredient must become one row the shopper
/// can act on — including the case where a recipe mixes metric and imperial
/// ("200 g" here, "1 kg" there) or measures the same thing two ways.
void main() {
  const parser = IngredientParser();

  Recipe recipeOf(List<String> lines) =>
      Recipe(id: 'm', title: 'Merge', emoji: '🍽️', ingredients: lines);

  GroceryItem only(List<String> lines) =>
      parser.parse(recipeOf(lines)).sections.expand((s) => s.items).single;

  group('unit-aware merging', () {
    test('the same unit still adds up', () {
      final item = only(['1 cup milk', '2 cups milk']);
      expect(item.quantity, '3');
      expect(item.unit, 'cups');
      expect(item.amountLabel, '3 cups');
    });

    test('countable items add up with no unit', () {
      final item = only(['2 eggs', '3 eggs']);
      expect(item.quantity, '5');
      expect(item.unit, '');
    });

    test('200 g + 1 kg becomes one metric row', () {
      final item = only(['200 g paneer', '1 kg paneer']);
      expect(item.quantity, '1.2');
      expect(item.unit, 'kg');
      expect(item.amountLabel, '1.2 kg');
    });

    test('1 kg + 200 g reads the same either way round', () {
      final item = only(['1 kg paneer', '200 g paneer']);
      expect(item.quantity, '1.2');
      expect(item.unit, 'kg');
    });

    test('small metric amounts stay in the small unit', () {
      final item = only(['200 g paneer', '100 g paneer']);
      expect(item.quantity, '300');
      expect(item.unit, 'g');
    });

    test('grams and grams over a kilo promote to kg', () {
      final item = only(['600 g flour', '600 g flour']);
      expect(item.quantity, '1.2');
      expect(item.unit, 'kg');
    });

    test('1 lb + 8 oz becomes 1.5 lb', () {
      final item = only(['1 lb ground beef', '8 oz ground beef']);
      expect(item.quantity, '1.5');
      expect(item.unit, 'lb');
    });

    test('500 ml + 1 L becomes 1.5 L', () {
      final item = only(['500 ml milk', '1 L milk']);
      expect(item.quantity, '1.5');
      expect(item.unit, 'L');
    });

    test('cups and millilitres meet in the larger unit', () {
      final item = only(['1 cup milk', '100 ml milk']);
      expect(item.quantity, '1.42');
      expect(item.unit, 'cups');
    });

    test('a small mix keeps the smaller unit instead of "0.3 cups"', () {
      final item = only(['1 tsp soy sauce', '5 ml soy sauce']);
      expect(item.quantity, '2.01');
      expect(item.unit, 'tsp');
    });

    test('a cup and a weight are both written out, never invented away', () {
      final item = only(['1 cup flour', '100 g flour']);
      expect(item.unit, '');
      expect(item.quantity, '1 cup + 100 g');
      expect(item.amountLabel, '1 cup + 100 g');
    });

    test('a range is never summed into a number', () {
      final item = only(['2-3 cloves garlic', '2 cloves garlic']);
      expect(item.quantity, '2–3');
      expect(item.unit, 'cloves');
    });

    test('three incompatible amounts all survive', () {
      final item = only(['1 cup flour', '100 g flour', '2 tbsp flour']);
      expect(item.quantity, '1 cup + 100 g + 2 tbsp');
    });

    test('one or less reads singular', () {
      final item = only(['1 cup milk']);
      expect(item.unit, 'cups');
      expect(item.amountLabel, '1 cup');
      expect(only(['1/2 cup milk']).amountLabel, '0.5 cup');
      expect(only(['1 can chickpeas']).amountLabel, '1 can');
      expect(only(['2 cans chickpeas']).amountLabel, '2 cans');
    });
  });

  group('itemsForLine', () {
    test('is the same pipeline a recipe line goes through', () {
      final items = parser.itemsForLine('2 cups spinach, chopped');
      expect(items.length, 1);
      expect(items.single.name, 'Spinach');
      expect(items.single.category, GroceryCategory.produce);
    });

    test('a messy line stays flagged when parsed on its own', () {
      final items = parser.itemsForLine('2 cups flour and 1 cup sugar');
      expect(items.length, 1);
      expect(items.single.needsReview, isTrue);
      expect(items.single.name, '2 cups flour and 1 cup sugar');
    });

    test('a fixed line parses cleanly', () {
      final items = parser.itemsForLine('2 cups flour');
      expect(items.single.needsReview, isFalse);
      expect(items.single.quantity, '2');
    });
  });

  group('regroup', () {
    test('files hand-edited items into their aisles and merges duplicates', () {
      final base = parser.parse(recipeOf(['1 cup flour', '1 tsp salt']));
      final flour = base.sections
          .expand((s) => s.items)
          .firstWhere((i) => i.name == 'Flour');

      final merged = parser.regroup([
        ...base.sections.expand((s) => s.items),
        // The user fixed "1 cup flour, plus 2 tbsp" into a clean second line.
        ...parser.itemsForLine('2 cups flour'),
        GroceryItem(
          id: 'i${IngredientParser.contentId('Basil')}',
          name: 'Basil',
          category: GroceryCategory.produce,
          quantity: '',
          unit: '',
          checked: false,
        ),
      ]);

      final items = merged.sections.expand((s) => s.items).toList();
      expect(items.where((i) => i.name == 'Flour').length, 1);
      expect(items.firstWhere((i) => i.name == 'Flour').quantity, '3');
      expect(items.firstWhere((i) => i.name == 'Flour').id, flour.id);

      expect(
        merged.sections.firstWhere((s) => s.items.any((i) => i.name == 'Basil'))
            .category,
        GroceryCategory.produce,
      );
      // Canonical aisle order is preserved (produce before pantry).
      final order = [for (final s in merged.sections) s.category.index];
      expect(order, [...order]..sort());
    });
  });
}
