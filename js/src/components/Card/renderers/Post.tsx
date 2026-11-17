import React from 'react';
import Image from '../../Image';

function isPost(post: Post): post is DefaultPost {
    return post.__typename === 'DefaultPost';
}

const renderPost = (props: CardContentProps) => {
    const { post } = props;
    return (
        <>
            <header>
                <div>
                    <h3><a href={post.url} rel="noopener noreferrer">{post.title}</a></h3>
                </div>
            </header>
            {isPost(post) && <div className='excerpt' dangerouslySetInnerHTML={{ __html: post.excerpt }} />}
            {isPost(post) && <div className='source'>{`Source: ${post.sourceUrl}`}</div>}
        </>
    )
}

export default renderPost;