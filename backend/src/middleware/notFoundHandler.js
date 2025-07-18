const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
};

module.exports = notFoundHandler;
