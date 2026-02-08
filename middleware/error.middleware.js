const errorMiddleware = (err, req, res, next) => {
  try {
    console.error(err);

    let statusCode = err.statusCode || 500;
    let code = err.code || "SERVER_ERROR";
    let message = err.message || "Internal server error";

    // Mongoose: invalid ObjectId
    if (err.name === "CastError") {
      statusCode = 404;
      code = "RESOURCE_NOT_FOUND";
      message = "Resource not found";
    }

    // Mongoose: duplicate key
    if (err.code === 11000) {
      statusCode = 40;
      code = "DUPLICATE_FIELD";
      const field = Object.keys(err.keyValue)[0];
      message = `Duplicate value for field: ${field}`;
    }

    // Mongoose: validation error
    if (err.name === "ValidationError") {
      statusCode = 400;
      code = "VALIDATION_ERROR";
      message = Object.value(err.errors)
        .map((val) => val.message)
        .join(", ");
    }

    res.status(statusCode).json({
      error: {
        code,
        message,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
