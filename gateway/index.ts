import { ApolloGateway, GatewayConfig } from "@apollo/gateway";
import { ServerInfo } from "apollo-server";
import { ApolloServer } from "apollo-server";
import { shield, rule } from "graphql-shield";
import { applyMiddleware } from 'graphql-middleware';

// Changing to false will return null for books
const isReader = rule()(async (parent, args, ctx, info) => {
  return true;
});

// Changing to false will return null for games
const isGamer = rule()(async (parent, args, ctx, info) => {
  return true;
});

const permissions = shield({
  Query: {
    books: isReader,
    games: isGamer
  }
});

const start = async (apolloGateway: ApolloGateway): Promise<ServerInfo> => {
  const { schema, executor } = await apolloGateway.load();

  const schemaWithPermissions = applyMiddleware(schema, permissions);

  return new ApolloServer({
    schema: schemaWithPermissions,
    executor,
  }).listen({ port: 9999 });
};

const config: GatewayConfig = {
  serviceList: [
    { name: "books", url: "http://localhost:4000" },
    { name: "games", url: "http://localhost:5000" }
  ]
};

const gateway = new ApolloGateway(config);

start(gateway).then(({ url }) => {
  console.log(`🚀 Gateway server ready at ${url}`);
});
