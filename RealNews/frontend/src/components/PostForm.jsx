// components/PostForm.jsx
import { useState } from "react";

export default function PostForm({ closeModal }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // (Optional) Upload image somewhere if you want Cloud Storage integration.
      // For now, we’ll just store the image name.
      if (image) {
        imageUrl = URL.createObjectURL(image);
      }

      const response = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, imageUrl }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      const newPost = await response.json();
      console.log("✅ Post created:", newPost);

      // Reset form
      setContent("");
      setImage(null);
      closeModal();

      // Optionally trigger UI refresh
      window.dispatchEvent(new Event("postCreated"));
    } catch (error) {
      console.error("❌ Error submitting post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
