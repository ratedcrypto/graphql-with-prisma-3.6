import { Context } from '../index';

interface ProfileParentType {
    id: number;
}

const Profile = {
    user: (parent: ProfileParentType, args: any, { prisma }: Context) => {
        return prisma.user.findUnique({
            where: {
                id: parent.id
            }
        });
    }
};

export { Profile };
