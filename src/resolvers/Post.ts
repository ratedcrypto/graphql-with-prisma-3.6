import { Context } from '../index';

interface PostParentType {
    authorId: number;
}

const Post = {
    author: (parent: PostParentType, args: any, { prisma }: Context) => {
        console.log(parent);
        return prisma.user.findUnique({
            where: {
                id: parent.authorId
            }
        });
    }
};

export { Post };
