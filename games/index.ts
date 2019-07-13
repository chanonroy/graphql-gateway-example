const { ApolloServer, gql } = require("apollo-server");
import { buildFederatedSchema } from "@apollo/federation";
import { GraphQLSchema } from "graphql";
import { find } from "lodash";
import games from "../data/games";
import stores from "../data/stores";

const typeDefs = gql`
  type Game {
    title: String
    developer: String
    store: Store @provides(fields: "name")
  }

  # Store type is inherited from Books Service
  extend type Store @key(fields: ["id"]) {
    id: ID @external
    name: String @external
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

const server = new ApolloServer({ schema });

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🎮  Games server ready at ${url}`);
});
