import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
            {/* Left section: brand + links */}
            <div className="flex items-center space-x-8">
                <h1 className="text-xl font-semibold tracking-tight">AlterTrader</h1>

                <div className="hidden sm:flex space-x-6 text-sm">
                    <Link to='/dashboard'>
                        <button className="hover:text-indigo-400 transition">
                            Dashboard
                        </button >
                    </Link>
                </div>
            </div>

            {/* Right section: profile menu */}
            <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="flex items-center space-x-2 rounded-full bg-gray-800 px-3 py-2 text-sm font-medium hover:bg-gray-700 focus:outline-none">
                    <span>Profile</span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </MenuButton>

                <MenuItems
                    anchor="bottom end"
                    className="mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                    <div className="py-1">
                        <MenuItem>
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                            >
                                Login / Signup
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                            >
                                Logout
                            </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        </nav>
    );
}
