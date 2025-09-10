const API_BASE = "http://localhost:5000/api";

async function request(endpoint: string, options: RequestInit = {}) {
  // Get the latest token at request time
  const token = localStorage.getItem("token");

  // Merge headers with Content-Type and Authorization if token exists
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.ok) {
    return res.status !== 204 ? res.json() : null;
  } else {
    const errText = await res.text();
    throw new Error(errText || "Request failed");
  }
}

const API = {
  // POSTS
  getPosts: (page = 1, search = "") =>
    request(`/posts?page=${page}&search=${encodeURIComponent(search)}`),

  getPost: (id: number | string) => request(`/posts/${id}`),

  createPost: (data: { title: string; content: string }) =>
    request(`/posts`, { method: "POST", body: JSON.stringify(data) }),

  updatePost: (id: number | string, data: any) =>
    request(`/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deletePost: (id: number | string) =>
    request(`/posts/${id}`, { method: "DELETE" }),

  getPopularPosts: (by: "views" | "comments" = "views") =>
    request(`/posts/popular?by=${by}`),

  // COMMENTS
  getComments: (postId: number | string) =>
    request(`/posts/${postId}/comments`),

  createComment: (postId: number | string, data: { content: string }) =>
    request(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateComment: (id: number | string, data: any) =>
    request(`/comments/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteComment: (id: number | string) =>
    request(`/comments/${id}`, { method: "DELETE" }),

  getRecentComments: () => request(`/comments/recent`),
};

export default API;
