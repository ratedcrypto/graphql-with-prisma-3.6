import { gql } from 'apollo-server';

const typeDefs = gql`
    type Query {
        me: User
        profile(userId: ID!): Profile
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
        posts: [Post!]!
    }

    type Profile {
        id: ID!
        bio: String!
        createdAt: String!
        updatedAt: String!
        isMyProfile: Boolean!
        user: User!
    }

    type Mutation {
        postCreate(post: PostInput!): PostPayload!
        postUpdate(id: ID!, post: PostInput!): PostPayload!
        postDelete(id: ID!): PostPayload!
        postPublish(id: ID!): PostPayload!
        postUnpublish(id: ID!): PostPayload!

        signup(
            credentials: CredentialsInput!
            name: String!
            bio: String!
        ): AuthPayload!
        signin(credentials: CredentialsInput!): AuthPayload!
    }

    input CredentialsInput {
        email: String!
        password: String!
    }

    input PostInput {
        title: String
        content: String
    }

    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }

    type AuthPayload {
        userErrors: [UserError!]!
        token: String
    }

    type UserError {
        message: String!
    }
`;

export { typeDefs as default };
