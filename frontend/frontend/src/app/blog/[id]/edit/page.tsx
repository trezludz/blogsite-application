// app/blog/[id]/edit/page.tsx
"use client"; // ✅ allows useRouter and hooks

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditBlog({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(`http://localhost:5000/api/posts/${params.id}`);
      if (res.ok) {
        const blog = await res.json();
        setTitle(blog.title);
        setContent(blog.content);
      }
    }
    fetchBlog();
  }, [params.id]);

  const handleSave = async () => {
    const res = await fetch(`http://localhost:5000/api/posts/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      router.push(`/blog/${params.id}`);
    } else {
      alert("Failed to update post");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <input
        className="w-full p-2 border rounded mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 border rounded mb-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </div>
  );
}
