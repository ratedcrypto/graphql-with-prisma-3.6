import { Post, Prisma } from '.prisma/client';
import { Context } from '../../index';
import { canUserMutatePost } from '../../utils/canUserMutatePost';

interface PostArgs {
    post: {
        title?: string;
        content?: string;
    };
}

interface PostPayload {
    userErrors: {
        message: string;
    }[];
    post: Post | Prisma.Prisma__PostClient<Post> | null;
}

const postResolvers = {
    postCreate: async (
        parent: any,
        { post: { title, content } }: PostArgs,
        { prisma, userInfo }: Context
    ): Promise<PostPayload> => {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'User is not authenticated'
                    }
                ],
                post: null
            };
        }

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
                            id: userInfo.userId
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
        { prisma, userInfo }: Context
    ): Promise<PostPayload> => {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'User is not authenticated'
                    }
                ],
                post: null
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(id),
            prisma
        });

        if (error) {
            return error;
        }

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
        { prisma, userInfo }: Context
    ): Promise<PostPayload> => {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'User is not authenticated'
                    }
                ],
                post: null
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(id),
            prisma
        });

        if (error) {
            return error;
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

        return {
            userErrors: [],
            post: await prisma.post.delete({
                where: {
                    id: Number(id)
                }
            })
        };
    },
    postPublish: async (
        _: any,
        { postId }: { postId: string },
        { prisma, userInfo }: Context
    ): Promise<PostPayload> => {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'Forbidden access (unauthenticated)'
                    }
                ],
                post: null
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });

        if (error) return error;

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    published: true
                }
            })
        };
    },
    postUnpublish: async (
        _: any,
        { postId }: { postId: string },
        { prisma, userInfo }: Context
    ): Promise<PostPayload> => {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'Forbidden access (unauthenticated)'
                    }
                ],
                post: null
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });

        if (error) return error;

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    published: false
                }
            })
        };
    }
};

export { postResolvers };
