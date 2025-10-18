import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // ✅ make sure this path is correct
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Listen for Firebase login/logout changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Left section: brand + links */}
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-semibold tracking-tight">Alert Trader</h1>

        <div className="hidden sm:flex space-x-6 text-sm">
          <Link
            to="/dashboard"
            className="hover:text-indigo-400 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Right section: profile dropdown */}
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="flex items-center space-x-2 rounded-full bg-gray-800 px-3 py-2 text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <span>{user ? user.email.split("@")[0] : "Profile"}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </MenuButton>
        </div>

        <MenuItems className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="py-1">
            {!user ? (
              <>
                <MenuItem>

                  <Link
                    to="/signup"
                    className={`block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100`}
                  >
                    Signup
                  </Link>

                </MenuItem>
                <MenuItem>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                  >
                    Login
                  </Link>
                </MenuItem>
              </>
            ) : (
              <MenuItem>
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700
                  data-[focus]:bg-gray-100`}
                >
                  Logout
                </button>
              </MenuItem>
            )}
          </div>
        </MenuItems>
      </Menu>
    </nav>
  );
}
