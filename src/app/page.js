"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Edit2, Trash2, Calendar, FileText, CheckCircle, RotateCcw } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/posts");
      setPosts(response.data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const initFetch = async () => {
      try {
        const response = await api.get("/posts");
        if (!mounted) return;
        setPosts(response.data.data);
        setError("");
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || err.message || "Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initFetch();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await api.delete(`/posts/${id}`);
        setPosts((prev) => prev.filter((post) => post._id !== id));
      } catch (err) {
        alert("Failed to delete post.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <RotateCcw className="animate-spin text-indigo-600 h-8 w-8" />
        <p className="text-zinc-500 font-medium">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">
          <RotateCcw className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold">Error loading content</h3>
        <p className="text-zinc-500 max-w-sm">{error}</p>
        <button 
          onClick={fetchPosts}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Content Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your articles and publications</p>
        </div>
        <Link 
          href="/posts/create"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          Create Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">No posts yet</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
            Get started by creating your first piece of content. It only takes a minute.
          </p>
          <Link 
            href="/posts/create"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm"
          >
            <Plus size={18} />
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div 
              key={post._id} 
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                {post.featuredImage ? (
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                    <FileText size={48} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-sm backdrop-blur-md ${
                    post.status === 'published' 
                      ? 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200'
                      : 'bg-amber-100/90 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200'
                  }`}>
                    {post.status === 'published' ? <CheckCircle size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    {post.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span>•</span>
                  <span>{post.author || "Admin"}</span>
                </div>
                
                <h3 className="line-clamp-2 text-lg font-bold leading-tight mb-2 text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h3>
                
                {post.excerpt && (
                  <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/posts/edit/${post._id}`}
                      className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(post._id, post.title)}
                      className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <Link 
                    href={`/posts/edit/${post._id}`}
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
