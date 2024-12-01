import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import type { User } from "../models/User";
// GraphQL query to fetch user data
import { getMe } from "../utils/queries";
// GraphQL mutation to delete a saved book
import { deleteBook } from "../utils/mutations";
// Apollo hooks for GraphQL queries and mutations
import { useQuery, useMutation } from "@apollo/client";

const SavedBooks = () => {
  // Fetch user data using the `getMe` query and assign it to `userData`
  const { data } = useQuery(getMe);
  const userData: User = data?.me || {
    username: "",
    email: "",
    password: "",
    savedBooks: [],
  };
  // Prepare the `deleteBook` mutation to remove a book by its ID
  const [removeBook, { error }] = useMutation(deleteBook);

  // Function to handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: {
          bookId: bookId,
        },
      });

      // Remove the book ID from local storage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Display a loading message if the mutation is not ready
  if (!removeBook) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks?.length} saved ${
                userData.savedBooks?.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                      {error && <div>Something went wrong...</div>}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
