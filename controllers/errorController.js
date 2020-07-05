const AppError = require("../utils/appError");

const handleDBCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
const handleDBDublicateError = (err) => {
  const message = `${err.errmsg}`;
  return new AppError(message, 500);
};
const handleDBValidateError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${err.message}`;
  return new AppError(errors, 500);
};
const handleJWTError = () => {
  return new AppError("Invalid token. Please login agian!!!", 401);
};
const handleTokenExpireError = () => {
  return new AppError(
    "Your Token had been expired. Please login agian!!!",
    401
  );
};
const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.locals.user = req.user ? req.user : "";
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!!!",
      message: err.message,
    });
  }
};
const sendErrProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    //Operational Error, send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      //Programming Error, Don't leak error details
    } else {
      console.error("ERROR", err);

      res.status(500).json({
        status: "Fail",
        message: "Something went wrong",
      });
    }
  } else {
    res.locals.user = req.user ? req.user : "";
    if (err.isOperational) {
      
      res.status(err.statusCode).render("error", {
        title: "Something went wrong!!!",
        message: err.message,
      });

      //Programming Error, Don't leak error details
    } else {
      console.error("ERROR", err);

      res.status(500).render('error',{
        title: "Something went wrong!!!",
        message: err.message,
      });
    }
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //Internal Server Error
  err.status = err.status || "Fail";

  if (process.env.NODE_ENV == "development") {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV == "production") {
    let error = { ...err };
    error.message = err.message;
    
    if (error.name === "CastError") {
      error = handleDBCastError(error);
    }
    if (error.code === 11000) {
      error = handleDBDublicateError(error);
    }
    if (error.name === "ValidationError") {
      error = handleDBValidateError(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (error.name === "TokenExpiredError") {
      error = handleTokenExpireError();
    }
    sendErrProd(error, req, res);
  }
};
