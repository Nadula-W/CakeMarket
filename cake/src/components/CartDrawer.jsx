import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, onClose, onCheckout }) {
  const nav = useNavigate();
  const { items, removeFromCart, setQty, clearCart } = useCart();

  const empty = items.length === 0;

  const goCheckout = () => {
    onClose?.();
    if (onCheckout) return onCheckout();
    nav("/checkout");
  };

  const apiBase = "http://localhost:5000";

  const lines = useMemo(() => items, [items]);

  const subtotal = useMemo(
    () =>
      items.reduce((s, it) => s + (it.cake?.price || 0) * (it.qty || 0), 0),
    [items]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Your Cart</h3>
          <button className="px-3 py-1 rounded border" onClick={onClose}>Close</button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {empty && <p className="text-neutral-500">Cart is empty.</p>}

          {!empty &&
            lines.map((it) => {
              const cake = it.cake || {};
              const src = cake.imageUrl
                ? cake.imageUrl.startsWith("http")
                  ? cake.imageUrl
                  : `${apiBase}${cake.imageUrl}`
                : "";

              return (
                <div key={cake._id} className="border rounded-xl p-3 flex gap-3">
                  <div className="h-16 w-16 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                    {src ? (
                      <img className="h-full w-full object-cover" src={src} alt={cake.name} />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{cake.name}</p>
                        <p className="text-xs text-neutral-500">{cake.category} • {cake.district}</p>
                        <p className="text-xs text-neutral-700">{cake.bakerId?.bakerProfile?.bakeryName || cake.bakerId?.name || 'Bakery'}</p>
                      </div>
                      <button
                        className="text-sm text-pink-600"
                        onClick={() => removeFromCart(cake._id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          className="h-8 w-8 rounded border"
                          onClick={() => setQty(cake._id, it.qty - 1)}
                        >
                          −
                        </button>
                        <span className="min-w-[24px] text-center">{it.qty}</span>
                        <button
                          className="h-8 w-8 rounded border"
                          onClick={() => setQty(cake._id, it.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold">Rs { (cake.price || 0) * (it.qty || 0) }</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-semibold">Rs {subtotal}</span>
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 h-11 rounded-lg border"
              onClick={clearCart}
              disabled={empty}
            >
              Clear
            </button>
            <button
              className="flex-1 h-11 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 disabled:opacity-50"
              onClick={goCheckout}
              disabled={empty}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
