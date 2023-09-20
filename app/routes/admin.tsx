import { LoaderFunction, json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { getPosts } from '~/models/posts.server';
import { requireAdminUser } from '~/session.server';

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};


export const loader: LoaderFunction = async ({request}) => {
   await requireAdminUser(request);
  const posts = await getPosts();
    return json<LoaderData>( {posts} );
};

export default function AdminRoute() {
    const {posts} = useLoaderData() as LoaderData;
  return (
    <div className='w-full max-w-7xl mx-auto py-20'>
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        Blog Admin
      </h5>
      <div className="mt-8 grid grid-cols-4 gap-6">
        <div className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link prefetch='intent' to={post.slug}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
