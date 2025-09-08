"use client";

import { useState } from "react";
import { DeleteCommentButton } from "./DeleteCommentButton";

export function CommentItem({ comment }: { comment: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:5000/api/comments/${comment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, author: comment.author }),
    });
    if (res.ok) {
      setIsEditing(false);
      window.location.reload();
    } else {
      alert("Failed to update comment");
    }
  };

  return (
    <div className="border p-3 rounded-lg">
      <p className="font-medium">{comment.author}</p>
      {isEditing ? (
        <>
          <textarea
            className="w-full p-2 border rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-2 py-1 rounded mt-2"
          >
            Save
          </button>
        </>
      ) : (
        <p>{comment.content}</p>
      )}
      <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        <DeleteCommentButton id={comment.id} />
      </div>
    </div>
  );
}
