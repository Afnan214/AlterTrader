// components/PostCard.jsx
export default function PostCard({ post }) {
    return (
        <div className=" shadow rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-gray-800">User123</h3>
            <p className="text-gray-700">{post.content}</p>
            {post.image && (
                <img
                    src={URL.createObjectURL(post.image)}
                    alt="Post"
                    className="rounded-lg max-h-60 object-cover w-full"
                />
            )}
        </div>
    );
}
