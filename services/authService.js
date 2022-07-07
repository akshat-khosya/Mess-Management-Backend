const { getUser, newUser, updateUser } = require("../queries/userQuery");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email.utils");
const { getToken, newToken, deleteToken } = require("../queries/tokenQuery");
const { getDate, durationTime } = require("../utils/date.utils");
const forgetPasswordTime = require("../constants/time");
exports.useRegester = async (data) => {
  const checkUser = await getUser({ email: data.email });
  if (checkUser) {
    return { code: 401, data: { msg: "user already exists" } };
  }
  const genPassword = otpGenerator.generate(8, {
    upperCaseAlphabets: true,
    specialChars: true,
    lowerCaseAlphabets: true,
  });
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(genPassword, salt);
  const userData = {
    password,
    ...data,
  };
  const user = await newUser(userData);
  sendEmail(
    data.email,
    "Password",
    `<p>Your auto genrated Password is ${genPassword}</p>`
  );
  return { code: 200, data: { msg: "user resgister succesfully" } };
};

exports.login = async (data, ip) => {
  const checkUser = await getUser({ email: data.email });
  if (!checkUser) {
    return { code: 401, data: { msg: "Invalid credentials" } };
  }
  const validate = await bcrypt.compare(data.password, checkUser.password);
  if (!validate) {
    return { code: 401, data: { msg: "Invalid credentials" } };
  }
  const { password, ...others } = checkUser._doc;
  const tokenData = {
    uid: checkUser._id.toString(),
    ip: ip,
    password: checkUser.password
  }

  const jwtToken = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "30d" });
  sendEmail(others.email, "Login", `Your account got login at ${ip}`);
  return { code: 200, data: { msg: "Login", userData: others, token: jwtToken } };

};


exports.autoLogin = async (data) => {
  const checkUser = await getUser({ _id: data._id });
  const { password, ...others } = checkUser._doc;
  return { code: 200, data: { userData: others } };
}

exports.changePassword = async (data, user, ip) => {
  const validate = await bcrypt.compare(data.password, user.password);
  if (!validate) {
    return { code: 401, data: { msg: "Password didn't matches" } };
  }
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(data.rpassword, salt);
  updateUser({ _id: user._id }, { password: password });
  const checkUser = await getUser({ _id: user._id });
  sendEmail(checkUser.email, "Password Change", `Your account got change password at ${ip}`);

  const tokenData = {
    uid: checkUser._id.toString(),
    ip: ip,
    password: checkUser.password
  }
  const jwtToken = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "30d" });
  return { code: 200, data: { msg: "password changes", token: jwtToken } };

}



exports.forgetPassword = async (data) => {
  const checkUser = await getUser({ email: data.email });
  if (!checkUser) {
    return { code: 401, data: { msg: "Invalid Email address" } };
  }
  const checkToken = await getToken({ userID: checkUser._id.toString() });
  console.log(checkToken);
  if (checkToken) {
    if (checkToken.type === "password") {
      const currTime = getDate();
      const comp = durationTime(getToken.sentTime, currTime);
      const result = checkTime(comp, forgetPasswordTime);
      if (result) {
        return { code: 401, data: { msg: "Link is already sent"} };
      }
      const de=await deleteToken({_id:checkToken._id});
    }
  }
  const otp = otpGenerator.generate(64, {
    upperCaseAlphabets: true,
    specialChars: false,
    lowerCaseAlphabets: true,
  });
  const tokenData = {
    userID: checkUser._id.toString(),
    type: "password",
    token: otp,
    sentTime: getDate()
  };
  newToken(tokenData);
  console.log(otp);
  const link = `${process.env.URL}api/v1/auth/reset/password/${otp}`;
  sendEmail(checkUser.email, "Password reset", `<p>your link to resset password is valid till this much hours <a href=${link}>click me</a></p>`);
  return { code: 200, data: { msg: "Resset link sent to mail" } };
}

exports.authToken = async (data) => {
  const getToken = await getToken({ token: data });
  if (!getToken) {
    return { code: 401, data: { msg: "Invalid link" } };
  }
  const currTime = getDate();
  const comp = durationTime(getToken.sentTime, currTime);
  const result = checkTime(comp, forgetPasswordTime);
  if (result) {
    return { code: 200, data: { msg: "Link is valid", userData: getToken.userID } };
  }
  return { code: 401, data: { msg: "Link expired" } };


}