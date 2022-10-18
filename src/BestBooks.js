import React from "react";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import BookFormModal from "./BookFormModal";
import BookUpdateFormModal from "./BookUpdateFormModal";

class BestBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      showAddModal: false,
      showUpdateModal: false,
      book: [],
    };
  }

  // Make the post request to the server
  handleBooksCreate = async (booksInfo) => {
    // postBook
    console.log("booksInfo is:", booksInfo);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER}/books`,
        booksInfo
      );
      // Don't forget .data!
      const createdBooks = res.data;
      // update state and render the createdBOok
      this.setState({
        books: [...this.state.books, createdBooks],
      });
    } catch (error) {
      console.log("we have an error: ", error.response);
    }
  };

  getBooks = async () => {
    try {
      // make a call to my server/cats to get cats
      let bookData = await axios.get(`${process.env.REACT_APP_SERVER}/books`);
      // catData.data
      this.setState({
        books: bookData.data,
      });
    } catch (error) {
      console.log("we have an error: ", error.response);
    }
  };

  toggleAddModal = () => {
    this.setState({
      showAddModal: !this.state.showAddModal,
    });
  };

  toggleUpdateModal = (book) => {
    this.setState({
      currentBook: book,
      showUpdateModal: !this.state.showUpdateModal,
    });
  };

  deleteBook = async (id) => {
    try {
      let deleteConfirmation = window.confirm(
        `Are You Sure You want to Delete this?`
      );
      if (deleteConfirmation) {
        const response = await axios.delete(
          `${process.env.REACT_APP_SERVER}/books/${id}`
        );
        console.log("The response.status is:", response.status);
        // filter it out from state
        const filteredBooks = this.state.books.filter((book) => {
          return book._id !== id;
        });
        this.setState({
          books: filteredBooks,
        });
      }
    } catch (error) {
      console.log("we have an error: ", error.response);
    }
  };

  // updating books method beginning!!!!

  updateBook = async (updatedBook) => {
    try {
      // make url using the `_id` property of the `updatedBook` argument
      // console.log(updatedBook);
      let url = `${process.env.REACT_APP_SERVER}/books/${updatedBook}`;

      // get the updatedBook from the database
      let updatedBookFromDB = await axios.put(url, updatedBook);

      // update state, so that it can rerender with updated books info

      let updatedBookArray = this.state.books.map((existingBook) => {
        // if the `._id` matches the book we want to update:
        // replace that element with the updatedBookFromDB book object

        return existingBook._id === this.currentBook._id
          ? updatedBookFromDB.data
          : existingBook;
      });

      this.setState({
        books: updatedBookArray,
        showUpdateModal: false,
      });
    } catch (e) {
      console.log("Problem updating book...: ", e.message);
    }
  };
  componentDidMount() {
    this.getBooks();
  }

  render() {
    return (
      <>
        <h2>My Essential Lifelong Learning &amp; Formation Shelf</h2>
        <BookFormModal
          handleBooksCreate={this.handleBooksCreate}
          showModal={this.state.showAddModal}
          hideModal={this.toggleAddModal}
          handleUpdate={this.handleUpdate}
        />
        <BookUpdateFormModal
          show={this.state.showUpdateModal}
          onHide={this.toggleUpdateModal}
          updateBook={this.updateBook}
          currentBook={this.currentBook}
        />
        {this.state.books.length ? (
          <Container>
            <Carousel className="h-50 rounded-bottom mb-5 bg-dark rounded">
              {this.state.books.map((book, index) => {
                return (
                  <Carousel.Item key={index}>
                    <>
                      <div className="pb-5 mb-5">
                        <img
                          className="d-block w-50 mx-auto"
                          src="https://www.nirah.com/images/item-placeholder.svg?id=498f4e96baf0bbbc9351"
                          alt={book.title}
                        />
                      </div>
                    </>
                    <Carousel.Caption
                      id="carouselText"
                      className="bg-dark mx-auto bg-opacity-75 rounded-bottom"
                    >
                      <>
                        <div>
                          <h3>{book.title}</h3>
                          <p>{book.description}</p>
                          <p>{book.status}</p>
                        </div>
                        <button
                          onClick={() => {this.deleteBook(book._id)}
                          }>
                          Delete this Entry?
                        </button>
                        <button
                          onClick={() => this.toggleUpdateModal(book)}
                        >
                          Update Book
                        </button>
                      </>
                    </Carousel.Caption>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </Container>
        ) : (
          <p>Book collection is empty.</p>
        )
        }
        <button className="" onClick={this.toggleAddModal}>
          Add book
        </button>
      </>
    );
  }
}

export default BestBooks;
