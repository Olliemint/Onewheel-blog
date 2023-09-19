import type { Post } from "@prisma/client";
import { prisma } from "~/db.server";
export const getPosts = async () => {
  return prisma.post.findMany({
    select: {
      slug: true,
      title: true,
    },
  });
};

export const getPost = async (slug: string) => {
  return prisma.post.findUnique({
    where: {
      slug: slug,
    },
  });
};

export async function createPost(
  post: Pick<Post, "title" | "slug" | "markdown">,
) {
  return prisma.post.create({ data: post });
}
