import env from "../config/env.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const isCorsError = err.message === "Not allowed by CORS";
  const statusCode = err.statusCode ?? (isCorsError ? 403 : 500);
  const isServerError = statusCode >= 500;

  const payload = {
    message: isServerError ? "Internal server error" : err.message,
  };

  if (!env.isProduction && err.stack) {
    payload.stack = err.stack;
  }

  const context = `${req.method} ${req.originalUrl}`;
  if (isServerError) {
    console.error(context, err);
  } else {
    console.warn(context, err.message);
  }

  res.status(statusCode).json(payload);
};
