const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');

exports.getOverview = catchAsync( async (req, res) => {
  //Get data
  const tours = await Tour.find();
  res.status(200).render("overview",{
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync( async (req, res, next) => {
  const tour = await Tour.findOne({_id: req.params.tourId}).populate({
    path: 'reviews',
    select: 'review rating user'
  });
  
  if(!tour){
    return next(new AppError('There is no tour with this id.', 404))
  }
  
  res.status(200).render("tour-detail",{
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  
  res.status(200).render("login",{
    title: 'Login',
  });
}

exports.getAccount = (req, res) => {
  
  res.status(200).render("account",{
    title: 'My Account',
    user: res.locals.user
  });
}
exports.getMyTours = catchAsync( async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render("overview",{
    title: 'My Tours',
    tours
  });
});
exports.updateUser = catchAsync( async(req, res, next) => {
  
  const user = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.username,
    email: req.body.email,
  },{
    new: true,
    runValidators: true,
  });
  res.status(200).render("account",{
    title: 'Jonas',
    user,
  });
});