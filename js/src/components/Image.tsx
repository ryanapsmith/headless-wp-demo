import { QueryHookOptions, useQuery } from '@apollo/client';
import React from 'react';
import { GET_MEDIA, GetMediaResponse } from '../graphql/queries';
const Image = ({ id }: ImageProps) => {
    if (!id) {
        return <figure></figure>;
    }

    const mediaQueryOptions: QueryHookOptions = {
        variables: { mediaId: id }
    }
    const { loading: mediaLoading, error: mediaError, data: mediaData } = useQuery<GetMediaResponse>(GET_MEDIA, mediaQueryOptions);

    if (mediaLoading) {
        return (
            <figure></figure>
        );
    }

    if (mediaError) {
        console.error('Could not load media with id ' + id, mediaError.message)
        return <figure></figure>;
    }

    let imgSrc = mediaData.media.thumbnailUrl?.url ?? mediaData.media.sourceUrl

    return (
        <figure>
            {imgSrc && ( // Check if thumbnailUrl exists
                <img width={"150px"} height={"150px"} src={imgSrc} alt="Thumbnail" />
            )}
        </figure>
    )
}

export default Image;