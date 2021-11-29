const {gql} = require('apollo-server-express');

const typeDefs = gql`

type Books {
    _id: ID
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

type Users{
    username: String!
    email: String!
    password: String!
    savedBooks: [Books] 
}

type Auth {
    token: ID!
    user: User
  }

type Query {
    me: Users
};

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SavedBookInput): User
    removeBook(bookId: String!): User
  }

`

module.exports = typeDefs;