import { createId } from "../ids/createId.js";

export function requestId(request, _response, next) {
  request.requestId = createId("req");
  next();
}
