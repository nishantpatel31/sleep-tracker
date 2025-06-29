import joi from "joi";
import {
  sleepHabitChangeOptions,
  sleepStruggleDurationFromList
} from "../constants/sleep-steps-constants.js";

// Schema for validating one onboarding step at a time
const sleepOnboardValidations = joi.object({
  sleepHabitChange: joi
    .array()
    .items(joi.string().valid(...sleepHabitChangeOptions))
    .min(1)
    .unique(),

  sleepStruggleDurationFrom: joi
    .string()
    .valid(...sleepStruggleDurationFromList),

  timeToGoForSleep: joi.object({
    hour: joi.number().integer().min(1).max(12),
    period: joi.string().valid("AM", "PM").insensitive()
  }),

  timeToWakeUp: joi.object({
    hour: joi.number().integer().min(1).max(12),
    period: joi.string().valid("AM", "PM").insensitive()
  }),

  typicalSleepHours: joi
    .number()
    .integer()
    .min(1)
    .max(12)
})
.length(1); // Ensures only one field is passed at a time

export default sleepOnboardValidations;
