import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import express, { json } from "express";
import http from "http";
import { firebaseDataSource } from "./datasources/firebaseDataSource";

const PORT = process.env.PORT || 4000;

export interface Context {
  loaders: {
    blocksLoader: ReturnType<typeof firebaseDataSource>;
  };
}

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  type ExtendedProps {
    description: String
  }

  # This "Event" type defines the queryable fields for every event in our data source.
  type Event {
    id: ID!
    title: String
    description: String
    start: String
    end: String
    allDay: Boolean
    backgroundColor: String
    extendedProps: ExtendedProps
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "events" query returns an array of zero or more Events (defined above).
  type Query {
    events: [Event]
  }
`;

const events = [
  {
    title: "The Awakening",
    description: "Kate Chopin",
    start: "2025-03-16T00:00:00.000Z",
    end: "2025-03-16T00:00:00.000Z",
    allDay: true,
    backgroundColor: "#000000",
    extendedProps: {
      description: "Kate Chopin",
    },
  },
  {
    title: "City of Glass",
    description: "Paul Auster",
    start: "2025-03-16T00:00:00.000Z",
    end: "2025-03-16T00:00:00.000Z",
    allDay: true,
    backgroundColor: "#000000",
    extendedProps: {
      description: "Paul Auster",
    },
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    events: () => events,
  },
};

// Apollo Server Setup:
// 1. creates an Express app
// 2. installs your ApolloServer instance as middleware
// 3. prepares your app to handle incoming requests
const app = express();
const httpServer = http.createServer(app);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault(),
  ],
});

app.use(json());

(async () => {
  await server.start();
  app.use(
    expressMiddleware(server, {
      context: async (): Promise<Context> => ({
        loaders: {
          blocksLoader: firebaseDataSource(),
        },
      }),
    })
  );
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
})();
