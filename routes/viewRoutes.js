const express = require("express");

const router = express.Router();

const viewController = require('../controllers/viewController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

router.get('/', bookingController.createBookCheckout, authController.isLoggedIn, viewController.getOverview);
router.get('/tours/:tourId', authController.isLoggedIn, viewController.getTour);
router.get('/login',authController.isLoggedIn, viewController.getLoginForm);
router.get('/logout',authController.isLoggedIn, authController.logout);
router.get('/me',authController.protect,  viewController.getAccount);
router.get('/my-tours',authController.protect,  viewController.getMyTours);

router.post('/submit-user-data', authController.protect, viewController.updateUser);


module.exports = router;
