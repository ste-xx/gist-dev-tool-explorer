import gql from "graphql-tag";

export const query =  gql(`query {
  viewer {
    gists (first: 100, privacy:ALL, orderBy: {field: CREATED_AT, direction: DESC} ) {
      edges {
        node {
          description
          name
          files {
            name
            text
          }
        }
      }
    }
  }
}`);
