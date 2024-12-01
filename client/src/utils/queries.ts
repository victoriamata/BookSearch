// Import the `gql` from Apollo
import { gql } from "@apollo/client";

// GraphQL query to fetch the logged-in user's data
// Returns the user's ID, email, password, username, and a list of saved books
// Each saved book includes its authors, book ID, description, image, link, and title
export const getMe = gql`
  query me {
    me {
      _id
      email
      password
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
