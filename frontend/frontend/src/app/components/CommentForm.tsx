"use client";

import { useState } from "react";

export function CommentForm({ postId }: { postId: number }) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("Failed to add comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        className="w-full border p-2 rounded"
        placeholder="Your name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Comment</button>
    </form>
  );
}
