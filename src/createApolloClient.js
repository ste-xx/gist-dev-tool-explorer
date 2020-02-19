import ApolloClient from "apollo-boost";
import {token} from 'GITHUB_PERSONAL_ACCESS_TOKEN';

export function createApolloClient() {
  return new ApolloClient({
    uri: 'https://api.github.com/graphql',
    fetch,
    request: async (operation) => {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    },
  });
}
