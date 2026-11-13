export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(_req, res) {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
}

export function errorHandler(error, _req, res, _next) {
  const status = Number.isInteger(error.status) ? error.status : 500;
  const message = status === 500 ? "Internal server error" : error.message;

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}
