import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:pantry_pilot/data/models.dart';
import 'package:pantry_pilot/screens/cook_along_screen.dart';
import 'package:pantry_pilot/theme/app_theme.dart';

/// The cook-along timer is adjustable: a step's stored duration is a starting
/// point, and an untimed step can be given a countdown of your own.
void main() {
  const recipe = Recipe(
    id: 'user_1',
    title: 'Timer Test',
    emoji: '⏱️',
    ingredients: ['1 cup water'],
    steps: [
      RecipeStep(text: 'Boil the water', seconds: 300),
      RecipeStep(text: 'Season to taste'),
      RecipeStep(text: 'Simmer the sauce', seconds: 600),
    ],
  );

  Future<void> pumpCook(WidgetTester tester) async {
    await tester.pumpWidget(MaterialApp(
      theme: AppTheme.light(),
      home: const CookAlongScreen(recipe: recipe),
    ));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));
  }

  /// The 420 ms AnimatedSwitcher hand-off needs a swap frame plus two ticks
  /// before the outgoing step view is really gone (one long pump leaves both
  /// views mounted and every finder ambiguous).
  Future<void> nextStep(WidgetTester tester) async {
    await tester.tap(find.byKey(const ValueKey('cook_next')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    await tester.pump(const Duration(milliseconds: 300));
  }

  testWidgets('the step timer can be lengthened and shortened', (tester) async {
    await pumpCook(tester);

    expect(find.text('Step 1 of 3'), findsOneWidget);
    expect(find.text('05:00'), findsOneWidget);
    expect(find.text('Timer · 5 min'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('timer_plus')));
    await tester.pump();
    expect(find.text('06:00'), findsOneWidget);
    expect(find.text('Timer · 6 min'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('timer_plus_five')));
    await tester.pump();
    expect(find.text('11:00'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('timer_minus')));
    await tester.pump();
    expect(find.text('10:00'), findsOneWidget);

    // Running: extra time extends what is left, so the cook can keep going.
    await tester.tap(find.text('Start timer'));
    await tester.pump();
    await tester.pump(const Duration(seconds: 1));
    expect(find.text('09:59'), findsOneWidget);
    expect(find.text('Cooking…'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('timer_plus')));
    await tester.pump();
    expect(find.text('10:59'), findsOneWidget);
    expect(find.text('Cooking…'), findsOneWidget);

    // Leave nothing ticking behind (the heartbeat is a 1 Hz periodic timer).
    await tester.tap(find.text('Pause'));
    await tester.pump();
    await tester.pumpWidget(const SizedBox.shrink());
  });

  testWidgets('an adjustment belongs to its own step', (tester) async {
    await pumpCook(tester);
    await tester.tap(find.byKey(const ValueKey('timer_plus')));
    await tester.pump();
    expect(find.text('06:00'), findsOneWidget);

    await nextStep(tester);
    expect(find.text('Step 2 of 3'), findsOneWidget);

    // Third step keeps its own stored 10 minutes — the 6 dialled into step 1
    // must not travel with the cook.
    await nextStep(tester);
    expect(find.text('Step 3 of 3'), findsOneWidget);
    expect(find.text('10:00'), findsOneWidget);
    expect(find.text('Timer · 10 min'), findsOneWidget);

    // ...while stepping back returns to the 6 minutes that were dialled in.
    await tester.tap(find.byIcon(Icons.arrow_back_rounded));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('Step 2 of 3'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.arrow_back_rounded));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('Step 1 of 3'), findsOneWidget);
    expect(find.text('06:00'), findsOneWidget);
    expect(find.text('Timer · 6 min'), findsOneWidget);
    await tester.pumpWidget(const SizedBox.shrink());
  });

  testWidgets('an untimed step can be given a timer of your own',
      (tester) async {
    await pumpCook(tester);
    await nextStep(tester);
    expect(find.text('Step 2 of 3'), findsOneWidget);

    // No timer on this step: a stopwatch card and an offer, nothing to adjust.
    expect(find.byKey(const ValueKey('timer_set')), findsOneWidget);
    expect(find.byKey(const ValueKey('timer_total')), findsNothing);

    await tester.tap(find.byKey(const ValueKey('timer_set')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.text('How long does this step need?'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('timer_preset_10')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));

    expect(find.text('10:00'), findsOneWidget);
    expect(find.text('Timer · 10 min'), findsOneWidget);
    expect(find.byKey(const ValueKey('timer_set')), findsNothing);
    expect(find.text('Ready to start'), findsOneWidget);
    await tester.pumpWidget(const SizedBox.shrink());
  });

  testWidgets('a timer can be handed back to the stopwatch', (tester) async {
    await pumpCook(tester);
    expect(find.text('05:00'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('timer_clear')));
    await tester.pump();

    expect(find.text('05:00'), findsNothing);
    expect(find.byKey(const ValueKey('timer_set')), findsOneWidget);
    await tester.pumpWidget(const SizedBox.shrink());
  });
}
