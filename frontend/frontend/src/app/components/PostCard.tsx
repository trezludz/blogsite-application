import Link from "next/link";

interface Post {
  id: number;
  title: string;
  author: string;
  views: number;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="p-4 border rounded-lg shadow hover:bg-gray-50 transition">
      <Link href={`/blog/${post.id}`}>
        <h2 className="text-xl font-semibold cursor-pointer">{post.title}</h2>
      </Link>
      <p className="text-gray-600">by {post.author}</p>
      <p className="text-gray-600">Views: {post.views}</p>
    </div>
  );
}
