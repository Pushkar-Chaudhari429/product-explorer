import { AppError } from '../utils/AppError.js';

export function errorHandler(err, req, res, _next) {
  console.error(JSON.stringify({ level: 'ERROR', type: 'REQUEST_ERROR', method: req.method, path: req.path, statusCode: err.statusCode || 500, code: err.code || 'UNKNOWN', message: err.message }));
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({ success: false, error: { code: err.code, message: err.message, details: err.details }, meta: { timestamp: new Date().toISOString() } });
  }
  return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.', details: null }, meta: { timestamp: new Date().toISOString() } });
}
