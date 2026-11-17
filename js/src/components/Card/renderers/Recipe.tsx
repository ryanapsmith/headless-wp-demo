import React from 'react';
import Image from '../../Image';

function isRecipe(post: Post): post is Recipe {
    return (post.__typename === 'Recipe');
}

const renderRecipe = (props: CardContentProps) => {
    const { post } = props;
    return (
        <>
            <header>
                {isRecipe(post) && <Image id={post.featuredImage} />}
                <div>
                    <h3><a href={post.url} rel="noopener noreferrer">{post.title}</a></h3>
                    {isRecipe(post) && <div className='tagline' dangerouslySetInnerHTML={{ __html: post.excerpt }} />}
                </div>
                <a className='button' href={post.url} rel="noopener noreferrer">View Recipe</a>
            </header>
        </>
    )
}

export default renderRecipe;