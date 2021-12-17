import { Post, PrismaPromise } from '.prisma/client';
import { Context } from '../index';

const Query = {
    me: (parent: any, args: any, { prisma, userInfo }: Context) => {
        if (!userInfo) return null;

        return prisma.user.findUnique({
            where: {
                id: userInfo.userId
            }
        });
    },
    profile: async (
        parent: any,
        { userId }: { userId: string },
        { prisma, userInfo }: Context
    ) => {
        const isMyProfile = Number(userId) === userInfo?.userId;

        const profile = await prisma.profile.findUnique({
            where: {
                userId: Number(userId)
            }
        });

        if (!profile) return null;

        return {
            ...profile,
            isMyProfile
        };
    },
    posts: (parent: any, args: any, { prisma }: Context) => {
        return prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: [{ createdAt: 'desc' }]
        });
    }
};

export { Query };
