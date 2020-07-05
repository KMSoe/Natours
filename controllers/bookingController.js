const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get Current Tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.id}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items:[
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1
            }
        ]
    });

    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session,
    });
});

exports.createBookCheckout = catchAsync( async (req, res, next) => {
    const { tour, user, price } = req.query;

    if(!tour && !user && !price) return next();
    await Booking.create({ tour, user, price});

    res.redirect(req.originalUrl.split('?')[0]);
});