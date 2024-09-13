import { NextFunction, Request, Response } from 'express';

export default function responseFormatter(_req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;

  res.json = function (data: any) {
    // If the response already contains success or an error, don't modify it
    if (data && (data.success !== undefined || data.message !== undefined)) {
      return originalJson.call(this, data);
    }

    // Format the response
    const formattedData = {
      success: true,
      data,
    };

    return originalJson.call(this, formattedData);
  };

  next();
}
