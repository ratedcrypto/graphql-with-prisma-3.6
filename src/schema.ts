import { gql } from 'apollo-server';

const typeDefs = gql`
    type Query {
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        published: Boolean!
        createdAt: String!
        updatedAt: String!
        author: User!
    }

    type User {
        id: ID!
        email: String!
        name: String!
        createdAt: String!
        updatedAt: String!
        Profile: Profile!
        posts: [Post!]!
    }

    type Profile {
        id: ID!
        bio: String!
        createdAt: String!
        updatedAt: String!
        User: User!
    }

    type Mutation {
        postCreate(post: PostInput!): PostPayload!
        postUpdate(id: ID!, post: PostInput!): PostPayload!
        postDelete(id: ID!): PostPayload!
    }

    input PostInput {
        title: String
        content: String
    }

    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }

    type UserError {
        message: String!
    }
`;

export { typeDefs as default };
