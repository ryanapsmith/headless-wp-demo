type Recipe = {
    __typename: string;
    postType: string;
    url: string;
    id: number;
    title: string;
    content: string | TrustedHTML;
    excerpt: string | TrustedHTML;
    featuredImage: number;
    postTags: string[];
    categoryTerms: string[];
    occasionTerms: string[];
    servings: string;
}

type DefaultPost = {
    __typename: string;
    postType: string;
    url: string;
    id: number;
    title: string;
    content: string | TrustedHTML;
    excerpt: string | TrustedHTML;
    featuredImage: number;
    postTags: string[];
    categoryTerms: string[];
    sourceUrl: string;
}

type Post = Recipe | DefaultPost;

type CardContentProps = {
    post: Post;
}

type Posts = {
    posts: Post[]
}

type ImageProps = {
    id: number;
}

type thumbnailUrl = {
    url: string;
}

type Media = {
    id: number;
    sourceUrl: string;
    thumbnailUrl: thumbnailUrl
}