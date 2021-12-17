import { ApolloServer } from 'apollo-server';
import { Prisma, PrismaClient } from '@prisma/client';
import typeDefs from './schema';
import { Query, Mutation, Post, User, Profile } from './resolvers';
import { getUserFromToken } from './utils/getUserFromToken';

export const prisma = new PrismaClient();

export interface Context {
    userInfo: {
        userId: number;
    } | null;
    prisma: PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >;
}

const server = new ApolloServer({
    typeDefs,
    resolvers: { Query, Mutation, Post, User, Profile },
    context: ({ req }: any): Context => {
        const userInfo = getUserFromToken(req.headers.authorization);
        return {
            userInfo,
            prisma
        };
    }
});

server.listen().then(({ url }) => {
    console.log(`Server is running at ${url}`);
});
