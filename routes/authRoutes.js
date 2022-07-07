const { newUser, login, autoLogin, changePassword, forgetPassword } = require("../controllers/authController");
const { checkAuth, isAdmin, isValidToken } = require("../middleware/check");
const { newUserValidations, loginValidation,changePasswordValidation } = require("../validations/authValidations");

const router = require("express").Router();




router.post("/newuser", checkAuth, isAdmin, newUserValidations, newUser);                        // Admin validation + jwt 
router.post("/login", loginValidation, login);
router.post("/forgotpassword",forgetPassword);
router.post("/changepassword",checkAuth,changePasswordValidation,changePassword);                 // jwt validation
router.get("/autologin", checkAuth, autoLogin);             // jwt validation
router.get("/reset/password/:token",isValidToken);




module.exports = router;