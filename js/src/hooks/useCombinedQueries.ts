import { ApolloQueryResult, QueryHookOptions, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetAvailableTermsResponse, GetPostsResponse } from '../graphql/queries';
import apiFetch from '@wordpress/api-fetch';
import type {
    WP_REST_API_User
} from 'wp-types';
import getConfigForRoute from '../../config';
import { useParams, useLocation } from "react-router";
import { getTermFromPath } from '../utils/routes';

export const useCombinedQueries = <TermsData, PostsData>(
    getTermsQuery: any, //@TODO change type to DocumentNode
    getPostsQuery: any, //@TODO change type to DocumentNode
    searchTerm: string,
    termsFilter: TermInput[],
    pageSize: number,
    config: any
) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [displayTerms, setDisplayTerms] = useState<Term[]>([]);

    const { category, subcategory } = useParams();
    const currentRoute = location.pathname; 
    const routeConfig = getConfigForRoute(currentRoute);
    const { taxonomyConfig, termIgnoreList }  = routeConfig;
    
    useEffect(() => {
        let isMounted = true;
        if (config && config.userEndpointPath) {
            (async () => {
                try {
                    setUserLoading(true);
                    const userResponse: WP_REST_API_User = await apiFetch({ path: config.userEndpointPath });
                    if (isMounted) {
                        setCurrentUser({
                            id: userResponse.id,
                            username: userResponse.username,
                            email: userResponse.email,
                            roles: userResponse.roles,
                        });
                    }
                } catch (userError) {
                    console.error("Error fetching user:", userError);
                } finally {
                    if (isMounted) setUserLoading(false);
                }
            })();
        } else {
            setUserLoading(false);
        }
        return () => {
            isMounted = false;
        };
    }, [config]);

    const [currentPage, setCurrentPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const hierarchicalTermsMap = config?.categoriesMap ?? [];
    const priorityTags = config?.priorityTags ?? [];
    const postTypes = config?.postTypes ?? [];

    const expandedTermsFilter = useMemo(() => {
        const filteredTermWithChildren = termsFilter.flatMap(filterTerm => {
            const children = hierarchicalTermsMap[filterTerm.name || ''] || []; // Get children or empty array

            return [
                filterTerm,
                ...children.map((child: any) => ({
                    taxonomy: filterTerm.taxonomy,
                    name: child,
                    type: 'taxonomy'
                })),
            ];
        });

        return filteredTermWithChildren;
    }, [termsFilter, hierarchicalTermsMap]);

    const termsQueryOptions: QueryHookOptions = useMemo(() => {
        setCurrentPage(0);
        return {
            variables: {
                route: currentRoute,
                postTypes,
                searchTerm,
                termsFilter: expandedTermsFilter
            },
            skip: (searchTerm !== '' && searchTerm.length < 3) || loadingMore || !config,
            fetchPolicy: 'network-only',
        };
    }, [searchTerm, expandedTermsFilter, config, hierarchicalTermsMap]);

    const postsQueryOptions: QueryHookOptions = useMemo(() => {
        return {
            variables: {
                route: currentRoute,
                postTypes,
                searchTerm,
                termsFilter: expandedTermsFilter, // Use the expanded filter
                from: currentPage * pageSize,
                size: pageSize,
            },
            skip: (searchTerm !== '' && searchTerm.length < 3) || loadingMore || !config, 
            fetchPolicy: 'network-only',
        };
    }, [searchTerm, expandedTermsFilter, currentPage, pageSize, loadingMore, config, hierarchicalTermsMap]);


    const termsQuery = useQuery<GetAvailableTermsResponse>(getTermsQuery, termsQueryOptions);

    const postsQuery = useQuery<GetPostsResponse>(getPostsQuery, postsQueryOptions);

    useEffect(() => {
        console.log("refetching")
        if (!loadingMore && postsQuery && config) {
            setCurrentPage(0);
            postsQuery.refetch({
                route: currentRoute,
                postTypes,
                searchTerm,
                termsFilter: expandedTermsFilter,
                from: 0,
                size: pageSize,
            });
        }
    }, [searchTerm, termsFilter, expandedTermsFilter, pageSize, config]);

const loadMore = useCallback((fetchMoreOptions?: any) => {
        if (postsQuery?.fetchMore) {
            setLoadingMore(true);
            return postsQuery.fetchMore({
                variables: {
                    route: currentRoute,
                    postTypes,
                    searchTerm,
                    termsFilter: expandedTermsFilter,
                    from: currentPage * pageSize,
                    size: pageSize,
                    ...fetchMoreOptions?.variables
                },
                ...fetchMoreOptions
            })
                .then(() => {
                    setCurrentPage(currentPage + 1);
                })
                .catch((error) => {
                    console.error("Error fetching more posts:", error);
                })
                .finally(() => setLoadingMore(false));;
        }
        return Promise.resolve({ data: undefined } as ApolloQueryResult<GetPostsResponse>);
    }, [postsQuery, searchTerm, expandedTermsFilter, currentPage, pageSize]);


    const loading = userLoading || (termsQuery?.loading ?? false) || (postsQuery?.loading ?? false);
    const error: any = (termsQuery?.error) || (postsQuery?.error) ? null : undefined;
    const termsData = termsQuery?.data;
    const postsData = postsQuery?.data;


    useEffect(() => {
        if (termsQuery.previousData === undefined) setDisplayTerms(termsData?.availableTerms);
    }, [termsQuery, config]);

    const filteredPosts = useMemo(() => {
        if (!postsData?.posts) return [];
        // Check for admin role and skip tags/filtering if applicable
        if (currentUser?.roles && (currentUser.roles.includes('administrator') || currentUser.roles.includes('subscriber'))) {

            return postsData.posts; // Exit the function early if admin
        }

        return []; // if not authenticated don't return anything
    }, [postsData?.posts, currentUser]);

    const filteredTerms = useMemo(() => {
        if (!termsData?.availableTerms) return [];

        let termsToFilter = termsData.availableTerms;

        if (displayTerms) {
            termsToFilter = displayTerms.filter((displayTerm) => {
                if (displayTerm.taxonomy === 'category') return true;
                if (displayTerm.taxonomy !== 'category' && postsData?.posts.length !== 0) {
                    return termsData.availableTerms.some((availableTerm) =>
                        availableTerm.taxonomy === displayTerm.taxonomy &&
                        availableTerm.name === displayTerm.name
                    );
                }

                return true;
            });
        }

        const topLevelTerms = Object.keys(hierarchicalTermsMap);
        
        // add all categories before filter
        const currentTerm = getTermFromPath(subcategory ?? category, config) ?? null;
        const categories: Term[] = [];
        for (const parentTerm in hierarchicalTermsMap) {
            if (hierarchicalTermsMap.hasOwnProperty(parentTerm)) {
                if (currentTerm && parentTerm !== currentTerm.name) {
                    categories.push({
                    taxonomy: 'category',
                    name: parentTerm,
                    type: 'taxonomy'
                });}

                const children = hierarchicalTermsMap[parentTerm];

                if (Array.isArray(children)) {
                    children.forEach(child => {
                        categories.push({
                            taxonomy: 'category',
                            name: child,
                            type: 'taxonomy',
                        });
                    });
                }
            }
        }
        termsToFilter = [...termsToFilter, ...categories];

        return termsToFilter.filter((term) => {
            if (termIgnoreList.includes(term.name ?? term.value)) return false;
            if (term.type !== 'taxonomy') return true;
            if (term.taxonomy !== 'category') return true;

            if (term.name) {
                if (category) {
                    const parentcategory = getTermFromPath(category, config)
                    return parentcategory.name === term.name || expandedTermsFilter.some(expandedTerm => expandedTerm.name === term.name) || hierarchicalTermsMap[currentTerm.name || ''].includes(term.name); // show selected term from category or children
                } else {
                    return topLevelTerms.includes(term.name);
                }
            }
            return true; // Keep other terms (e.g., if type is unknown or name/value is missing)
        })
            .sort((a, b) => {
                // Group by type, then taxonomy, then key
                if (a.type !== b.type) {
                    return a.type.localeCompare(b.type);
                } else if (a.taxonomy !== b.taxonomy) {
                    const aTaxonomyIndex = taxonomyConfig.findIndex((config) => config.name === a.taxonomy);
                    const bTaxonomyIndex = taxonomyConfig.findIndex((config) => config.name === b.taxonomy);
                    if (aTaxonomyIndex !== bTaxonomyIndex) {
                        return aTaxonomyIndex - bTaxonomyIndex;
                    }
                } else if (a.key !== b.key) {
                    return (a.key || '').localeCompare(b.key || '');
                } else {
                    // Within each group, sort based on priority for 'post_tag' and alphabetically for others
                    if (a.taxonomy === 'post_tag' && b.taxonomy === 'post_tag' && priorityTags.length > 0) {
                        const aPriority = priorityTags.includes(a.name ?? a.value) ? 1 : 0;
                        const bPriority = priorityTags.includes(b.name ?? b.value) ? 1 : 0;
                        if (aPriority !== bPriority) {
                            return bPriority - aPriority; // Prioritize priorityTags
                        } else {
                            return (a.name || a.value).localeCompare(b.name || b.value); // Sort alphabetically within priorityTags
                        }
                    } else {
                        return (a.name || a.value).localeCompare(b.name || b.value);
                    }
                }
            });
    }, [termsData?.availableTerms, hierarchicalTermsMap, termIgnoreList, postsData?.posts, priorityTags]);

    return { loading, error, termsData: { ...termsData, availableTerms: filteredTerms }, postsData: { ...postsData, posts: filteredPosts }, loadMore, hasMore: postsData?.posts?.length > 0 && postsData?.posts?.length % pageSize === 0, loadingMore };
};