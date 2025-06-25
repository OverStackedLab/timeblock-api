import { Context } from "../index";

export const resolvers = {
  Query: {
    getBlocks: async (_: any, args: { userId: string }, context: Context) => {
      return context.loaders.blocksLoader.load(args.userId);
    },
  },
};
