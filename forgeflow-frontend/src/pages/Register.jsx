import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("member");

    const { token } = useAuth();
  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

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
          role,
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
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="w-full border p-2"
        >
          <option value="member">
            Member
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

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