import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPosts } from "~/models/posts.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};
export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json<LoaderData>({ posts });
};

export default function PostRoute() {
  const {posts} = useLoaderData<LoaderData>();
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-0 ">
      <h1 className="py-4">Posts</h1>
      <Link
        to="/admin"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-4"
      >
        Go to Admin
        <svg
          className="w-3.5 h-3.5 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </Link>
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
