import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cors from "cors";
import express from "express";
import * as functions from "firebase-functions";
import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import path from "path";
import { ListingAPI } from "./datasources/listing-api";
import { resolvers } from "./resolvers";

const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  })
);

interface ContextValue {
  token: string;
  dataSources: {
    ListingAPI: ListingAPI;
  };
}

const app = express();

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
  // Remove drainHttpServer plugin for Firebase Functions
  introspection: true, // Enable for development
  csrfPrevention: false, // Disable CSRF for Firebase Functions
});

async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    cors({
      origin: true, // Allow all origins for Firebase Functions
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<ContextValue> => ({
        token: req.headers.authorization || (req.headers.token as string),
        dataSources: {
          ListingAPI: new ListingAPI(),
        },
      }),
    })
  );

  return app;
}

// For local development
if (process.env.NODE_ENV !== "production") {
  startServer()
    .then((app) => {
      const port = process.env.PORT || 4000;
      app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
      });
    })
    .catch(console.error);
}

// Firebase Function export
export const api = functions.https.onRequest(async (req, res) => {
  const app = await startServer();
  app(req, res);
});
