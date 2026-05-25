export function notFound(req, res, next) {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || res.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Server error',
    errors: err.errors || undefined
  });
}
