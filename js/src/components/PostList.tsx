import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Card } from './Card/';
import ContentProps from '../types/ContentProps'
import InfiniteScroll from 'react-infinite-scroll-component';
import Ellipses from './Ellipses';

const areEqual = (prevProps: Post, nextProps: Post) => {
  return prevProps.title === nextProps.title && prevProps.content === nextProps.content && prevProps.id === nextProps.id;
};
const MemoizedCard = memo(Card, areEqual);

const PostList = ({ posts, loadMore, hasMore, loadingState, loadingMore }: ContentProps) => {
  const [currentPosts, setCurrentPosts] = useState<Post[]>([]);
  const handleClick = useCallback(loadMore, []);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!loadingState && !loadingMore) {
      setCurrentPosts([...posts]);
    }
  }, [loadingMore, loadingState]);

  return (
    <InfiniteScroll
      dataLength={currentPosts.length} // Total number of items loaded
      next={loadMore} // Function to load more items
      hasMore={(loadingState || loadingMore || hasMore)} // Flag indicating if there are more items
      loader={loadingMore && <Ellipses />} // Loading indicator component
      endMessage={(currentPosts.length > 0) ? <small>End of results</small> : <small>No results found</small>} // Message when no more items
    >
    <ul ref={listRef} style={{ listStyle: "none", overflowY: 'scroll'}}>
      {currentPosts.map((post: Post) => (
        <li key={post.id} style={{ listStyle: "none" }}>
          <MemoizedCard {...post} />
        </li>
      ))}
      {(loadingState || loadingMore || hasMore) && <button onClick={handleClick}>Load More</button>}
    </ul>
    </InfiniteScroll>
  );
};

export default PostList;