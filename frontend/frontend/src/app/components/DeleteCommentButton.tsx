"use client";

export function DeleteCommentButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("Failed to delete comment");
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
