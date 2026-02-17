import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/api";

export default function Checkout() {
  const nav = useNavigate();
  const { items, subtotal, clear } = useCart();

  const [deliveryDistrict, setDeliveryDistrict] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setInfo("");

    if (items.length === 0) {
      setError("Cart is empty.");
      return;
    }
    if (!buyerPhone.trim()) {
      setError("Phone number is required (for SMS updates).");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ cakeId: i.cakeId, qty: i.qty })),
        deliveryDistrict: deliveryDistrict.trim(),
        note: note.trim(),
        buyerPhone: buyerPhone.trim(),
      };

      await placeOrder(payload);
      clear();
      setInfo("Order placed!");
      nav("/orders");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        {error && <p className="mt-4 text-sm text-pink-600">{error}</p>}
        {info && <p className="mt-4 text-sm text-green-600">{info}</p>}

        <div className="mt-6 bg-white border rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="h-11 px-3 rounded-lg border"
              placeholder="Delivery district (optional)"
              value={deliveryDistrict}
              onChange={(e) => setDeliveryDistrict(e.target.value)}
            />
            <input
              className="h-11 px-3 rounded-lg border"
              placeholder="Your phone (required for SMS)"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
            />
            <textarea
              className="md:col-span-2 min-h-[90px] px-3 py-2 rounded-lg border"
              placeholder="Note to baker (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-semibold">Rs {subtotal}</span>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-4 w-full h-11 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
