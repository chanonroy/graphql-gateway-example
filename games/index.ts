const { ApolloServer, gql } = require("apollo-server");
import { buildFederatedSchema } from "@apollo/federation";
import { GraphQLSchema } from "graphql";
import { find } from "lodash";
import games from "../data/games";
import stores from "../data/stores";
import { shield, rule } from "graphql-shield";
import { applyMiddleware } from "graphql-middleware";

// Default behaviour is to always throw error here on games.
const isGamer = rule()(async (parent, args, ctx, info) => {
  return new Error('Not a gamer')
});

const permissions = shield({
  Query: {
    games: isGamer
  }
});


const typeDefs = gql`
  """
  A video game that is made by a developer and available in one store.
  """
  type Game {
    title: String
    developer: String
    store: Store @provides(fields: "name, online")
  }

  extend type Store @key(fields: ["id"]) {
    id: ID @external
    name: String @external
    online: Boolean @external
  }

  type Query {
    games: [Game]
  }
`;

const resolvers = {
  Query: {
    games: () => games
  },
  Game: {
    store(game) {
      return find(stores, { id: game.store });
    }
  }
};

const schema: GraphQLSchema = buildFederatedSchema([
  {
    typeDefs,
    resolvers
  }
]);

const schemaWithPermissions = applyMiddleware(schema, permissions);

const server = new ApolloServer({ schema: schemaWithPermissions });

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🎮  Games server ready at ${url}`);
});
