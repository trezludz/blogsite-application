"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "./lib/api";
import PostCard from "./components/PostCard";
import { LogoutButton } from "./components/LogoutButton";


interface BlogPost {
  id: number;
  title: string;
  author: string;
  views: number;
}

interface PopularPost {
  id: number;
  title: string;
  author: string;
  views: number;
}

interface Comment {
  id: number;
  post_id: number;
  author: string;
  content: string;
  post_title: string;
}

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    API.getPosts(page, search).then((res) => {
      setPosts(res.posts);
      setTotalPages(res.pages);
    });
  }, [page, search]);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts/popular")
      .then((res) => res.json())
      .then((data) => setPopularPosts(data))
      .catch(() => setPopularPosts([]));

    fetch("http://localhost:5000/api/comments/recent")
      .then((res) => res.json())
      .then((data: Comment[]) => {
        setRecentComments(data);
      })
      .catch(() => setRecentComments([]));
  }, []);

  return (
    <div className="mx-auto p-6">
       {loading ? (
        <p className="text-center mt-10">Checking authentication...</p>
      ) : (
      <div className="flex md:flex-row flex-col flex-[0_0_30%] gap-6">
        {/* Sidebar */}
        <aside className="w-1/3 space-y-8 ml-8">
          {/* Popular Posts */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Popular Posts</h2>
            {popularPosts.length === 0 ? (
              <p className="text-gray-500">No popular posts yet.</p>
            ) : (
              <ul className="space-y-1">
                {popularPosts.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => router.push(`/blog/${p.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      {p.title}
                    </button>
                    <span className="ml-2 text-gray-500">({p.views} views)</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent Comments */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Recent Comments</h2>
            {recentComments.length === 0 ? (
              <p className="text-gray-500">No recent comments yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentComments.map((c) => (
                  <li key={c.id}>
                    <span className="font-medium">{c.author}</span> on{" "}
                    <button
                      onClick={() => router.push(`/blog/${c.post_id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      {c.post_title}
                    </button>
                    : {c.content}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>

        {/* Main content */}
        <div className="flex-[0_0_50%] space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Blog Posts</h1>
            <button
              onClick={() => router.push("/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              New Post
            </button>
            <LogoutButton />
          </div>

          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full rounded mb-4"
          />

          {/* Blog Posts */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-gray-500">No posts found. Create a new one!</p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center space-x-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <div className="flex-[0_0_20%]"></div>
      </div>
      )};
    </div>
  );
}
