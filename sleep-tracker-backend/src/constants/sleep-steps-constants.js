// Step options and labels for sleep onboarding flow
export const sleepSteps = Object.freeze({
  sleepHabitChange: {
    options: Object.freeze([
      "I would go to sleep easily",
      "I would sleep through the night",
      "I'd wake up in time, refreshed",
    ]),
  },
  sleepStruggleDurationFrom: {
    options: Object.freeze({
      LESS_THAN_WEEK: "Less than a week",
      ONE_TO_TWO_WEEKS: "1–2 weeks",
      MORE_THAN_TWO_WEEKS: "More than 2 weeks",
    }),
  },
});

// Keeps track of the order of steps — keys must match backend expectations
export const totalOnboardingSteps = Object.freeze({
  sleepHabitChange: 0,
  sleepStruggleDurationFrom: 1,
  timeToGoForSleep: 2,
  timeToWakeUp: 3,
  typicalSleepHours: 4,
});

// Easy iteration through step keys
export const totalOnboardingStepsInList = Object.freeze([
  "sleepHabitChange",
  "sleepStruggleDurationFrom",
  "timeToGoForSleep",
  "timeToWakeUp",
  "typicalSleepHours",
]);

// Export constants for dropdowns or validation
export const STEP_KEYS = Object.freeze(Object.keys(sleepSteps));

export const sleepHabitChangeOptions = sleepSteps.sleepHabitChange.options;

export const sleepStruggleDurationFromList = Object.freeze(
  Object.keys(sleepSteps.sleepStruggleDurationFrom.options)
);
