import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Listen for post creation event
    const refresh = () => fetchPosts();
    window.addEventListener("postCreated", refresh);

    return () => window.removeEventListener("postCreated", refresh);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-2xl mx-auto mt-6 space-y-4 px-4">
        {loading ? (
          <p className="text-center text-gray-500 mt-8">Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post, i) => <PostCard key={i} post={post} />)
        ) : (
          <p className="text-center text-gray-500 mt-8">
            No posts yet. Create one above!
          </p>
        )}
      </main>
    </div>
  );
}
