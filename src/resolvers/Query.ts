import { Post, PrismaPromise } from '.prisma/client';
import { Context } from '../index';

const Query = {
    posts: (parent: any, args: any, { prisma }: Context) => {
        return prisma.post.findMany({
            orderBy: [{ createdAt: 'desc' }]
        });
    }
};

export { Query };
