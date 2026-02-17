import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleRoleButtons({ onGoogleToken, errorText = "" }) {
  const [role, setRole] = useState("buyer");

  const handleSuccess = (cred) => {
    if (onGoogleToken) onGoogleToken({ token: cred.credential, role });
  };

  const handleError = () => {
    if (onGoogleToken) onGoogleToken({ error: "Google sign-in failed" });
  };

  return (
    <div className="w-full">
      {errorText && <p className="text-sm text-pink-600 mb-2">{errorText}</p>}

      <div className="flex items-center justify-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="googleRole"
            value="buyer"
            checked={role === "buyer"}
            onChange={() => setRole("buyer")}
          />
          Buyer
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="googleRole"
            value="baker"
            checked={role === "baker"}
            onChange={() => setRole("baker")}
          />
          Baker
        </label>
      </div>

      <div className="flex justify-center">
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
}
