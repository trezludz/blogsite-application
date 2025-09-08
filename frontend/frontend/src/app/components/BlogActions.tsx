"use client";

import { useRouter } from "next/navigation";

export function BlogActions({ postId }: { postId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await fetch(`http://localhost:5000/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) router.push("/");
    else alert("Failed to delete post");
  };

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => router.push(`/blog/${postId}/edit`)}
        className="bg-yellow-500 text-white px-3 py-1 rounded"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
}
