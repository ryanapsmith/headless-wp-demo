import React from 'react';
import PostList from './PostList';
import ContentProps from '../types/ContentProps';
import Loader from './Loader';

const Content = ({posts, loadingState, loadMore, hasMore, loadingMore}: ContentProps) => {
  return (
    <main>
      {!loadingMore && <Loader isLoading={loadingState} />}
      <PostList posts={posts} loadingState={loadingState} loadMore={loadMore} hasMore={hasMore} loadingMore={loadingMore} />
    </main>
  );
};

export default Content;