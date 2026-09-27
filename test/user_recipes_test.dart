import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:pantry_pilot/data/models.dart';
import 'package:pantry_pilot/main.dart';

import 'helpers.dart';

/// Recipes the user typed themselves get their own shelf, newest first, so the
/// one you just added is the first thing under the header instead of buried in
/// the built-in catalogue (Hive returns keys sorted, not in insertion order, so
/// the order has to come from the id's timestamp).
void main() {
  Recipe userRecipe(String id, String title) => Recipe(
        id: 'user_$id',
        title: title,
        emoji: '🥘',
        ingredients: const ['2 cups water'],
      );

  group('controller split', () {
    test('my recipes come newest first, built-ins keep their order', () async {
      final app = makeController();
      await app.bootstrap();
      expect(app.builtInRecipes.length, 10);
      expect(app.myRecipes, isEmpty);

      await app.addRecipe(userRecipe('1000', 'Oldest Dish'));
      await app.addRecipe(userRecipe('2000', 'Newer Dish'));
      await app.addRecipe(userRecipe('3000', 'Newest Dish'));

      expect(app.myRecipes.map((r) => r.title).toList(),
          ['Newest Dish', 'Newer Dish', 'Oldest Dish']);
      expect(app.builtInRecipes.length, 10);
      expect(app.recipes.length, 13);
    });

    test('the split survives a reload (order comes from the id, not the box)',
        () async {
      // A fresh controller reading the same stored recipes, the way a launch
      // does — Hive hands them back in key order, so only the id's timestamp
      // can put the newest first.
      final reopened = makeController();
      await reopened.store.debugPutRaw(
          'recipes', 'user_1000', userRecipe('1000', 'Older').toMap());
      await reopened.store.debugPutRaw(
          'recipes', 'user_9000', userRecipe('9000', 'Newer').toMap());
      await reopened.bootstrap();

      expect(reopened.myRecipes.map((r) => r.title).toList(),
          ['Newer', 'Older']);
      expect(reopened.myRecipes.first.createdMillis, 9000);
    });

    test('a tag pill filters each shelf independently', () async {
      final app = makeController();
      await app.bootstrap();
      await app.addRecipe(Recipe(
        id: 'user_5',
        title: 'My Tagged Dish',
        emoji: '🥘',
        ingredients: const ['1 cup rice'],
        tags: const ['Dinner'],
      ));
      await app.addRecipe(userRecipe('6', 'My Untagged Dish'));

      expect(app.visibleMyRecipes.length, 2);
      expect(app.visibleBuiltInRecipes.isNotEmpty, isTrue);

      app.setActiveTag('Dinner');
      expect(app.visibleMyRecipes.map((r) => r.title).toList(),
          ['My Tagged Dish']);
      expect(
        app.visibleBuiltInRecipes.every((r) => r.tags.contains('Dinner')),
        isTrue,
      );
    });
  });

  group('home shelf', () {
    testWidgets('your own recipes are shelved above the built-in library',
        (tester) async {
      final controller = makeController();
      await controller.bootstrap();
      await controller.addRecipe(userRecipe('42', 'My Test Dish'));

      await pumpIntoHome(tester, RecipePilotApp(controller: controller));

      // Split headers, and the generic single-shelf title is gone.
      expect(find.text('Your own recipes'), findsOneWidget);
      expect(find.text('Built-in library'), findsOneWidget);
      expect(find.text('Your recipes'), findsNothing);

      // Yours sits first: above the built-in header.
      expect(
        tester.getTopLeft(find.text('My Test Dish')).dy,
        lessThan(tester.getTopLeft(find.text('Built-in library')).dy),
      );
      await flushTimers(tester);
    });

    testWidgets('one shelf when you have not written anything yet',
        (tester) async {
      final controller = makeController();
      await controller.bootstrap();

      await pumpIntoHome(tester, RecipePilotApp(controller: controller));

      expect(find.text('Your recipes'), findsOneWidget);
      expect(find.text('Your own recipes'), findsNothing);
      expect(find.text('Built-in library'), findsNothing);
      await flushTimers(tester);
    });
  });
}
