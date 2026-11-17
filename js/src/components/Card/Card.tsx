import React from 'react';
import useCardType from './useCardType';

const Card = (post: Post) => {
    const cardContent = useCardType(post);

    return (
        <>{cardContent}</>
    )
}

export default Card;