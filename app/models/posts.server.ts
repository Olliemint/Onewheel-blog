import type { Post } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
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

export async function updatePost(
  slug: string,
  post: Pick<Post, "slug" | "title" | "markdown">,
) {
  return prisma.post.update({ data: post, where: { slug } });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}