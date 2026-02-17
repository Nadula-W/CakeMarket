import { useState } from "react";
import { loginUser, googleLogin } from "../services/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import GoogleRoleModal from "../components/GoogleRoleModal";

export default function Login() {
  const navigate = useNavigate();

  // buyer or baker selection (only used for NEW google users)
  const [mode, setMode] = useState("buyer"); // "buyer" | "baker"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // ROLE_REQUIRED modal support
  const [googleCred, setGoogleCred] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalError, setRoleModalError] = useState("");
  const [roleModalLoading, setRoleModalLoading] = useState(false);

  const goByRole = (role) => {
    // change this based on your routes
    if (role === "baker") navigate("/"); // or /baker/dashboard
    else navigate("/");
  };

  const handleEmailLogin = async () => {
    setError("");
    setInfo("");

    try {
      const res = await loginUser({ email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      goByRole(res.data.user.role);
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg === "Verify your email first") {
        setInfo("Please verify your email before logging in.");
      } else if (msg === "Baker approval pending") {
        setInfo("Your baker account is pending approval.");
      } else {
        setError(msg || "Invalid email or password");
      }
    }
  };

  const handleGoogleDirect = async (credential) => {
    setError("");
    setInfo("");

    try {
      // ✅ Just send role (NO bakery info here)
      const res = await googleLogin({
        token: credential,
        role: mode,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      goByRole(res.data.user.role);
    } catch (err) {
      const code = err.response?.data?.code;
      const msg = err.response?.data?.message;

      // backend wants role selection (or role + details)
      if (code === "ROLE_REQUIRED") {
        setGoogleCred(credential);
        setRoleModalError("");
        setRoleModalOpen(true);
        return;
      }

      if (msg === "Baker approval pending") setInfo("Your baker account is pending approval.");
      else setError(msg || "Google login failed");
    }
  };

  const handleRoleSubmit = async (data) => {
    if (data?._clientError) {
      setRoleModalError(data._clientError);
      return;
    }
    if (!googleCred) return;

    setRoleModalLoading(true);
    setRoleModalError("");

    try {
      // ✅ if user selected baker in modal, modal will provide bakery fields
      const res = await googleLogin({
        token: googleCred,
        role: data.role,
        bakeryName: data.bakeryName,
        district: data.district,
        contactNumber: data.contactNumber,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setRoleModalOpen(false);
      setGoogleCred(null);

      goByRole(res.data.user.role);
    } catch (err) {
      setRoleModalError(err.response?.data?.message || "Could not continue.");
    } finally {
      setRoleModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-semibold mb-1 text-neutral-900">Log in</h1>
        <p className="text-neutral-500 mb-6">
          Choose customer or seller and continue
        </p>

        {/* TWO SECTIONS */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode("buyer")}
            className={`h-11 rounded-lg border text-sm font-medium ${
              mode === "buyer"
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white hover:bg-neutral-50"
            }`}
          >
            Customer
          </button>

          <button
            type="button"
            onClick={() => setMode("baker")}
            className={`h-11 rounded-lg border text-sm font-medium ${
              mode === "baker"
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white hover:bg-neutral-50"
            }`}
          >
            Seller
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-pink-600">{error}</p>}
        {info && <p className="mb-4 text-sm text-blue-600">{info}</p>}

        {/* EMAIL LOGIN */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full h-12 px-4 mb-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full h-12 px-4 mb-5 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleEmailLogin}
          className="w-full h-12 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition"
        >
          Log in with Email
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t" />
          <span className="px-3 text-xs text-neutral-400">OR</span>
          <div className="flex-1 border-t" />
        </div>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(cred) => handleGoogleDirect(cred.credential)}
            onError={() => setError("Google login failed")}
          />
        </div>

        <p className="mt-8 text-sm text-neutral-500 text-center">
          New to CakeMarket?{" "}
          <a href="/signup" className="text-pink-600 font-medium">
            Create an account
          </a>
        </p>
      </div>

      <GoogleRoleModal
        open={roleModalOpen}
        onClose={() => (roleModalLoading ? null : setRoleModalOpen(false))}
        onSubmit={handleRoleSubmit}
        loading={roleModalLoading}
        error={roleModalError}
        defaultRole={mode}
      />
    </div>
  );
}
