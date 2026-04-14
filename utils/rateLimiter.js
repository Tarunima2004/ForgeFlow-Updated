const { HttpError } = require("./errors");

const store = new Map();

function rateLimit({ windowMs = 10000, max = 5 } = {}) {
  return function (key) {
    const now = Date.now();

    const entry = store.get(key);

    // First request
    if (!entry) {
      store.set(key, { count: 1, startTime: now });
      return;
    }

    const { count, startTime } = entry;

    // Reset window
    if (now - startTime > windowMs) {
      store.set(key, { count: 1, startTime: now });
      return;
    }

    // Limit exceeded
    if (count >= max) {
      throw new HttpError(
        429,
        "Too many requests, please try again later",
        "RATE_LIMIT_EXCEEDED"
      );
    }

    // Increment count
    entry.count += 1;
  };
}

module.exports = {
  rateLimit,
};