"use client";

import { useQuery } from "@tanstack/react-query";
import { postsQueryOptions } from "@/features/home/src/queries/posts";

export function PostsList() {
  const { data, isLoading, isError } = useQuery(postsQueryOptions);

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading posts...</p>;
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Unable to load posts.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((post) => (
        <li
          key={post.id}
          className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {post.title}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {post.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
