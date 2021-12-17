import { authResolvers } from './Auth';
import { postResolvers } from './Post';

const Mutation = {
    ...postResolvers,
    ...authResolvers
};

export { Mutation };
