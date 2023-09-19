import { prisma } from "~/db.server";
export const getPosts = async () => {
    return prisma.post.findMany({
        select: {
            slug: true,
            title: true,
        }
    });
}

export const getPost = async (slug: string) => {
    return prisma.post.findUnique({
        where: {
            slug: slug
        }
    });
 }