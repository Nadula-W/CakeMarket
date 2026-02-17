import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token === "success") {
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white p-8 rounded-xl border shadow-sm text-center">
        <h2 className="text-2xl font-semibold mb-2 text-neutral-900">
          Email verified ✅
        </h2>
        <p className="text-neutral-500">
          Redirecting you to login…
        </p>
      </div>
    </div>
  );
}
