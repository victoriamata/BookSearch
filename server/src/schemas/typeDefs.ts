import gql from 'graphql-tag';

const typeDefs = gql`
  # Book type defines the structure of a book
  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  # User type defines the structure of a user with saved books
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  # Input for adding or updating a book
  input BookInput {
    authors: [String]
    bookId: String!
    title: String!
    description: String!
    image: String
    link: String
  }

  # Auth type returns a token and user information upon successful authentication
  type Auth {
    token: ID!
    user: User
  }

  # Input for creating a new user
  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  # Query to fetch the current logged-in user's data
  type Query {
    me: User
  }

  # Mutation to add a new user, login, save a book, or remove a book
  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

export default typeDefs;
