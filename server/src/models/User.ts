import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';
import bookSchema from './Book.js';
import type { BookDocument } from './Book.js';

// Define the UserDocument interface to enforce structure on the user model
export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}

// Create a schema for the user
const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true, //Unique username
    },
    email: {
      type: String,
      required: true,
      unique: true, // Unique email
      match: [/.+@.+\..+/, 'Must use a valid email address'], // Validates email format
    },
    password: {
      type: String,
      required: true, // Password is mandatory for every user
    },
    savedBooks: [bookSchema], // Associates the saved books with the user based on bookSchema
  },
  {
    toJSON: {
      virtuals: true, // Enables virtual fields to be included in JSON responses
    },
  }
);

// Automatically hashes the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10; 
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Adds a method to validate the entered password against the hashed password in the database
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Adds a virtual property `bookCount` to calculate the total saved books dynamically
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

// Creates the User model using the defined schema
const User = model<UserDocument>('User', userSchema);

export default User;
