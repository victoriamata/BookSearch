import { Schema, type Document } from 'mongoose';

//  Define the structure for the BookDocument interface
export interface BookDocument extends Document {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

// Create a schema for books, designed to be embedded in other schemas like User
const bookSchema = new Schema<BookDocument>({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

export default bookSchema;
