"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../lib/api";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔒 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    try {
      const data = await API.createPost({
        title: title.trim(),
        content: content.trim(),
      });

      router.push(`/blog/${data.id}`);
    } catch (err: any) {
      console.error("Failed to create post:", err);
      alert(`Failed to create post: ${err.message || "Unknown error"}`);
    }
  };

  if (loading) return <p className="text-center mt-10">Checking authentication...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded h-40"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
