import { LoaderFunction, json } from '@remix-run/node';
import { Link } from '@remix-run/react';
import React from 'react'
import { requireAdminUser } from '~/session.server';
export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json({});
};
export default function AdminRouteIndex() {
    return <Link to="new">Create new post</Link>;
}
