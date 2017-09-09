import Tweet from '../../models/Tweet';
import { requireAuth } from '../../services/auth';

export default {
  getTweet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);

      return Tweet.findById(_id);
    } catch (error) {
      throw error;
    }
  },
  // sort by create time
  getTweets: async (_, args, { user }) => {
    try {
      await requireAuth(user);

      return Tweet.find({}).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },
  getUserTweets: async (_, args, { user }) => {
    try {
      await requireAuth(user);

      return Tweet.find({ user: user._id }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  },
  createTweet: async (_, args, { user }) => {
    try {
      await requireAuth(user);

      return Tweet.create({ ...args, user: user._id });
    } catch (error) {
      throw error;
    }
  },
  // by default findByIdAndUpdate returns the old object! new: true and we get the new one...
  updateTweet: async (_, { _id, ...rest }, { user }) => {
    try {
      await requireAuth(user);

      // make sure only the author of the tweet can update it
      const tweet =  await Tweet.findOne({ _id, user: user._id });

      if(!tweet) {
        throw new Error("Not found!");
      }

      Object.entries(rest).forEach(([key, value]) => {
        tweet[key] = value;
      });

      return tweet.save();
    } catch (error) {
      throw error;
    }
  },
  // we want to make this an async method because we want to return a message
  deleteTweet: async (_, { _id }, { user }) => {
    try {
      await requireAuth(user);

      // make sure only the author of the tweet can delete it
      const tweet =  await Tweet.findOne({ _id, user: user._id });

      if(!tweet) {
        throw new Error("Not found!");
      }

      await tweet.remove();

      return {
        message: 'Delete successfull',
      };
    } catch (error) {
      throw error;
    }
  },
};
