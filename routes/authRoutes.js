const { newUser, login, autoLogin, changePassword, forgetPassword } = require("../controllers/authController");
const { checkAuth, isAdmin } = require("../middleware/check");
const { newUserValidations, loginValidation } = require("../validations/authValidations");

const router = require("express").Router();




router.post("/newuser", checkAuth, isAdmin, newUserValidations, newUser);                        // Admin validation + jwt 
router.post("/login", loginValidation, login);
router.post("/forgotpassword",forgetPassword);
router.post("/changepassword",checkAuth,changePassword);                 // jwt validation
router.get("/autologin", checkAuth, autoLogin);             // jwt validation





module.exports = router;