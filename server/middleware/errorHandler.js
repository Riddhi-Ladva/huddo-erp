export default function errorHandler(err, req, res, next) {
  console.error(`[Error Handler]`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Specific handling for mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: `Validation Error: ${messages.join(', ')}`,
      data: null
    });
  }

  // Specific handling for mongoose Duplicate Key Errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({
      success: false,
      message: `Duplicate field error: The ${field} value already exists.`,
      data: null
    });
  }

  // Specific handling for JWT signature/expiry errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token',
      data: null
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authorization token has expired',
      data: null
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
