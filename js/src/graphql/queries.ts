import { gql } from '@apollo/client';

export const GET_POSTS = gql`
        query GetPosts($route: String, $postTypes: [String], $searchTerm: String, $termsFilter: [TermInput], $from: Int, $size: Int) {
            posts(route: $route, postTypes: $postTypes, searchTerm: $searchTerm, termsFilter: $termsFilter, from: $from, size: $size) {
                ... on Recipe {
                    id
                    title
                    postType
                    content
                    excerpt
                    url
                    featuredImage
                    postTags
                    categoryTerms
                    occasionTerms
                    servings
                }
                ... on DefaultPost {
                    id
                    title
                    postType
                    content
                    excerpt
                    url
                    featuredImage
                    postTags
                    categoryTerms
                    sourceUrl
                }
            }
        }
    `;

export const GET_AVAILABLE_TERMS = gql`
        query GetAvailableTerms($route: String, $postTypes: [String], $searchTerm: String, $termsFilter: [TermInput]) {
            availableTerms(route: $route, postTypes: $postTypes, searchTerm: $searchTerm, termsFilter: $termsFilter) {
                key
                name
                taxonomy
                type
                value
            }
        }
    `;
    
export const GET_MEDIA = gql`
    query Media($mediaId: Int!) {
        media(id: $mediaId) {
            id
            sourceUrl
            thumbnailUrl {
                url
            }
        }
    }
`;
export interface GetAvailableTermsResponse {
    availableTerms: Term[]
}

export interface GetPostsResponse {
    posts: Post[]
}

export interface GetMediaResponse {
    media: Media
}