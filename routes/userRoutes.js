const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:resetToken", authController.resetPassword);

router.use(authController.protect);

router.patch("/updateMypassword", authController.updatepassword);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserUploadedPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

router.get("/me", userController.getMe, userController.getUser);

router.use(authController.restrict("admin"));
router.get("/", userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
