"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "../lib/api"


export function BlogActions({
  postId,
  author,
  onEdit,
}: {
  postId: number;
  author: string;
  onEdit: () => void;
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Pull username from localStorage (set at login)
    const user = localStorage.getItem("username");
    setCurrentUser(user);
  }, []);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.deletePost(postId);
      router.push("/");
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      alert(`Failed to delete post: ${err.message || "Unknown error"}`);
    }
  };

  // ✅ Don’t render if not the author
  if (!currentUser || currentUser !== author) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={onEdit}
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
