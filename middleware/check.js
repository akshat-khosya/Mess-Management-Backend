const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { getUser } = require("../queries/userQuery");
exports.checkAuth = async (req, res, next) => {
  try {
    const authtkn = req.header("x-auth-token");

    if (!authtkn) {
      return res
        .status(400)
        .json({ msg: "No auth token found. Please login again." });
    }
    let decoded = jwt.verify(authtkn, process.env.JWT_SECRET);

    if (decoded.ip !== req.socket.localAddress) {
      return res
        .status(400)
        .json({ msg: "Invalid auth token. Please login again." });
    }
    const checkUser = await getUser({ _id: decoded.uid });
    if (checkUser.password !== decoded.password) {
      return res
        .status(400)
        .json({ msg: "Invalid auth token. Please login again." });
    }
    req.user = checkUser;
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Invalid auth token. Please login again." });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(400)
        .json({ msg: "Invalid request" });
    }
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ msg: "Invalid request" });
  }
}

exports.isValidToken = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (token.length !== 64) {
      return res
      .status(400)
      .json({ msg: "Invalid link" });
     
    }
    req.user=token;
    next();
   
  } catch (err) {
    return res
      .status(400)
      .json({ msg: "Invalid request" });
  }
}