import { Context } from '..';

interface CanUserMutatePostArgs {
    userId: number;
    postId: number;
    prisma: Context['prisma'];
}

export const canUserMutatePost = async ({
    userId,
    postId,
    prisma
}: CanUserMutatePostArgs) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
        return {
            userErrors: [
                {
                    message: 'User not found'
                }
            ],
            post: null
        };
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });

    if (post?.authorId !== user.id) {
        return {
            userErrors: [
                {
                    message: 'Unauthorized'
                }
            ],
            post: null
        };
    }
};
