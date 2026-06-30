const axios = require("axios");
const BREVO_API_URL =
  "https://api.brevo.com/v3/smtp/email";
async function sendEmail({
  to,
  subject,
  html,
}) {

  try {

    const response =
      await axios.post(

        BREVO_API_URL,

        {

          sender: {

            email:
              process.env.EMAIL_FROM,

            name:
              process.env.EMAIL_FROM_NAME,

          },

          to: [

            {

              email: to,

            },

          ],

          subject,

          htmlContent: html,

        },

        {

          headers: {

            "api-key":
              process.env.BREVO_API_KEY,

            "Content-Type":
              "application/json",

          },

        }

      );

    console.log("========== BREVO SUCCESS ==========");
    console.dir(response.data, { depth: null });
    console.log("==================================");

    return response.data;

  }

  catch (error) {

    console.log("========== BREVO ERROR ==========");
    console.dir(error.response?.data, { depth: null });
    console.log("================================");
    console.log(process.env.BREVO_API_KEY);

    throw error;

  }

}
// ==============================
// Send OTP Email
// ==============================

async function sendOtpEmail({

  email,

  otp,

}) {

  const html = `

    <div
      style="
        font-family:Arial;
        max-width:500px;
        margin:auto;
      "
    >

      <h2>
        Verify Your Email
      </h2>

      <p>

        Welcome to ForgeFlow.

      </p>

      <p>

        Your OTP is

      </p>

      <h1>

        ${otp}

      </h1>

      <p>

        This OTP expires
        in 5 minutes.

      </p>

    </div>

  `;

  return sendEmail({

    to: email,

    subject:
      "Verify Your Email",

    html,

  });

}

module.exports = {

  sendEmail,

  sendOtpEmail,

};