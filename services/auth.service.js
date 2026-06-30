const { HttpError } = require("../utils/errors");
const usersService = require("../services/users.service");
const {getVerifiedOtpByEmail, deleteOtpByEmail,} = require("./emailOtp.service");
const { createAuthToken } = require("../utils/authToken");
const {hashPassword,verifyPassword,} =require("../utils/password");

function toSafeUser(user) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

async function register({ name, email, password, role ,dept, jobRole,phoneNumber}) {
  // ==============================
// Check Email Verification
// ==============================

const verifiedEmail =
  await getVerifiedOtpByEmail(
    email
  );

if (!verifiedEmail) {

  throw new HttpError(

    403,

    "Please verify your email before registering.",

    "EMAIL_NOT_VERIFIED"

  );

}
  const hashedPassword = hashPassword(password);

  const user = await usersService.createUser({
    name,
    email,
    password: hashedPassword,
    role,
    dept,
    jobRole,
    phoneNumber,
  });
  // ==============================
// Delete Used OTP
// ==============================

await deleteOtpByEmail(
  email
);

  const safeUser = toSafeUser(user);

  // ✅ FIXED HERE
  const token = createAuthToken({
    id: user.id,
    role: user.role,
  });

  return {
    user: safeUser,
    token,
  };
}

async function login({ email, password }) {
  const user = await usersService.getUserByEmail(email);

  if (!user) {
    throw new HttpError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  const isValid = verifyPassword(user.password, password);

  if (!isValid) {
    throw new HttpError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  const safeUser = toSafeUser(user);

  // ✅ FIXED HERE
  const token = createAuthToken({
    id: user.id,
    role: user.role,
  });

  return {
    user: safeUser,
    token,
  };
}

module.exports = {
  register,
  login,
};