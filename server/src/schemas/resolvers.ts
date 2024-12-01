import { User } from '../models/index.js';
import { signToken } from '../utils/auth.js';
import { AuthenticationError } from '../utils/auth.js';

// Define types for the mutation and query arguments
interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface SaveBookArgs {
    input: {
        authors: [string];
        bookId: string;
        title: string;
        description: string;
        image: string;
        link: string;
    }
}

interface RemoveBookArgs {
    bookId: string;
}

const resolvers = {
    Query: {
        // Resolver to fetch authenticated user data
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        // Resolver to create a new user and return a token
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },

        // Resolver to log in a user and return a token
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },

        // Resolver to save a book to the user's savedBooks list
        saveBook: async (_parent: any, { input }: SaveBookArgs, context: any) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        // Resolver to remove a book from the user's savedBooks list
        removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: any) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true, runValidators: true }
                );
                if (!updatedUser) {
                    return "Couldn't find user with this id!";
                }
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

export default resolvers;
