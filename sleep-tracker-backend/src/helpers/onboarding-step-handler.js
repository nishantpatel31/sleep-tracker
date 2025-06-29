import { CustomError } from "../utils/custom-error.js";
import sleepOnboardValidations from "../validators/onboarding-validator.js";

/**
 * Validates a sleep onboarding step's data using schema.
 * Throws a CustomError on validation failure.
 * 
 * @param {string} userId - (Optional) user ID or identity
 * @param {object} sleepData - The data to validate
 * @returns {[string, any]} - A key-value pair of the validated field
 * @throws {CustomError} - If validation fails
 */
const validateSleepData = (userId, sleepData) => {
  const { error, value } = sleepOnboardValidations.validate(sleepData);

  if (error) {
    throw new CustomError(
      `${error.details[0].message} Please try again.`,
      400,
      true,
      "INVALID_ONBOARDING_DATA",
      {
        userId,
        field: error.details[0].path?.[0] || null,
        rawInput: sleepData
      }
    );
  }

  return Object.entries(value)[0];
};

export default validateSleepData;
