import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPosts } from "~/models/posts.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};
export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json<LoaderData>(posts );
};

export default function PostRoute() {
  const posts  = useLoaderData<LoaderData>();
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-0 ">
      <h1 className="py-4">Posts</h1>
      <div className="w-full flex flex-col gap-y-4 sm:flex-row sm:gap-x-4">
        {posts.map((post) => (
          <Link
            to={post.slug}
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {post.slug}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                {post.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
