import { notFound } from "next/navigation";
import { CommentItem } from "../../components/CommentItem";
import { CommentForm } from "../../components/CommentForm";
import { BlogActions } from "../../components/BlogActions";

async function getBlog(id: string) {
  const res = await fetch(`http://localhost:5000/api/posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogDetail({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);
  if (!blog) return notFound();

  const comments = blog.comments || [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-500 mb-4">By {blog.author}</p>

      <BlogActions postId={blog.id} />

      <div className="prose mb-6">{blog.content}</div>

      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c: any) => <CommentItem key={c.id} comment={c} />)
        )}
        <CommentForm postId={blog.id} />
      </div>
    </div>
  );
}
