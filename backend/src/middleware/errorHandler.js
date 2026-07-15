function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  console.error(err.message);
  res.status(statusCode).json({ success: false, message: err.message || "Internal Server Error" });
}

module.exports = { notFound, errorHandler };