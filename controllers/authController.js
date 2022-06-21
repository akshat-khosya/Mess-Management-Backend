const { validationResult } = require("express-validator");
const { useRegester, login, autoLogin, changePassword,forgetPassword } = require("../services/authService");
exports.newUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const response = await useRegester(req.body);
    return res.status(response.code).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const response = await login(req.body, req.socket.localAddress);
    return res.status(response.code).json(response.data);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Server Error" });
  }
};


exports.autoLogin = async (req, res) => {
  try {

    const response = await autoLogin(req.user);
    return res.status(response.code).json(response.data);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Server Error" });
  }
}

exports.changePassword = async (req, res) => {
  try {
    const response = await changePassword(req.body, req.user, req.socket.localAddress);
    return res.status(response.code).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Server Error" });
  }
}


exports.forgetPassword = async (req, res) => {
  try {
    const response = await forgetPassword(req.body);
    return res.status(response.code).json(response.data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: "Server Error" });
  }
}