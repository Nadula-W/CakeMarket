import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-neutral-50 text-neutral-800 pt-12">
      <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-4 lg:grid-cols-4">
        {/* Brand + CTA */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <h3 className="text-2xl font-extrabold text-pink-600">CakeMarket</h3>
          </Link>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Discover handcrafted cakes from local bakers. Order for events or
            customize your dream cake — we make celebrations sweeter.
          </p>

          <div className="mt-2">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2 max-w-sm"
            >
              <input
                aria-label="Email for newsletter"
                placeholder="Get updates"
                className="flex-1 h-10 px-3 rounded-lg border bg-white text-sm"
              />
              <button className="h-10 px-3 rounded-lg bg-pink-600 text-white text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="font-semibold text-neutral-800 mb-3">Shop</h4>
          <ul className="space-y-2 text-neutral-600 text-sm">
            <li>
              <Link to="/browse?category=Wedding" className="hover:text-pink-600">
                Wedding Cakes
              </Link>
            </li>
            <li>
              <Link to="/browse?category=Birthday" className="hover:text-pink-600">
                Birthday Cakes
              </Link>
            </li>
            <li>
              <Link to="/browse" className="hover:text-pink-600">
                Custom Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Bakers */}
        <div>
          <h4 className="font-semibold text-neutral-800 mb-3">Bakers</h4>
          <ul className="space-y-2 text-neutral-600 text-sm">
            <li>
              <Link to="/signup" className="hover:text-pink-600">
                Join as a Baker
              </Link>
            </li>
            <li>
              <Link to="/baker/dashboard" className="hover:text-pink-600">
                Seller Dashboard
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-pink-600">
                Success Stories
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-neutral-800 mb-3">Support</h4>
          <ul className="space-y-2 text-neutral-600 text-sm">
            <li>
              <Link to="/help" className="hover:text-pink-600">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-pink-600">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-pink-600">
                Privacy Policy
              </Link>
            </li>
          </ul>

          <div className="mt-4 flex items-center gap-3">
            <a aria-label="Instagram" href="#" className="text-neutral-600 hover:text-pink-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="">
                <rect x="2" y="3" width="20" height="18" rx="4" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <path d="M17.5 6.5h.01" />
              </svg>
            </a>
            <a aria-label="Facebook" href="#" className="text-neutral-600 hover:text-pink-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a aria-label="WhatsApp" href="#" className="text-neutral-600 hover:text-pink-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a5 5 0 0 1-4.5 4.95A19 19 0 0 1 3 5.5 5 5 0 0 1 8.5 1 19 19 0 0 1 21 15z" />
                <path d="M22 2l-5 5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-neutral-600">
          <div>© {new Date().getFullYear()} CakeMarket. All rights reserved.</div>
          <div className="mt-3 md:mt-0">Built with ❤️ · Terms · Privacy</div>
        </div>
      </div>
    </footer>
  );
}
