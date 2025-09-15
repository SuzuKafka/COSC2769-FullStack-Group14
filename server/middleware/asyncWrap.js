/**
 * Wraps async Express handlers to forward errors to the global handler.
 */
module.exports = function asyncWrap(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
