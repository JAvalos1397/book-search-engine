const { Book, User } = require("../models")
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
  Query: {

    //get a user by username
    me: async (parent, args, context) => {

      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id
        })
          .select('-__v -password')
          .populate('books')

        return userData;
      }
      throw new AuthenticationError('Not logged in')
    },

  },
  Mutation: {
    addUser: async (parent, args) => {
      console.log('inside the addUser')
      const user = await User.create(args);

      if (!user) {
        throw new AuthenticationError('Something went wrong')
      }
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookInfo }, context) => {
      console.log("in the saved books")
      console.log(bookInfo)
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookInfo } },
          { new: true, runValidators: true }
        );
        console.log(updatedUser)
        return updatedUser
      }
      throw new AuthenticationError('Must be logged in')
    },

    removeBook: async (parent, { bookId }, context) => {
      if(context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: bookId } },
          { new: true, runValidators: true }
        );
        return updatedUser
      }
      throw new AuthenticationError('Must be logged in')
    }
  }
}

module.exports = resolvers;
