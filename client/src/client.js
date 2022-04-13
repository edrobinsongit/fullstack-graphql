import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import gql from 'graphql-tag'

/**
 * Create a new apollo client and export as default
 */
const typeDefs = gql`
    extend type User {
        age: Int
    }
    extend type Pet {
        vaccinated: Boolean!
    }
`;

const resolvers = {
    User: {
        age: () => 35
    },
    Pet: {
        vaccinated: () => true
    }
};

const httpLink = new HttpLink({ uri: 'http://localhost:4000/' });

const delay = setContext(request =>
    new Promise((success, fail) => {
        setTimeout(() => {
            success()
        }, 800);
    })
);

const link = ApolloLink.from([
    delay,
    httpLink
]);

const cache = new InMemoryCache();

const client = new ApolloClient({
    link,
    cache,
    resolvers,
    typeDefs
});

// const query = gql`
// {
//   characters {
//     results {
//       id
//       name
//     }
//   },
// }
// `;

// client.query({ query })
//     .then(result => console.log(result));

export default client;
