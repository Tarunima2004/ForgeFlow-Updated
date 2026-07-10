const { HttpError, ERROR_CODES } = require("./errors");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}
const ISSUE_TYPES = [
  "Task",
  "Story",
  "Bug",
  "Epic",
  "Improvement",
];
function assertRequiredString(value, fieldName) {
  if (!isNonEmptyString(value)) {
    throw new HttpError(
  400,
  `${fieldName} is required`,
  ERROR_CODES.VALIDATION_ERROR
);
  }

  return value.trim();
}

function assertOptionalString(value, fieldName) {
  if (value === undefined) return undefined;

  if (typeof value !== "string") {
    throw new HttpError(
  400,
  `${fieldName} must be a string`,
  ERROR_CODES.VALIDATION_ERROR
);
  }

  return value.trim();
}

function assertOptionalStringArray(value, fieldName) {
  if (value === undefined) return undefined;

  if (!Array.isArray(value)) {
    throw new HttpError(
  400,
  `${fieldName} must be an array of strings`,
  ERROR_CODES.VALIDATION_ERROR
);
  }

  const cleaned = value.map((item) => {
    if (typeof item !== "string") {
      throw new HttpError(
  400,
  `${fieldName} must contain only strings`,
  ERROR_CODES.VALIDATION_ERROR
);
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
  `${fieldName} must be one of: ${allowedValues.join(", ")}`,
  ERROR_CODES.VALIDATION_ERROR
);
  }

  return value;
}

function assertMinLength(value, fieldName, minLength) {
  if (value.length < minLength) {
    throw new HttpError(
  400,
  `${fieldName} must be at least ${minLength} chars`,
  ERROR_CODES.VALIDATION_ERROR
);
  }

  return value;
}

function assertValidDate(value, fieldName) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(
  400,
  `${fieldName} must be a valid date`,
  ERROR_CODES.VALIDATION_ERROR
);
  }

  return value;
}

function parsePage(value, defaultValue = 1) {
  const parsed = parseInt(value ?? defaultValue, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    throw new HttpError(
  400,
  "page must be a positive integer",
  ERROR_CODES.VALIDATION_ERROR
);
  }

  return parsed;
}

function parseLimit(value, defaultValue = 10, max = 50) {
  const parsed = parseInt(value ?? defaultValue, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    throw new HttpError(
  400,
  "limit must be a positive integer",
  ERROR_CODES.VALIDATION_ERROR
);
  }

  return Math.min(parsed, max);
}
function validateIssueType(value) {

  return assertOneOf(
    value,
    "issue_type",
    ISSUE_TYPES
  );

}
function validateLabels(labels) {

  return assertOptionalStringArray(
    labels,
    "labels"
  );

}
function validateIssueDates(
  startDate,
  dueDate
) {

  const start =
    assertValidDate(
      startDate,
      "start_date"
    );

  const due =
    assertValidDate(
      dueDate,
      "due_date"
    );

  if (
    start &&
    due &&
    new Date(start) > new Date(due)
  ) {

    throw new HttpError(
      400,
      "start_date cannot be after due_date",
      ERROR_CODES.VALIDATION_ERROR
    );

  }

  return {

    startDate: start,

    dueDate: due,

  };

}
module.exports = {
  isNonEmptyString,
  assertRequiredString,
  assertOptionalString,
  assertOptionalStringArray,
  assertOneOf,
  assertMinLength,
  assertValidDate,
  validateIssueType,
  validateLabels,
  validateIssueDates,
  parsePage,
  parseLimit,
};