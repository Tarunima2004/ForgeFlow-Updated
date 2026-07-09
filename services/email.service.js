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
// ==============================
// Send Project Assignment Email
// ==============================

async function sendProjectAssignmentEmail({

  email,

  name,

  projectName,

  permissionRole,

  designation,

}) {

  const roleText =
    permissionRole === "manager"
      ? "Manager"
      : "Member";

  const html = `

  <div
    style="
      font-family: Arial;
      max-width:600px;
      margin:auto;
      padding:20px;
      border:1px solid #ddd;
      border-radius:8px;
    "
  >

    <h2>
      Welcome to ForgeFlow
    </h2>

    <p>

      Hello <strong>${name}</strong>,

    </p>

    <p>

      ForgeFlow Admin has welcomed you as a
      <strong>${roleText}</strong>
      for the project

      <strong>${projectName}</strong>.

    </p>

    <p>

      <strong>Your Designation :</strong>

      ${designation}

    </p>

    <p>

      Please login to ForgeFlow to view your project.

    </p>

    <br/>

    <p>

      Regards,

      <br/>

      ForgeFlow Team

    </p>

  </div>

  `;

  return sendEmail({

    to: email,

    subject: `Welcome to ${projectName}`,

    html,

  });

}

module.exports = {

  sendEmail,

  sendOtpEmail,

  sendProjectAssignmentEmail,

};