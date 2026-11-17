import React from 'react';
import renderRecipe from './renderers/Recipe';
import renderPost from './renderers/Post';

const useCardType = (post: Post) => {
    const cardTypeMap: { [key: string]: (props: CardContentProps) => React.ReactNode } = {
        Recipe: renderRecipe,
        DefaultPost: renderPost,
    };

    const renderContent = cardTypeMap[post.__typename];

    if (renderContent) {
        return renderContent({ post });
    }

    return null; // Handle unknown types
};

export default useCardType;
