import { useEffect, useState } from "react";

export default function GoogleRoleModal({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  defaultRole = "buyer",
}) {
  const [role, setRole] = useState(defaultRole);

  const [bakeryName, setBakeryName] = useState("");
  const [district, setDistrict] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    if (open) {
      setRole(defaultRole);
      setBakeryName("");
      setDistrict("");
      setContactNumber("");
    }
  }, [open, defaultRole]);

  if (!open) return null;

  const submit = () => {
    if (role === "baker") {
      if (!bakeryName.trim() || !district.trim() || !contactNumber.trim()) {
        onSubmit({ _clientError: "Bakery name, district and contact number are required." });
        return;
      }
    }

    onSubmit({
      role,
      bakeryName: role === "baker" ? bakeryName.trim() : undefined,
      district: role === "baker" ? district.trim() : undefined,
      contactNumber: role === "baker" ? contactNumber.trim() : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Continue with Google</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Choose your account type to continue.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-neutral-500 hover:text-neutral-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`h-11 rounded-lg border text-sm font-medium ${
              role === "buyer"
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white hover:bg-neutral-50"
            }`}
          >
            Customer
          </button>

          <button
            type="button"
            onClick={() => setRole("baker")}
            className={`h-11 rounded-lg border text-sm font-medium ${
              role === "baker"
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white hover:bg-neutral-50"
            }`}
          >
            Seller
          </button>
        </div>

        {role === "baker" && (
          <div className="mt-4 space-y-3 border-l-2 border-pink-600 pl-4">
            <input
              placeholder="Bakery name *"
              className="w-full h-11 px-3 rounded-lg border"
              value={bakeryName}
              onChange={(e) => setBakeryName(e.target.value)}
            />
            <input
              placeholder="District *"
              className="w-full h-11 px-3 rounded-lg border"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
            <input
              placeholder="Contact number *"
              className="w-full h-11 px-3 rounded-lg border"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            <p className="text-xs text-neutral-500">
              Sellers may be <b>pending approval</b>.
            </p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-pink-600">{error}</p>}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="flex-1 h-11 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 disabled:opacity-60"
          >
            {loading ? "Continuing..." : "Continue"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 px-5 rounded-lg border hover:bg-neutral-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
 