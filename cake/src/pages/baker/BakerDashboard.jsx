import { useEffect, useState } from "react";
import { createCake, getMyCakes, updateCake, deleteCake } from "../../services/api";
import { getBakerOrders, updateOrderStatus } from "../../services/api";

const CATEGORY_OPTIONS = [
  "Wedding",
  "Birthday",
  "Cupcakes",
  "Vegan",
  "Gluten Free",
  "Macarons",
  "Customized",
];

export default function BakerDashboard() {
  const [cakes, setCakes] = useState([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Birthday",
    district: "",
  image: null,
  imageUrl: "",
    available: true,
  });

  const [editingId, setEditingId] = useState(null);

 const load = async () => {
    try {
      const res = await getMyCakes();
      setCakes(res.data);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load cakes");
    }
  };

  useEffect(() => {
    load();
    
  }, []);

 const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  setForm((p) => ({
    ...p,
    [name]:
      type === "checkbox"
        ? checked
        : type === "file"
        ? files?.[0] || null
        : value,
  }));
};


  const reset = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "Birthday", // ✅ keep default
      district: "",
  image: null,
  imageUrl: "",
      available: true,
    });
    setEditingId(null);
  };

  const submit = async () => {
    setError("");
    setInfo("");

    if (!form.name.trim() || form.price === "") {
      setError("Cake name and price are required.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

       const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description);
    formData.append("price", String(Number(form.price)));
    formData.append("category", form.category.trim());
    formData.append("district", form.district.trim());
    formData.append("available", String(form.available));

    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        await updateCake(editingId, formData);
        setInfo("Cake updated");
      } else {
        await createCake(formData);
        setInfo("Cake added");
      }

      reset();
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not save cake");
    }
  };

  const startEdit = (cake) => {
    setEditingId(cake._id);
    setForm({
      name: cake.name || "",
      description: cake.description || "",
      price: String(cake.price ?? ""),
      category: cake.category || "Birthday", // ✅ IMPORTANT
      district: cake.district || "",
  image: null,
  imageUrl: cake.imageUrl || "",
      available: cake.available ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this cake?")) return;
    try {
      await deleteCake(id);
      setInfo("Cake deleted");
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not delete cake");
    }
  };

  const [orders, setOrders] = useState([]);

    const loadOrders = async () => {
      try {
        const res = await getBakerOrders();
        setOrders(res.data);
      } catch (e) {
        // optional error handling
      }
    };

    useEffect(() => {
      load();
      loadOrders();
    }, []);

    const setOrderStatus = async (id, status) => {
      try {
        await updateOrderStatus(id, { status });
        setInfo(`Order ${status}`);
        loadOrders();
      } catch (e) {
        setError(e.response?.data?.message || "Could not update order");
      }
    };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-neutral-900">Baker Dashboard</h1>
          <p className="text-neutral-500 mt-1">Add and manage your cakes.</p>

          {error && <p className="mt-4 text-sm text-pink-600">{error}</p>}
          {info && <p className="mt-4 text-sm text-green-600">{info}</p>}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="name"
              placeholder="Cake name *"
              className="h-11 px-3 rounded-lg border"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="price"
              placeholder="Price *"
              className="h-11 px-3 rounded-lg border"
              value={form.price}
              onChange={handleChange}
            />

            {/* ✅ CATEGORY DROPDOWN */}
            <select
              name="category"
              className="h-11 px-3 rounded-lg border bg-white"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              name="district"
              placeholder="District"
              className="h-11 px-3 rounded-lg border"
              value={form.district}
              onChange={handleChange}
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  image: e.target.files[0],
                }))
              }
            />

            {/* Image preview: new selection takes precedence, otherwise show existing imageUrl */}
            <div className="md:col-span-2">
              {form.image ? (
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  className="w-40 h-28 object-cover rounded-md mt-2"
                />
              ) : form.imageUrl ? (
                <img
                  src={form.imageUrl.startsWith("http") ? form.imageUrl : `http://localhost:5000${form.imageUrl}`}
                  alt="Current"
                  className="w-40 h-28 object-cover rounded-md mt-2"
                />
              ) : null}

              {(form.image || form.imageUrl) && (
                <div className="mt-2">
                  <button
                    onClick={() => setForm((p) => ({ ...p, image: null, imageUrl: "" }))}
                    className="text-sm text-pink-600 underline"
                    type="button"
                  >
                    Remove image
                  </button>
                </div>
              )}
            </div>


            <textarea
              name="description"
              placeholder="Description"
              className="md:col-span-2 min-h-[90px] px-3 py-2 rounded-lg border"
              value={form.description}
              onChange={handleChange}
            />

            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="accent-pink-600"
              />
              Available
            </label>

            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={submit}
                className="h-11 px-5 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700"
              >
                {editingId ? "Update Cake" : "Add Cake"}
              </button>

              {editingId && (
                <button
                  onClick={reset}
                  className="h-11 px-5 rounded-lg border hover:bg-neutral-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-6 bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Your Cakes</h2>

          {cakes.length === 0 && (
            <p className="text-neutral-500">No cakes yet. Add your first one 🍰</p>
          )}

          <div className="space-y-3">
            {cakes.map((c) => (
              <div
                key={c._id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-neutral-700">
                    {c.bakerId?.bakerProfile?.bakeryName || c.bakerId?.name || "Bakery"}
                  </p>
                  <p className="text-sm text-neutral-600">
                    Rs {c.price} • {c.category} • {c.district || "No district"} •{" "}
                    {c.available ? "Available" : "Hidden"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(c)}
                    className="px-4 py-2 rounded-lg border hover:bg-neutral-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(c._id)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              <div className="mt-6 bg-white border rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">New Orders</h2>

                {orders.length === 0 && <p className="text-neutral-500">No orders yet.</p>}

                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o._id} className="border rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order: {o._id}</p>
                          <p className="text-sm text-neutral-600">
                            Status: <span className="font-medium">{o.status}</span> • Rs {o.subtotal}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Delivery: {o.deliveryDistrict || "—"} • Buyer phone: {o.buyerPhone || "—"}
                          </p>
                          {o.note ? <p className="text-sm text-neutral-600 mt-1">Note: {o.note}</p> : null}
                        </div>

                        {o.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setOrderStatus(o._id, "accepted")}
                              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => setOrderStatus(o._id, "rejected")}
                              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 border-t pt-3">
                        <p className="text-sm font-medium mb-2">Items</p>
                        <ul className="text-sm text-neutral-700 space-y-1">
                          {o.items.map((it, idx) => (
                            <li key={idx}>
                              {it.name} × {it.qty} — Rs {it.price * it.qty}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>
      </div> 
    </div>
  );
}
