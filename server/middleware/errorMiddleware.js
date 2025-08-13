const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} does not exist`,
    timestamp: new Date()
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('[Global Error Handler]', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: err.name || 'Server Error',
    message: message,
    timestamp: new Date(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { notFound, errorHandler };