import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { registerUser,sendEmailOtp, verifyEmailOtp,} from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import {getJobRoles} from "../services/users.service";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  const [dept, setDept] =
  useState("Engineering");

    const { token } = useAuth();
  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =useState(false);
    const [jobRoles, setJobRoles] =useState({});
    const [jobRole, setJobRole] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [otpSent, setOtpSent] =
  useState(false);

const [otpMessage, setOtpMessage] =
  useState("");

const [sendingOtp, setSendingOtp] =
  useState(false);
  const [otp, setOtp] =
  useState("");

const [otpVerified, setOtpVerified] =
  useState(false);

const [verifyingOtp, setVerifyingOtp] =
  useState(false);

  const navigate = useNavigate();
const handleSendOtp =
  async () => {

    if (!email) {

      setError(
        "Please enter your email."
      );

      return;

    }

    try {

      setSendingOtp(true);

      setError("");

      const response =
        await sendEmailOtp(
          email
        );

      setOtpSent(true);

      setOtpMessage(
        response.message
      );

    }

    catch (error) {

      setError(

        error.response?.data?.message ||

        "Failed to send OTP."

      );

    }

    finally {

      setSendingOtp(false);

    }

  };
  const handleVerifyOtp =
  async () => {

    if (!otp) {

      setError(
        "Please enter OTP."
      );

      return;

    }

    try {

      setVerifyingOtp(true);

      setError("");

      const response =
        await verifyEmailOtp(
          email,
          otp
        );

      setOtpVerified(true);

      setOtpMessage(
        response.message
      );

    }

    catch (error) {

      setError(

        error.response?.data?.message ||

        "OTP Verification Failed."

      );

    }

    finally {

      setVerifyingOtp(false);

    }

  };
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!otpVerified) {

        setError(
            "Please verify your email before registering."
        );

        return;

    }

    setError("");
    try {

      setIsLoading(true);

      const data =
        await registerUser({
          name,
          email,
          password,
          dept,
           jobRole,
  phoneNumber,
        });

      console.log(
        "REGISTER SUCCESS"
      );

      console.log(data);

      navigate("/login");

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Registration Failed"
      );

    } finally {

      setIsLoading(false);

    }
  };
  useEffect(() => {

  async function fetchJobRoles() {

    try {

      const response =
        await getJobRoles();

      setJobRoles(
        response.data
      );

    } catch (error) {

      console.error(
        error
      );

    }

  }

  fetchJobRoles();

}, []);

if (token) {
  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}
  return (
    <div className="flex min-h-screen items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4"
      >

        <h1 className="text-3xl font-bold">
          Register
        </h1>


        <input
  type="email"
  placeholder="Email"
  value={email}
  disabled={otpVerified}
  onChange={(e) =>
    setEmail(e.target.value)
  }
  className="w-full border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
/>
{
  otpVerified && (

    <p className="text-green-600 font-medium">

      ✅ Email Verified

    </p>

  )
}
  {
  !otpVerified && (

    <button
      type="button"
      onClick={handleSendOtp}
      disabled={sendingOtp}
      className="w-full bg-blue-600 text-white p-2 rounded"
    >

      {
        sendingOtp
          ? "Sending OTP..."
          : "Verify Email"
      }

    </button>

  )
}
{
  otpMessage && (

    <p
      className={
        otpVerified

          ? "text-green-600"

          : "text-blue-600"
      }
    >

      {otpMessage}

    </p>

  )
}
{
  otpSent &&
  !otpVerified && (

    <>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value)
        }
        className="w-full border p-2"
      />

      <button
        type="button"
        onClick={handleVerifyOtp}
        disabled={verifyingOtp}
        className="w-full bg-green-600 text-white p-2 rounded"
      >

        {

          verifyingOtp

            ? "Verifying..."

            : "Verify OTP"

        }

      </button>

    </>

  )
}
{
  otpVerified && (

    <>

      {/* Registration Form Starts */}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        className="w-full border p-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="w-full border p-2"
      />

      <select
        value={dept}
        onChange={(e) =>
          setDept(e.target.value)
        }
        className="w-full border p-2"
      >
        <option value="Engineering">
          Engineering
        </option>

        <option value="Fashion">
          Fashion
        </option>

        <option value="Finance">
          Finance
        </option>

        <option value="Electronics">
          Electronics
        </option>

        <option value="Biotech">
          Biotech
        </option>

      </select>

      <select
        value={jobRole}
        onChange={(e) =>
          setJobRole(e.target.value)
        }
        className="w-full border p-2"
      >

        <option value="">
          Select Job Role
        </option>

        {(jobRoles[dept] || []).map((role) => (

          <option
            key={role}
            value={role}
          >
            {role}
          </option>

        ))}

      </select>

      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) =>
          setPhoneNumber(e.target.value)
        }
        className="w-full border p-2"
      />

      {
        error && (

          <p className="text-red-500">

            {error}

          </p>

        )
      }

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black p-2 text-white"
      >

        {
          isLoading

            ? "Creating Account..."

            : "Register"

        }

      </button>

    </>

  )
}
      </form>

    </div>
  );
}

export default Register;