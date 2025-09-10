"use client";

import { notFound, useRouter } from "next/navigation";
import { CommentItem } from "../../components/CommentItem";
import { CommentForm } from "../../components/CommentForm";
import { BlogActions } from "../../components/BlogActions";
import Link from "next/link";
import { useEffect, useState } from "react";
import API from "../../lib/api";

async function getBlog(id: string) {
  const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default function BlogDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token || !username) {
      router.push("/login");
      return;
    }

    setCurrentUser(username);

    async function fetchBlog() {
      const data = await getBlog(params.id);
      if (!data) return notFound();
      setBlog(data);
      setTitle(data.title);
      setContent(data.content);
      setLoading(false);
    }
    fetchBlog();
  }, [params.id, router]);

  if (loading) return <p className="text-center">Checking authentication...</p>;
  if (!blog) return notFound();


const handleSave = async () => {
  if (!title.trim() || !content.trim()) {
    alert("Title and content cannot be empty.");
    return;
  }

  try {
    const updated = await API.updatePost(params.id, { title, content });
    setBlog(updated);
    setIsEditing(false);
  } catch (err: any) {
    console.error("Failed to update post:", err);
    alert(`Failed to update post: ${err.message || "Unknown error"}`);
  }
};

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back to Home */}
      <Link
        href="/"
        className="inline-block mb-4 px-2 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Home
      </Link>

      {/* Post Header */}
      {isEditing ? (
        <>
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
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setTitle(blog.title);
              setContent(blog.content);
            }}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
          <p className="text-gray-500 mb-4">By {blog.author}</p>

          {/*Only show BlogActions if current user is the author */}
          {currentUser === blog.author && (
            <BlogActions
              postId={blog.id}
              author={blog.author}
              onEdit={() => setIsEditing(true)}
            />
          )}

          <div className="prose mb-6">{blog.content}</div>
        </>
      )}

      {/* Comments */}
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
    <div className="space-y-4">
      {blog.comments && blog.comments.length > 0 ? (
        blog.comments.map((c: any) => <CommentItem key={c.id} comment={c} />)
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
      <CommentForm postId={blog.id} />
    </div>

    </div>
  );
}
