import { queryOptions } from "@tanstack/react-query";

type Post = {
  id: number;
  title: string;
  body: string;
};

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

export const postsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: fetchPosts,
});
