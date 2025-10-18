// App.jsx
import { useState } from "react";
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState(
    "No posts yet. Get one or create one above!"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-2xl mx-auto mt-6 space-y-4 px-4">
        {posts.length > 0 ? (
          posts.map((post, i) => <PostCard key={i} post={post} />)
        ) : (
          <p className="text-center text-gray-500 mt-8">
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
