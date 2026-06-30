import api from "../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};
export async function sendEmailOtp(
  email
) {

  const response =
    await api.post(
      "/auth/send-email-otp",
      {
        email,
      }
    );

  return response.data;

}
export async function verifyEmailOtp(
  email,
  otp
) {

  const response =
    await api.post(
      "/auth/verify-email-otp",
      {
        email,
        otp,
      }
    );

  return response.data;

}