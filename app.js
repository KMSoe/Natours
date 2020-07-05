const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const path = require("path");
const ejs = require("ejs");
const engine = require("ejs-mate");
const cookieParser = require('cookie-parser');
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");
const Tour = require("./models/tourModel");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", engine);
app.set("view engine", "ejs");

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data snaitization against XSS
app.use(xss());

// app.use((req,res,next)=>{
//   console.log(`Hello from middleware...`);
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const limiter = rateLimit({
  max: 100,
  windowMs: 1000 * 60 * 60,
  message: "Too many reuest with the same ip",
});
app.use("/api", limiter);
// app.get('/',(req,res)=>{
//     res
//         .status(200)
//         .json({text:'Welcome From my site.',name:'Kaung Myat Soe'});
// });

// app.post('/',(req,res)=>{
//     res.send("Post request");
// });

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createNewTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Routes
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

//Error handler
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status : "Fail",
  //   message : "Invalid Path"
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!!!`);
  // err.statusCode = 404;
  // err.status = 'Fail';
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!!!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
