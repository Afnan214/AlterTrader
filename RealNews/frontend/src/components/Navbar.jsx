import { useState } from "react";
import PostModal from "./PostModal";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow">
            <h1 className="text-xl font-semibold text-gray-800">MediaFeed</h1>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Create Post
            </button>
            <PostModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
        </nav>
    );
}