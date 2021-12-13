import { Post, Prisma } from '.prisma/client';
import { Context } from '../index';

interface PostArgs {
    post: {
        title?: string;
        content?: string;
    };
}

interface PostPayloadType {
    userErrors: {
        message: string;
    }[];
    post: Post | Prisma.Prisma__PostClient<Post> | null;
}

const Mutation = {
    postCreate: async (
        parent: any,
        { post: { title, content } }: PostArgs,
        { prisma }: Context
    ): Promise<PostPayloadType> => {
        if (!title || !content) {
            return {
                userErrors: [
                    {
                        message: 'Post title or content not provided!'
                    }
                ],
                post: null
            };
        }

        return {
            userErrors: [],
            post: await prisma.post.create({
                data: {
                    title,
                    content,
                    author: {
                        connect: {
                            id: 1
                        }
                    }
                }
            })
        };
    },
    postUpdate: async (
        parent: any,
        {
            id,
            post: { title, content }
        }: { id: string; post: PostArgs['post'] },
        { prisma }: Context
    ): Promise<PostPayloadType> => {
        if (!title && !content) {
            return {
                userErrors: [
                    {
                        message: 'Post title or content not provided!'
                    }
                ],
                post: null
            };
        }

        const exists = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!exists) {
            return {
                userErrors: [
                    {
                        message: 'Post not found!'
                    }
                ],
                post: null
            };
        }
        let payloadToUpdate = {
            title,
            content
        };
        if (!title) delete payloadToUpdate.title;
        if (!content) delete payloadToUpdate.content;

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(id)
                },
                data: {
                    ...payloadToUpdate
                }
            })
        };
    },
    postDelete: async (
        parent: any,
        { id }: { id: string },
        { prisma }: Context
    ): Promise<PostPayloadType> => {
        const exists = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!exists) {
            return {
                userErrors: [
                    {
                        message: 'Post not found!'
                    }
                ],
                post: null
            };
        }

        return {
            userErrors: [],
            post: prisma.post.delete({
                where: {
                    id: Number(id)
                }
            })
        };
    }
};

export { Mutation };
