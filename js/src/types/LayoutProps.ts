import { ApolloQueryResult } from "@apollo/client";
import { GetPostsResponse } from "../graphql/queries";

interface LayoutProps{
    loadingState: boolean;
    posts: Post[];
    searchTerm: string;
    onSearchChange: (newSearchTerm: string) => void;
    terms: Term[];
    onTermsFilterChange: (terms: Term[]) => void;
    selectedTerms: Term[];
    loadMore: (options?: any) => Promise<void> | Promise<ApolloQueryResult<GetPostsResponse>>;
    loadingMore: boolean;
    hasMore: boolean;
}

export default LayoutProps;