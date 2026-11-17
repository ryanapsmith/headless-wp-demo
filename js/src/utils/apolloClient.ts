import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { concatPagination } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { AppConfiguration } from '../types/AppConfiguration';

const createApolloClient = (config: AppConfiguration | null) => { 
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            ...concatPagination(['searchTerm', 'termsFilter']),
            merge(existing = [], incoming, { args }) {
              const merged = existing ? existing.slice(0) : []; // Create a copy of existing
              incoming.forEach((incomingItem: { __ref: any; }) => {
                if (!merged.find((existingItem: { __ref: any; }) => existingItem.__ref === incomingItem.__ref)) {
                  merged.push(incomingItem);
                }
              });
              return merged;
            },
          }
        },
      },
    },
  });
  
  const authLink = setContext((_, { headers }) => {
    const siteId = config?.siteId || 1; // Get site ID from global or wherever it's stored
    return {
        headers: {
            ...headers,
            'x-site-id': siteId, // Add site ID as a custom header
        },
    };
  });

  return new ApolloClient({
    link: authLink.concat(new HttpLink({ // Combine the links!
        uri: config?.apolloServerEndpoint || 'http://localhost:4000/graphql' // Provide default as well
    })),
    cache,
});
}

export default createApolloClient;