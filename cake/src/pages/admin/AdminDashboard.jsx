import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminDashboard() {
  const [bakers, setBakers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchBakers = async () => {
    const res = await API.get("/admin/pending-bakers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBakers(res.data);
  };

  const approveBaker = async (id) => {
    await API.put(`/admin/approve-baker/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBakers();
  };

  const rejectBaker = async (id) => {
    await API.delete(`/admin/reject-baker/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBakers();
  };

  useEffect(() => {
    fetchBakers();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl border p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Pending Baker Approvals
        </h1>

        {bakers.length === 0 && (
          <p className="text-neutral-500">No pending bakers 🎉</p>
        )}

        {bakers.map((b) => (
          <div
            key={b._id}
            className="border rounded-lg p-4 mb-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-neutral-600">{b.email}</p>
              <p className="text-sm">
                🍰 {b.bakerProfile?.bakeryName} | 📍 {b.bakerProfile?.district}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => approveBaker(b._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Approve
              </button>
              <button
                onClick={() => rejectBaker(b._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
