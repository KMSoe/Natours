const express = require("express");

const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");
const router = express.Router();

router.get("/top-5", tourController.getTopFive, tourController.getAllTours);
router.get("/tour-stats", tourController.getTourStats);
router.get(
  "/monthly-plan/:year",
  authController.protect,
  authController.restrict("admin", "lead-guide"),
  tourController.getMonthlyPlan
);
router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrict("admin", "lead-guide"),
    tourController.createNewTour
  );
router.get('/tours-within/:distance/center/:latlng/unit/:unit', tourController.getToursWithin);
router.get('/distances/:latlng/unit/:unit', tourController.getDistances);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.uploadTourPhoto, tourController.resizeTourImages, tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrict("admin"),
    tourController.deleteTour
  );

//merge params
router.use("/:tourId/reviews", reviewRouter);

// tour/2142342342/reviews
// router
//   .route("/:tourId/reviews")
//   .post(
//     authController.protect,
//     authController.restrict("user"),
//     reviewController.createReview
//   );
module.exports = router;
