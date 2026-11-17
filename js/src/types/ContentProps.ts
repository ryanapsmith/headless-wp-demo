import { ApolloQueryResult } from "@apollo/client";
import { GetPostsResponse } from "../graphql/queries";

interface ContentProps {
    posts: Post[];
    loadingState: boolean
    loadMore: (options?: any) => Promise<void> | Promise<ApolloQueryResult<GetPostsResponse>>;
    loadingMore: boolean;
    hasMore: boolean;
}

export default ContentProps;