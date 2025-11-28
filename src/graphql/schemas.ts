import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    _id: ID!
    name: String
    email: String!
  }

  type Post {
    _id: ID!
    titulo: String
    contenido: String
    autor: String
    date: String
  }

  type Query {
    posts: [Post]!
    myPosts: [Post]
    postById(id: ID!): Post
    me: User
  }

  type Mutation {
    addPost(titulo: String!, contenido: String!, date: String!): Post!
    register(email: String!, name: String!, password: String!): String!
    login(email: String!, password: String!): String!
  }
`;