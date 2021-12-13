import { ApolloServer } from 'apollo-server';
import { Prisma, PrismaClient } from '@prisma/client';
import typeDefs from './schema';
import { Query, Mutation, Post } from './resolvers';

const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >;
}

const server = new ApolloServer({
    typeDefs,
    resolvers: { Query, Mutation, Post },
    context: {
        prisma
    }
});

server.listen().then(({ url }) => {
    console.log(`Server is running at ${url}`);
});
