// Express middleware factory: validates request parts against zod schemas.
//
// Express 5 exposes `req.query` (and `req.params`) via read-only getters, so this
// validator gates those parts without reassigning them. Only `req.body` — a normal
// writable property — is replaced with the parsed value, giving handlers the
// trimmed/normalized result. A ZodError is forwarded to the error handler, which
// formats it as a 400.
export function validate({ params, query, body } = {}) {
  return (request, _response, next) => {
    try {
      if (params) {
        params.parse(request.params);
      }
      if (query) {
        query.parse(request.query);
      }
      if (body) {
        request.body = body.parse(request.body);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
