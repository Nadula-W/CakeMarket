import { Link, useNavigate } from "react-router-dom";
import { getUser, isLoggedIn, logout } from "../utils/auth";

// ...cart icon removed from navbar (floating flag used globally)

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  // Cart is now exposed via a floating flag component; navbar no longer controls it

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const showCartButton = false;

  return (
    <>
      <nav className="w-full bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-pink-600">
            CakeMarket
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {!isLoggedIn() ? (
              <>
                <Link to="/login" className="text-sm text-neutral-600 hover:text-pink-600">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-neutral-700">
                  Hi, <b>{user?.name}</b>
                </span>

                {/* Cart moved to floating flag — no navbar cart button */}

                {user?.role === "baker" && (
                  <button
                    type="button"
                    onClick={() => navigate("/baker/dashboard")}
                    className="h-9 px-3 flex items-center justify-center rounded-lg border hover:bg-neutral-50 text-sm"
                    title="Baker Dashboard"
                  >
                    Dashboard
                  </button>
                )}

                {user?.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="h-9 px-3 rounded-lg border hover:bg-neutral-50 text-sm"
                  >
                    Admin
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="text-sm bg-neutral-100 px-4 py-2 rounded-lg hover:bg-neutral-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

    </>
  );
}
