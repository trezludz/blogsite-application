import Link from "next/link";

interface Post {
  id: number;
  title: string;
  author: string;
  views: number;
}

export default function PostCard({ post }: { post: Post }) {
  return (
   <div>
    <Link href={`/blog/${post.id}`}>
    <div className="p-2 border rounded-lg shadow hover:bg-gray-500 transition">
      
        <h2 className="text-xl font-semibold cursor-pointer">{post.title}</h2>
      
      <p className="text-gray-600">by {post.author}</p>
      <p className="text-gray-600">Views: {post.views}</p>
    </div>
    </Link>
    </div>
  );
}
