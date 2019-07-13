const { ApolloServer, gql } = require('apollo-server');
import { buildFederatedSchema } from '@apollo/federation';
import { GraphQLSchema } from 'graphql';
import { find, filter } from 'lodash';
import books from '../data/books';
import stores from '../data/stores';

const typeDefs = gql`
  type Book {
    title: String
    author: String
    store: Store
  }

  type Store {
    id: ID
    name: String
  }

  type Query {
    books: [Book]
    stores: [Store]
    store(id: ID): Store
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    stores: () => stores,
    store: (obj, args, context, info) => {
      return find(stores, { id: args.id })
    },
  },
  Book: {
    store(book) {
      return find(stores, { id: book.store });
    },
  }
};

const schema: GraphQLSchema = buildFederatedSchema([{
  typeDefs,
  resolvers,
}]);

const server = new ApolloServer({ schema });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`📚  Books server ready at ${url}`);
});
