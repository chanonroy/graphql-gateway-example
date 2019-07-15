const { ApolloServer, gql } = require('apollo-server');
import { buildFederatedSchema } from '@apollo/federation';
import { GraphQLSchema } from 'graphql';
import { find } from 'lodash';
import books from '../data/books';
import stores from '../data/stores';

const typeDefs = gql`
  """
  A book product that is written by an author and available in one store.
  """
  type Book {
    title: String
    author: String
    store: Store
  }

  """
  A store where books and games are sold in.
  Can be online only.
  """
  type Store @key(fields: "id") {
    id: ID
    name: String
    online: Boolean
  }

  type Query {
    "Get all books"
    books: [Book]
    "Get all stores"
    stores: [Store]
    "Fetch a store by its ID"
    getStoreById(id: ID): Store
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    stores: () => stores,
    getStoreById: (obj, args, context, info) => {
      throw Error('this is an error')
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
