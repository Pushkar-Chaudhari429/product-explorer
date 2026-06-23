export function successResponse(data, meta = {}) {
  return { success: true, data, meta: { timestamp: new Date().toISOString(), ...meta } };
}
export function errorResponse(code, message, details = null) {
  return { success: false, error: { code, message, details }, meta: { timestamp: new Date().toISOString() } };
}
