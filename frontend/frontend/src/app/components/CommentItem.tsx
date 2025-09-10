"use client";

import { useState, useEffect } from "react";
import { DeleteCommentButton } from "./DeleteCommentButton";
import API from "../lib/api";

export function CommentItem({ comment }: { comment: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [currentUser, setCurrentUser] = useState<string | null>(null);



  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setCurrentUser(storedUser);
  }, []);

  const handleUpdate = async () => {
    if (!content.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      await API.updateComment(comment.id, { content: content.trim() });
      setIsEditing(false);
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to update comment:", err);
      alert(`Failed to update comment: ${err.message || "Unknown error"}`);
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

      <p className="text-xs text-gray-400">
        {new Date(comment.created_at).toLocaleString()}
      </p>
      {currentUser === comment.author && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <DeleteCommentButton id={comment.id} />
        </div>
      )}
    </div>
  );
}
