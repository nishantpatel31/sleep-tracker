import validateSleepData from "../helpers/onboarding-step-handler.js";
import saveOnboardingStep from "../models/sleep-onboarding-model.js";
import { CustomError } from "../utils/custom-error.js";
import { saveScreenAnalytics } from "../models/screen-analytics-model.js";

import {
  totalOnboardingSteps,
  totalOnboardingStepsInList,
} from "../constants/sleep-steps-constants.js";

import logger from "../utils/logger.js";

/**
 * @desc Handles the submission of an onboarding step.
 * @route POST /api/onboarding/step
 * @access Public (via identity)
 */
export const submitOnboardingStep = async (req, res, next) => {
  try {
    const { identity, stepKey, data: sleepData, meta: metaSleepData } = req.body;

    // Validate required fields
    if (!identity || !stepKey || sleepData == null || metaSleepData == null) {
      logger.warn("Onboarding step submission failed: Missing required fields", {
        identity, stepKey, sleepData, metaSleepData
      });
      throw new CustomError(
        "Request contains missing fields. Check and try again.",
        400,
        true,
        "MISSING_ONBOARDING_FIELDS"
      );
    }

    // Validate step key
    if (!totalOnboardingStepsInList.includes(stepKey)) {
      logger.warn(`Invalid onboarding stepKey: '${stepKey}'`);
      throw new CustomError(
        `Invalid onboarding screen step: ${stepKey}`,
        400,
        true,
        "INVALID_ONBOARDING_STEP"
      );
    }

    // Determine next step
    const currentIndex = totalOnboardingSteps[stepKey];
    const nextScreen =
      currentIndex + 1 < totalOnboardingStepsInList.length
        ? totalOnboardingStepsInList[currentIndex + 1]
        : "Done";

    // Validate and normalize input
    const [, sleepDataValue] = validateSleepData(identity, sleepData);

    // Prepare update document
    const updateData = {
      identity,
      [`responses.${stepKey}`]: sleepDataValue,
      nextScreen,
      updatedAt: new Date()
    };

    // Save step data
    await saveOnboardingStep(identity, updateData);

    logger.info(`Saved onboarding step [${stepKey}] for identity [${identity}], next: [${nextScreen}]`);

    // Save screen analytics
    const { enteredAt, exitedAt } = metaSleepData || {};
    if (enteredAt && exitedAt) {
      try {
        await saveScreenAnalytics({
          identity,
          screen: stepKey,
          startTime: new Date(enteredAt),
          endTime: new Date(exitedAt)
        });
        logger.debug(`Analytics recorded for screen: ${stepKey}, identity: ${identity}`);
      } catch (analyticsErr) {
        logger.warn("Analytics tracking failed", {
          identity,
          screen: stepKey,
          error: analyticsErr.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message:
        nextScreen !== "Done"
          ? `Response recorded for ${stepKey}. Proceed to ${nextScreen} screen.`
          : "All responses recorded. Generating your sleep profile.",
      nextScreen
    });
  } catch (err) {
    logger.error(`Failed to submit onboarding step for identity [${req.body?.identity || "unknown"}]`, err);
    next(err);
  }
};
