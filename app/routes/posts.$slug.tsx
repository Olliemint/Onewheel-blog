import { LoaderFunction,json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { marked } from "marked"
import { getPost } from "~/models/posts.server"
import { useParams } from "@remix-run/react"
import invariant from "tiny-invariant"
import { as } from "vitest/dist/reporters-cb94c88b"

type LoaderData = {
  title: string
  slug: string
  content: string
}

export const loader: LoaderFunction = async ({ params }) => { 
    const { slug } = params
    invariant(slug,"slug is required")
  const post = await getPost(slug)
  invariant(post,`post not found for  ${slug}`)
  const content = marked(post.markdown)
  return json<LoaderData>({title:post.title,slug:post.slug,content})
}

export default function PostRoute() {
  const { title, slug, content } = useLoaderData() as LoaderData;
  
 
  return (
    <div className="flex flex-col gap-y-8 justify-center items-center py-20 ">
      <h1 className="text-4xl font-bold">Blog Post Details</h1>

      <div
        className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {slug}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {title}
        </p>
        <div className="py-4 text-black dark:text-slate-200" dangerouslySetInnerHTML={{__html:content}} />
      </div>
    </div>
  );
}
