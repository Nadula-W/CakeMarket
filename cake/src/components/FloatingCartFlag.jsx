import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function FloatingCartFlag() {
  const { count, open, setOpen } = useCart();

  // close drawer on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <>
      <button
        aria-label="Open cart"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6h15l-2 9H8L6 6Z" />
          <path d="M6 6 5 3H2" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>

        {count > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-white text-pink-600 text-xs flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
