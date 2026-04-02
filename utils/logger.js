module.exports = function logRequest({ method, path, statusCode, ms }) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${method} ${path} -> ${statusCode} (${ms}ms)`);
};