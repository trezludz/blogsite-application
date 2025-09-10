"use client";
import { useState } from "react";
import API from "../lib/api";

export function CommentForm({ postId }: { postId: number }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      await API.createComment(postId, { content: content.trim() });
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to add comment:", err);
      alert(`Failed to add comment: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Comment
      </button>
    </form>
  );
}
