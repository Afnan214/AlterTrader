// components/PostForm.jsx
import { useState } from "react";

export default function PostForm({ closeModal }) {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ content, image });
        setContent("");
        setImage(null);
        closeModal();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
                className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm text-gray-600"
            />
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Post
            </button>
        </form>
    );
}
