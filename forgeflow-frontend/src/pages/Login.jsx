import { useState } from "react";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const {
  login,
  token,
    user,
} = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setIsLoading(true);

    try {

      const data =
        await loginUser({
          email,
          password,
        });
      login(
        data.data.user,
        data.data.token
      );


      if (data.data.user.role === "admin") {

  navigate("/dashboard");

} else {

  navigate("/user-dashboard");

}

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setIsLoading(false);

    }
  };
  if (token) {

  return (

    <Navigate

      to={
        user?.role === "admin"
          ? "/dashboard"
          : "/user-dashboard"
      }

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
          Login
        </h1>

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
          className="w-full bg-black p-2 text-white disabled:opacity-50"
        >
          {
            isLoading
              ? "Logging In..."
              : "Login"
          }
        </button>
        <div className="text-center pt-4">

  <p className="text-sm text-gray-600">

    New User?

    <button
      type="button"
      onClick={() => navigate("/register")}
      className="ml-2 font-semibold text-blue-600 hover:underline"
    >
      Register
    </button>

  </p>

</div>
      </form>
    </div>
  );
}

export default Login;