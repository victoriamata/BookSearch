// Import the `gql' from Apollo
import { gql } from "@apollo/client";

// GraphQL mutation for logging in a user
// Takes `email` and `password` as input variables
// Returns a token and the user's ID and username
export const loginUser = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// GraphQL mutation for adding a new user
// Takes `UserInput` as an input variable
// Returns the newly created user's ID, username, and a token
export const addUser = gql`
  mutation AddUser($input: UserInput!) {
    addUser(input: $input) {
      user {
        username
        _id
      }
      token
    }
  }
`;

// GraphQL mutation for saving a book to a user's saved books list
// Takes `BookInput` as an input variable
// Returns the updated user object with their saved books
export const saveBook = gql`
  mutation Mutation($input: BookInput!) {
    saveBook(input: $input) {
      _id
      username
      email
      savedBooks {
        authors
        bookId
        description
        image
        link
        title
      }
    }
  }
`;

// GraphQL mutation for removing a book from a user's saved books list
// Takes the `bookId` of the book to be removed as an input variable
// Returns the updated user object with their remaining saved books
export const deleteBook = gql`
  mutation RemoveBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      email
      savedBooks {
        authors
        bookId
        description
        image
        link
        title
      }
      username
    }
  }
`;
