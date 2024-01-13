import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const token = Auth.loggedIn() ? Auth.getToken() : null;
  const [deleteBook] = useMutation(REMOVE_BOOK);
  const { data} = useQuery(GET_ME, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    },
  });

  const userData = data?.me || {};

  console.log(userData);
  if (!userData?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook({
        variables: { bookId: bookId },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
<>
  <Container fluid className="text-light bg-dark p-5">
    <Container>
      <h1>Viewing saved books!</h1>
    </Container>
  </Container>
  <Container>
    <h2 className='pt-5'>
      {userData.savedBooks.length
        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
        : 'You have no saved books!'}
    </h2>
    <Row>
      {userData.savedBooks.map((book) => {
        return (
          <Col md="4" key={book.bookId}>
            <Card border='dark'>
              {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className='small'>Authors: {book.authors}</p>
                <Card.Text>{book.description}</Card.Text>
                <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                  Delete this Book!
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
  
