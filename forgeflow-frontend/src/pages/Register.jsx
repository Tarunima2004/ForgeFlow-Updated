import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

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
if (token) {
  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}
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
console.log(jobRoles);
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
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border p-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
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
  onChange={(e) => setJobRole(e.target.value)}
  className="w-full border p-2"
>
  <option value="">Select Job Role</option>

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

      </form>

    </div>
  );
}

export default Register;