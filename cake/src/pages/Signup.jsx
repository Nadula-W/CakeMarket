import { useState } from "react";
import { registerUser, googleLogin } from "../services/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import GoogleRoleModal from "../components/GoogleRoleModal";

export default function Signup() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("buyer"); // buyer | baker
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bakeryName: "",
    district: "",
    contactNumber: "",
  });

  const [googleCred, setGoogleCred] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalError, setRoleModalError] = useState("");
  const [roleModalLoading, setRoleModalLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    setError("");
    setInfo("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (mode === "baker") {
      if (!form.bakeryName.trim() || !form.district.trim() || !form.contactNumber.trim()) {
        setError("Bakery name, district and contact number are required.");
        return;
      }
    }

    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: mode,
        bakeryName: mode === "baker" ? form.bakeryName : undefined,
        district: mode === "baker" ? form.district : undefined,
        contactNumber: mode === "baker" ? form.contactNumber : undefined,
      });

      setInfo(res.data.message || "Account created. Please verify your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSignup = async (credential) => {
    setError("");
    setInfo("");

    if (mode === "baker") {
      if (!form.bakeryName.trim() || !form.district.trim() || !form.contactNumber.trim()) {
        setError("Bakery name, district and contact number are required.");
        return;
      }
    }

    try {
      const res = await googleLogin({
        token: credential,
        role: mode,
        bakeryName: mode === "baker" ? form.bakeryName.trim() : undefined,
        district: mode === "baker" ? form.district.trim() : undefined,
        contactNumber: mode === "baker" ? form.contactNumber.trim() : undefined,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // if baker pending approval
      if (res.data.user.role === "baker" && res.data.user.isApproved === false) {
        setInfo("Account created. Your baker account is pending approval.");
        navigate("/login");
        return;
      }

      navigate("/");
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "ROLE_REQUIRED") {
        setGoogleCred(credential);
        setRoleModalError("");
        setRoleModalOpen(true);
        return;
      }
      setError(err.response?.data?.message || "Google signup failed");
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

      if (res.data.user.role === "baker" && res.data.user.isApproved === false) {
        setInfo("Account created. Your baker account is pending approval.");
        navigate("/login");
        return;
      }

      navigate("/");
    } catch (err) {
      setRoleModalError(err.response?.data?.message || "Could not continue.");
    } finally {
      setRoleModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-semibold mb-1">Create account</h1>
        <p className="text-neutral-500 mb-6">
          Choose customer or baker and sign up
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
            Baker (Seller)
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-pink-600">{error}</p>}
        {info && <p className="mb-4 text-sm text-green-600">{info}</p>}

        <input
          name="name"
          placeholder="Full name"
          className="w-full h-12 px-4 mb-3 rounded-lg border"
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          className="w-full h-12 px-4 mb-3 rounded-lg border"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full h-12 px-4 mb-3 rounded-lg border"
          onChange={handleChange}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          className="w-full h-12 px-4 mb-4 rounded-lg border"
          onChange={handleChange}
        />

        {mode === "baker" && (
          <div className="border-l-2 border-pink-600 pl-4 mb-4 space-y-3">
            <input
              name="bakeryName"
              placeholder="Bakery name *"
              className="w-full h-12 px-4 rounded-lg border"
              onChange={handleChange}
            />
            <input
              name="district"
              placeholder="District *"
              className="w-full h-12 px-4 rounded-lg border"
              onChange={handleChange}
            />
            <input
              name="contactNumber"
              placeholder="Contact number *"
              className="w-full h-12 px-4 rounded-lg border"
              onChange={handleChange}
            />
          </div>
        )}

        <button
          onClick={handleSignup}
          className="w-full h-12 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition"
        >
          Sign up with Email
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t" />
          <span className="px-3 text-xs text-neutral-400">OR</span>
          <div className="flex-1 border-t" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(cred) => handleGoogleSignup(cred.credential)}
            onError={() => setError("Google signup failed")}
          />
        </div>

        <p className="mt-8 text-sm text-neutral-500 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-pink-600 font-medium">
            Log in
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
