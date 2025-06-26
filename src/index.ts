import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express4";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import http from "http";
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
const httpServer = http.createServer(app);
const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }): Promise<ContextValue> => ({
      token: req.headers.token as string,
      dataSources: {
        ListingAPI: new ListingAPI(),
      },
    }),
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
