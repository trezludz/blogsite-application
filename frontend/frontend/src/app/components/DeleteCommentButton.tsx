"use client";

import API from "../lib/api";

export function DeleteCommentButton({ id }: { id: number }) {
const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this comment?")) return;

  try {
    await API.deleteComment(id);
    window.location.reload();
  } catch (err: any) {
    alert(`Failed to delete comment: ${err.message}`);
  }
};

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
