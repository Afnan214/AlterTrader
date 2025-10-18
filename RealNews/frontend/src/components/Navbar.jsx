import { useState } from "react";
import PostModal from "./PostModal";
// import { setMessage } from "../App.jsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick1 = () => {
    fetch("/news.json") // path relative to public/
      .then((response) => response.json())
      .then((data) => {
        // Set the variable to the text from the JSON
        setMessage(data.news1);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  };

  return (
    <nav className="flex items-center flex flex-row justify-between p-4 bg-white shadow">
      <h1 className="text-4xl font-bold text-gray-800">Real News</h1>
      <div className="w-[50%] items-center flex justify-between">
        <button
          onClick={handleClick1}
          className="px-10 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Page 1
        </button>
        <button className="px-10 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Page 2
        </button>
        <button className="px-10 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Page 3
        </button>
        <button className="px-10 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Page 4
        </button>

        <button
          onClick={() => setIsOpen(true)}
          className="px-10 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Post
        </button>
      </div>
      <PostModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </nav>
  );
}
