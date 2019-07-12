import { ApolloGateway, GatewayConfig } from '@apollo/gateway';
import { ServerInfo } from 'apollo-server';
import { ApolloServer } from 'apollo-server';

const start = async (apolloGateway: ApolloGateway): Promise<ServerInfo> => {
  const { schema, executor } = await apolloGateway.load();

  return new ApolloServer({
    schema,
    executor,
  }).listen({ port: 9999 });
};

const config: GatewayConfig = {
  serviceList: [
    { name: 'books', url: 'http://localhost:4000' },
    { name: 'games', url: 'http://localhost:5000' }
  ]
};

const gateway = new ApolloGateway(config);

start(gateway).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});
