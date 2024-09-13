import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function globalErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 200;
  const message = err.message || 'Internal server error';

  // Ensure error response follows the same format
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
