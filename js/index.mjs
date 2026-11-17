import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';
import { Client } from '@elastic/elasticsearch';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import { config } from 'dotenv';

import getConfigForRoute from './config.js';

const generateRequestId = () => {
    return uuidv4().replaceAll('-', '');
};

const elasticClient = new Client({
    node: process.env.ELASTICSEARCH_NODE,
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
    },
    generateRequestId: generateRequestId,
    headers: {
        'X-ElasticPress-Request-ID': generateRequestId(),
    },
});

const typeDefs = gql`
    input TermInput {
        taxonomy: String
        name: String
        key: String
        value: String
        type: String
    }

    interface BasePost {
        id: ID
        title: String
        postType: String
        content: String
        url: String
    }

    type Recipe implements BasePost {
        id: ID
        title: String
        postType: String
        content: String
        excerpt: String
        url: String
        postTags: [String]
        featuredImage: Int
        categoryTerms: [String]
        occasionTerms: [String]
        servings: String
    }

    type DefaultPost implements BasePost {
        id: ID
        title: String
        postType: String
        content: String
        excerpt: String
        url: String
        postTags: [String]
        featuredImage: Int
        categoryTerms: [String]
        sourceUrl: String
    }

    union Post = Recipe | DefaultPost

    type Term {
        taxonomy: String
        name: String
        type: String!
        key: String
        value: String
    }

    type Media {
        id: ID
        sourceUrl: String
        thumbnailUrl: ThumbnailUrl
    }

    type ThumbnailUrl {
        url: String
    }

    type Query {
        posts(route: String, postTypes: [String], searchTerm: String, termsFilter: [TermInput], from: Int, size: Int): [Post]
        availableTerms(route: String, postTypes: [String], searchTerm: String, termsFilter: [TermInput]): [Term]
        media(id: Int!): Media
    }
`;

const buildQueryAndSort = async ({ postTypes, searchTerm, termsFilter, indexName, taxonomyConfig, metaConfig, elasticClient }) => {
    
    let mustClauses = [];
    let shouldClauses = [];
    let filterClauses = [];

    mustClauses.push({
        terms: {
            "post_type.raw": postTypes,
        },
    });

    if (searchTerm) {
        const analyzedSearchTerm = await elasticClient.indices.analyze({
            index: indexName, // Use the same index as your documents
            body: {
                text: searchTerm,
                analyzer: "standard" // Use the same analyzer as your 'post_title' field
            }
        });

        const analyzedTokens = analyzedSearchTerm?.body?.tokens?.map(token => token.token) ?? [];

        mustClauses.push({
            multi_match: {
                query: analyzedTokens.join(" "), // Join analyzed tokens with spaces
                fields: [
                    "post_title",
                ],
                fuzziness: "AUTO:3,7",
                operator: "or"
            }
        });
    }

    if (termsFilter && termsFilter.length > 0) {
        termsFilter.forEach(term => {
            let config = taxonomyConfig.find(t => t.name === term.taxonomy);
            let fieldPath = `terms.${term.taxonomy}.name.raw`;
            if (!config) {
                config = metaConfig.find(m => m.key === term.key);
                fieldPath = `meta.${term.key}.raw`; // Use value for meta
            }

            if (config) {
                switch (config.type) {
                    case 'or':
                        shouldClauses.push({
                            terms: {
                                [fieldPath]: [term.name ?? term.value],
                            },
                        });
                        break;
                    case 'filter':
                        filterClauses.push({
                            terms: {
                                [fieldPath]: [term.name ?? term.value],
                            },
                        });
                        break;
                    case 'any':
                        filterClauses.push({
                            bool: {
                                must: [
                                    { exists: { field: fieldPath } },
                                    { bool: { must_not: { term: { [fieldPath]: "" } } } }
                                ]
                            }
                        });
                        break;
                    default:
                        // Handle unexpected config types 
                        console.warn(`Unexpected config type: ${config.type}`);
                        break;
                }
            }
        });
    }

    let query = {
        bool: {
            must: mustClauses,
        },
    };

    if (shouldClauses.length > 0) {
        query.bool.should = shouldClauses;
        query.bool.minimum_should_match = 1;
    }

    if (filterClauses.length > 0) {
        query.bool.filter = filterClauses;
    }

    const sort = [
        {
            'post_title.sortable': { order: 'asc' }
        }
    ];
  
    return {query, sort};
  };

const mapHitsToPostTypeFields = (hit) => {
    switch (hit._source.post_type) {
        case 'recipe':
            return {
                id: hit._source.post_id,
                title: hit._source.post_title,
                postType: hit._source.post_type,
                content: hit._source.post_content,
                featuredImage: hit._source.thumbnail?.ID ?? 0,
                url: hit._source.permalink ?? '',
                postTags: hit._source.terms["post_tag"]?.map(tag => tag.name) ?? [],
                categoryTerms: hit._source.terms["category"]?.map(term => term.name) ?? [],
                occasionTerms: hit._source.terms["occasions"]?.map(term => term.name) ?? [],
                servings: hit._source.meta["servings"]?.[0].raw ?? ''
            }
        case 'post':
            return {
                id: hit._source.post_id,
                title: hit._source.post_title,
                postType: hit._source.post_type,
                content: hit._source.post_content,
                featuredImage: hit._source.thumbnail?.ID ?? 0,
                url: hit._source.permalink ?? '',
                postTags: hit._source.terms["post_tag"]?.map(tag => tag.name) ?? [],
                categoryTerms: hit._source.terms["category"]?.map(term => term.name) ?? [],
                sourceUrl: hit._source.meta["source_url"]?.[0].raw ?? ''
            }
        default:
            return {
                id: hit._source.post_id,
                title: hit._source.post_title,
                postType: hit._source.post_type,
                content: hit._source.post_content,
                featuredImage: hit._source.thumbnail?.ID ?? 0,
                url: hit._source.permalink ?? '',
                postTags: hit._source.terms["post_tag"]?.map(tag => tag.name) ?? [],
                categoryTerms: hit._source.terms["category"]?.map(term => term.name) ?? [],
            }
    }
    
}

const resolvers = {
    Post: {
        __resolveType(obj) {
            switch (obj.postType) {
                case 'recipe': 
                    return 'Recipe';
                default:
                    return 'DefaultPost';
            }
        },
    },
    Query: {
        posts: async (_, { route, postTypes, searchTerm, termsFilter, from, size }, context) => {
            const { elasticClient, indexName } = context;
            const searchParams = {
                index: indexName,
                from,
                size,
                body: { query: {} }, // Initialize with an empty query object
            };

            const { taxonomyConfig, metaConfig } = getConfigForRoute(route);

            const {query, sort} = await buildQueryAndSort({ postTypes, searchTerm, termsFilter, indexName, taxonomyConfig, metaConfig, elasticClient }); 

            searchParams.body.query = query; // Assign the constructed query
            searchParams.body.sort = sort; // Assign the constructed query

            const { body } = await elasticClient.search(searchParams);

            //@TODO get post total from ElasticSearch and return for pagination

            return body.hits.hits.map(mapHitsToPostTypeFields);
        },
        availableTerms: async (_, { route, postTypes, searchTerm, termsFilter }, context) => {
            const { elasticClient, indexName } = context;

            const { taxonomyConfig, metaConfig } = getConfigForRoute(route);

            const availableTermsSearchParams = {
                index: indexName,
                size: 0,
                body: {
                    aggs: {
                        ...taxonomyConfig.reduce((acc, taxonomy) => {
                            acc[taxonomy.name.replace(/-/g, '_')] = {
                                terms: {
                                    field: `terms.${taxonomy.name}.name.raw`,
                                    size: 10000
                                }
                            };
                            return acc;
                        }, {}),
                        ...metaConfig.reduce((acc, meta) => {
                            acc[meta.key.replace(/-/g, '_')] = {
                                terms: {
                                    field: `meta.${meta.key}.raw`,
                                    size: 10000
                                }
                            };
                            return acc;
                        }, {})
                    }
                },
            };

            // Construct the query for availableTerms 
            if (searchTerm || termsFilter) {
                const { query, sort } = await buildQueryAndSort({ postTypes, searchTerm, termsFilter, indexName, taxonomyConfig, metaConfig, elasticClient });
                availableTermsSearchParams.body.query = query;
            } 

            try {
                const { body } = await elasticClient.search(availableTermsSearchParams);

                const allTerms = [];

                for (const taxonomy of taxonomyConfig) {
                    const underscoredTaxonomy = taxonomy.name.replace(/-/g, '_');
                    const buckets = body.aggregations[underscoredTaxonomy]?.buckets;
                    if (buckets) {
                        allTerms.push(...buckets.map(bucket => ({
                            taxonomy: taxonomy.name,
                            name: bucket.key,
                            type: 'taxonomy'
                        })));
                    }
                }

                for (const meta of metaConfig) {
                    const underscoredMeta = meta.key.replace(/-/g, '_');
                    const buckets = body.aggregations[underscoredMeta]?.buckets;
                    if (meta.type === 'any') {
                        // If type is 'any', add a single term with the label
                        if (buckets && buckets.length > 0) {
                            allTerms.push({
                                key: meta.key,
                                value: meta.label,
                                type: 'meta'
                            });
                        }
                    } else if (buckets) {
                        allTerms.push(...buckets.map(bucket => ({
                            key: meta.key,
                            value: bucket.key,
                            type: 'meta'
                        })));
                    }
                }

                return allTerms;
            } catch (error) {
                console.error("Error fetching available terms:", error);
                return [];
            }
        },
        media: async (_, { id }, context) => {
            const { wpApiUrl, wpUserName, wpAppPassword } = context;
            const url = `${wpApiUrl}/media/${id}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${wpUserName}:${wpAppPassword}`).toString('base64')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching media: ${response.statusText}`);
            }

            const mediaData = await response.json();

            // Extract thumbnail URL
            const thumbnailUrl = mediaData.media_details?.sizes?.thumbnail?.source_url;

            return {
                id: mediaData.id,
                sourceUrl: mediaData.source_url,
                thumbnailUrl: thumbnailUrl ? { url: thumbnailUrl } : null, // Return null if thumbnail is unavailable
            };
        },
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
});

// Start the server
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
        const username = process.env.ELASTICSEARCH_USERNAME;
        const referrer = req.headers.referer;

        // Extract hostname from referrer if available
        const hostname = referrer?.split('://')[1]?.split('/')[0] ?? process.env.DEFAULT_SITE_HOSTNAME;
        const siteId = req.headers['x-site-id'] || process.env.DEFAULT_SITE_ID;
        const wpApiPath = process.env.WP_API_PATH;

        const sanitizedHostname = hostname?.replace(/[^a-zA-Z0-9]/g, '');
        const indexName = `${username}--${sanitizedHostname}-post-${siteId}`.toLowerCase();

        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const wpApiUrl = `${protocol}://${hostname}${wpApiPath}`;

        return {
            elasticClient,
            indexName,
            wpApiUrl,
            wpUserName: process.env.WP_USERNAME,
            wpAppPassword: process.env.WP_APP_PASSWORD,
        };
    },
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);