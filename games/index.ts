const { ApolloServer, gql } = require('apollo-server');
import { buildFederatedSchema } from '@apollo/federation';
import { GraphQLSchema } from 'graphql';

const games = [
  {
    title: 'Sim City',
    developer: 'EA Games',
  },
  {
    title: 'Warcraft III',
    developer: 'Blizzard'
  },
];

const typeDefs = gql`
  type Game {
    title: String
    developer: String
  }

  type Query {
    games: [Game]
  }
`;

const resolvers = {
  Query: {
    games: () => games,
  },
};

const schema: GraphQLSchema = buildFederatedSchema([{
  typeDefs,
  resolvers,
}]);

const server = new ApolloServer({ schema });

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
