import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:pantry_pilot/app_scope.dart';
import 'package:pantry_pilot/data/models.dart';
import 'package:pantry_pilot/data/store.dart';
import 'package:pantry_pilot/screens/grocery_list_screen.dart';
import 'package:pantry_pilot/theme/app_theme.dart';

import 'helpers.dart';

/// The "Needs review" bucket is a two-tap fix, not a dead end.
///
/// Fixing a flagged line must go through the same parser a pasted ingredient
/// goes through, land in a real aisle, and never leave a row behind in the
/// review bucket.
void main() {
  const String messyLine = '2 cups flour and 1 cup sugar';

  /// A list holding one unfixable line plus one clean one.
  Future<AppController> pumpList(WidgetTester tester) async {
    final controller = makeController();
    await controller.bootstrap();
    await controller.convertRecipe(Recipe(
      id: 'user_1',
      title: 'Messy Stew',
      emoji: '🍲',
      ingredients: const [messyLine, '1 tsp salt'],
    ));

    await tester.pumpWidget(MaterialApp(
      theme: AppTheme.light(),
      home: AppScope(
        controller: controller,
        child: const GroceryListScreen(),
      ),
    ));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));
    return controller;
  }

  /// The tap target for the only flagged row on the list.
  Finder reviewRow(AppController controller) => find
      .byKey(ValueKey('review_row_${controller.list!.reviewItems.single.id}'));

  testWidgets('a flagged line is fixed in place and moves into its aisle',
      (tester) async {
    final controller = await pumpList(tester);

    expect(controller.reviewCount, 1);
    expect(find.byKey(const ValueKey('needs_review')), findsOneWidget);
    expect(find.text('Needs review (1)'), findsOneWidget);

    // Tap the flagged line → the fix sheet.
    await tester.tap(reviewRow(controller));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.text('Fix this line'), findsOneWidget);
    expect(find.byKey(const ValueKey('review_field')), findsOneWidget);

    // Retype it the way it should have been written.
    await tester.enterText(
        find.byKey(const ValueKey('review_field')), '2 cups flour');
    await tester.pump();
    expect(find.text('This is how it will be filed:'), findsOneWidget);
    expect(find.text('Flour'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('review_save')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));

    // The flagged row is gone (model and UI), the fix is on the list.
    expect(controller.reviewCount, 0);
    expect(find.byKey(const ValueKey('needs_review')), findsNothing);
    expect(find.text(messyLine), findsNothing);
    expect(find.text('Flour'), findsOneWidget);
    expect(find.text('1 tsp'), findsOneWidget); // the untouched line survived
    await flushTimers(tester);
  });

  testWidgets('merging with an existing row adds up instead of duplicating',
      (tester) async {
    final controller = await pumpList(tester);

    await tester.tap(reviewRow(controller));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    // The list already has salt; fixing the line into salt must add up.
    await tester.enterText(
        find.byKey(const ValueKey('review_field')), '2 tsp salt');
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('review_save')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));

    final salt = controller.list!.sections
        .expand((s) => s.items)
        .where((i) => i.name == 'Salt')
        .toList();
    expect(salt.length, 1);
    expect(salt.single.quantity, '3');
    expect(salt.single.unit, 'tsp');
    expect(controller.reviewCount, 0);
    await flushTimers(tester);
  });

  testWidgets('an unfixable line is kept verbatim in the aisle you pick',
      (tester) async {
    final controller = await pumpList(tester);

    await tester.tap(reviewRow(controller));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));

    // Left exactly as written, the parser still refuses to guess — so the
    // sheet offers the aisle picker instead of pretending.
    expect(
      find.textContaining('Still not clear enough to sort'),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('review_cat_pantry')));
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('review_save')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));

    expect(controller.reviewCount, 0);
    final item = controller.list!.sections
        .expand((s) => s.items)
        .firstWhere((i) => i.name == messyLine);
    expect(item.needsReview, isFalse);
    expect(item.category, GroceryCategory.pantry);
    expect(item.quantity, '');
    expect(find.byKey(const ValueKey('needs_review')), findsNothing);
    await flushTimers(tester);
  });

  testWidgets('a flagged line can be dropped entirely', (tester) async {
    final controller = await pumpList(tester);

    await tester.tap(reviewRow(controller));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    await tester.tap(find.byKey(const ValueKey('review_discard')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));

    expect(controller.reviewCount, 0);
    expect(controller.totalCount, 1); // just the salt left
    expect(find.byKey(const ValueKey('needs_review')), findsNothing);
    await flushTimers(tester);
  });
}
