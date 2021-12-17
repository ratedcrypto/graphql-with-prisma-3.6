import { Context } from '../index';
import { userLoader } from '../loaders/userLoader';

interface PostParentType {
    authorId: number;
}

const Post = {
    author: (parent: PostParentType, args: any, { prisma }: Context) => {
        return userLoader.load(parent.authorId);
    }
};

export { Post };
