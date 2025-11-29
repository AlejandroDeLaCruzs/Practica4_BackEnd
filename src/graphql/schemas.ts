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

  type DeleteResponse {
  acknowledged: Boolean!
  deletedCount: Int!
  }

  type Query {
    posts: [Post]!
    myPosts: [Post]
    postById(id: ID!): Post
    me: User
  }


  type Mutation {
    addPost(titulo: String!, contenido: String!, date: String!): Post!
    deletePost(id: ID!): DeleteResponse
    register(email: String!, name: String!, password: String!): String!
    modifyPost(id: ID!, titulo: String, contenido: String, date: String): Post
    login(email: String!, password: String!): String!
  }
`;