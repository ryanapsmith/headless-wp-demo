import Layout from '../layouts/layout';
import { useCombinedQueries } from '../hooks/useCombinedQueries';
import { GET_AVAILABLE_TERMS, GET_POSTS, GetAvailableTermsResponse, GetPostsResponse } from '../graphql/queries';
import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { useParams, useLocation } from "react-router";
import { getTermFromPath } from '../utils/routes';

const useDebouncedState = ({value, delay}: {value: string, delay: number}) => {
    const [state, setState] = useState(value);
    useEffect(() => {
      const debouncedSetState = debounce(setState, delay);
      debouncedSetState(value);
      return () => debouncedSetState.cancel();
    }, [value, delay]);
    return state;
  };

const Main = ({ config }: { config: any }) => {
    const [searchTerm, setSearchTerm] = useState<string | null>('');
    const debouncedSearchTerm = useDebouncedState({value: searchTerm, delay: 500},); // Use the custom Hook
    
    const { category, subcategory } = useParams();
    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState(location.pathname);
    function setInitialTerms() {
        return category ? [getTermFromPath(category, config)]: [];
    }
    const [selectedTerms, setSelectedTerms] = useState<Term[]>(setInitialTerms);

    const termsFilter = useMemo(() => {
        if (currentLocation && location.pathname !== currentLocation) { // reset selected terms and termFilter
            setCurrentLocation(location.pathname);
            const newTerms = [getTermFromPath(subcategory ?? category, config)];
            setSelectedTerms((prevSelectedTerms) => {
                return newTerms;
            });
            return newTerms.map(term => ({ name: term.name, taxonomy: term.taxonomy, key: term.key, value: term.value, type: term.type }));
        }

        return selectedTerms.map(term => ({ name: term.name, taxonomy: term.taxonomy, key: term.key, value: term.value, type: term.type }));
    }, [selectedTerms, location.pathname]);

    const handleSearchChange = useCallback((newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
    }, []);

    const handleTermsFilterChange = useCallback((terms: Term[]) => {
        setSelectedTerms((prevSelectedTerms) => {
            return terms;
        });
    }, []);

    const pageSize = 10;
    
    const queryResult = useCombinedQueries<GetAvailableTermsResponse, GetPostsResponse>(
        GET_AVAILABLE_TERMS,
        GET_POSTS,
        debouncedSearchTerm,
        termsFilter,
        pageSize,
        config
    );

    if (queryResult.error) {
        console.error(queryResult.error);
    }

    return <Layout
        loadingState={queryResult.loading}
        posts={queryResult.postsData?.posts || []}
        terms={queryResult.termsData?.availableTerms || []}
        selectedTerms={selectedTerms}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onTermsFilterChange={handleTermsFilterChange} loadMore={queryResult.loadMore}
        loadingMore={queryResult.loadingMore}
        hasMore={queryResult.hasMore}
    />;
}


export default Main;