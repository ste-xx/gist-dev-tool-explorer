import ApolloClient from "apollo-boost";

export function createApolloClient({getToken}) {
  return new ApolloClient({
    uri: 'https://api.github.com/graphql',
    fetch,
    request: async (operation) => {
      operation.setContext({
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });
    },
  });
}
