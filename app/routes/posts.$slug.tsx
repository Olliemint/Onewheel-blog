import { LoaderFunction,json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getPost } from "~/models/posts.server"
import { useParams } from "@remix-run/react"


export const loader: LoaderFunction = async ({ params }) => { 
    const { slug } = params
  const post = await getPost(slug)
  return json({post})
}

export default function PostRoute() {
  const {post} = useLoaderData()
  
 
  return (
    <div className="flex flex-col gap-y-8 justify-center items-center py-20 ">
      <h1 className="text-4xl font-bold">Blog Post Details</h1>

      <div
        className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {post.slug}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {post.title}
        </p>
      </div>
    </div>
  );
}
