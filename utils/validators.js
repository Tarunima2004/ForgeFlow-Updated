const { HttpError } = require("./errors");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function assertRequiredString(value, fieldName) {
  if (!isNonEmptyString(value)) {
    throw new HttpError(400, `${fieldName} is required`);
  }

  return value.trim();
}

function assertOptionalString(value, fieldName) {
  if (value === undefined) return undefined;

  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a string`);
  }

  return value.trim();
}

function assertOptionalStringArray(value, fieldName) {
  if (value === undefined) return undefined;

  if (!Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be an array of strings`);
  }

  const cleaned = value.map((item) => {
    if (typeof item !== "string") {
      throw new HttpError(400, `${fieldName} must contain only strings`);
    }

    return item.trim().toLowerCase();
  });

  const filtered = cleaned.filter((item) => item !== "");
  const unique = [...new Set(filtered)];

  return unique;
}

function assertOneOf(value, fieldName, allowedValues) {
  if (!allowedValues.includes(value)) {
    throw new HttpError(
      400,
      `${fieldName} must be one of: ${allowedValues.join(", ")}`
    );
  }

  return value;
}

function assertMinLength(value, fieldName, minLength) {
  if (value.length < minLength) {
    throw new HttpError(
      400,
      `${fieldName} must be at least ${minLength} chars`
    );
  }

  return value;
}

function assertValidDate(value, fieldName) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, `${fieldName} must be a valid date`);
  }

  return value;
}

function parsePage(value, defaultValue = 1) {
  const parsed = parseInt(value ?? defaultValue, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    throw new HttpError(400, "page must be a positive integer");
  }

  return parsed;
}

function parseLimit(value, defaultValue = 10, max = 50) {
  const parsed = parseInt(value ?? defaultValue, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    throw new HttpError(400, "limit must be a positive integer");
  }

  return Math.min(parsed, max);
}

module.exports = {
  isNonEmptyString,
  assertRequiredString,
  assertOptionalString,
  assertOptionalStringArray,
  assertOneOf,
  assertMinLength,
  assertValidDate,
  parsePage,
  parseLimit,
};