const { check } = require("express-validator");
const newUserValidations = [
    check("email").isEmail(),
    check("name").notEmpty()
];
const loginValidation=[
    check("email").isEmail(),
    check("password").isLength({min:6})
  ];
module.exports = {newUserValidations,loginValidation};