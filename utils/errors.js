class HttpError extends Error {
  constructor(statusCode, message, code = "HTTP_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

function assertFound(entity, message = "Resource not found") {
  if (!entity) {
    throw new HttpError(404, message, "NOT_FOUND");
  }

  return entity;
}

module.exports = {
  HttpError,
  assertFound,
};