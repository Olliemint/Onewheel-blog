import { Form, useActionData, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { redirect, type ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { createPost, deletePost, getPost, updatePost } from "~/models/posts.server";
import invariant from "tiny-invariant";
import { useNavigation } from "@remix-run/react";
import { requireAdminUser } from "~/session.server";

interface Post{
  title: string,
  slug: string,
  markdown: string
}

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;
export const loader:LoaderFunction = async ({request,params}) => {
  await requireAdminUser(request);
  invariant(params.slug, "slug is required");
  if (params.slug === "new") {
console.log(params.slug)
    return json({});
  }
  const post = await getPost(params.slug);
   if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
   }
  return json({post });
}
export const action: ActionFunction = async ({ request, params }) => {
  await requireAdminUser(request);
  invariant(params.slug, "slug is required");
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await deletePost(params.slug);
    return redirect("/admin");
  }

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  if (params.slug === "new") {
    await createPost({ title, slug, markdown });
  } else {
    await updatePost(params.slug, { title, slug, markdown });
  }

  return redirect("/admin");
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function NewPostRoute() {
  const errors = useActionData<ActionData>();
  const navigation = useNavigation();
  
  const {post} = useLoaderData<Post | any>();


  

  const isCreating = Boolean(navigation.state === "submitting");
  const isUpdating = navigation.formData?.get("intent") === "update";
  const isDeleting = navigation.formData?.get("intent") === "delete";
  const isNewPost = !post;

  return (
    <Form method="post" key={post?.slug ?? "new"}>
      <p>
        <label>
          Post Title:
          {errors?.title ? (
            <em className="text-red-600">{errors?.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={post?.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug ? (
            <em className="text-red-600">{errors?.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={post?.slug}
          />
        </label>
      </p>

      <p>
        <label>
          Post Markdown:
          {errors?.markdown ? (
            <em className="text-red-600">{errors?.markdown}</em>
          ) : null}
          <textarea
            rows={10}
            name="markdown"
            className={`${inputClassName} font-mono`}
            defaultValue={post?.markdown}
          />
        </label>
      </p>

      <div className="flex gap-6 justify-end">
        {!isNewPost && (
          <button
            type="submit"
            name="intent"
            value="delete"
            className="mt-5 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <svg
                aria-hidden="true"
                className="w-5 h-5  text-gray-200 animate-spin  fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              "Delete"
            )}
          </button>
        )}
        <button
          type="submit"
          name="intent"
          value={isNewPost ? "create" : "update"}
          className="mt-5 rounded bg-blue-500 px-2 py-2 text-white hover:bg-blue-700"
          disabled={isCreating}
        >
          {isNewPost ? (
            <>
              {isCreating ? (
                <svg
                  aria-hidden="true"
                  className="w-5 h-5  text-gray-200 animate-spin  fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                "Create Post"
              )}
            </>
          ) : (
            <>
              {isUpdating ? (
                <svg
                  aria-hidden="true"
                  className="w-5 h-5  text-gray-200 animate-spin  fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                "Update Post"
              )}
            </>
          )}
        </button>
      </div>
    </Form>
  );
}






  export function CatchBoundary() {
    const caught = useRouteError();
    const params = useParams();
    if (caught?.status === 404) {
      return (
        <div className="text-red-500">
          Uh oh! The post with the slug "{params.slug}" does not exist!
        </div>
      );
    }
    throw new Error(
      `Unsupported thrown response status code: ${caught.status}`,
    );
  }

export function ErrorBoundary({ error }: { error: unknown }) {
    const params = useParams();
    
    if (error instanceof Error) {
      return (
        <div className="text-red-500">
          Oh no, something went wrong!
          <pre>{error.message}</pre>
        </div>
      );
    }
     return (
       <div className="text-red-500">
         Uh oh! The post with the slug "{params.slug}" does not exist!
       </div>
     );
  }
