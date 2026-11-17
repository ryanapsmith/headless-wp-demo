<?php

namespace Sample\ElasticPressSearchUi\Models;

use JsonSerializable;
use Sample\ElasticPressSearchUi\Taxonomies\{
    Categories,
    Tag
};

class AppConfiguration implements JsonSerializable
{
    public function __construct(
        public Categories $categories,
        public Tag $tag,
        public string $userEndpointPath,
        public string $apolloServerEndpoint,
        public array $postTypes = [],
        public int $siteId = 1,
        public string $siteName = ''
    ) {
        $currentBlogId = get_current_blog_id();
        $this->siteId = ($currentBlogId > 1) ? $currentBlogId : $siteId;
    }

    public function setPostTypes(array $types): self
    {
        $this->postTypes = $types;

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'userEndpointPath' => $this->userEndpointPath,
            'apolloServerEndpoint' => $this->apolloServerEndpoint,
            'siteId' => $this->siteId,
            'siteName' => get_bloginfo(),
            'categoriesMap' => $this->categories->getTaxonomyTermsNested(),
            'priorityTags' => $this->tag->getPriorityTags(),
            'postTypes' => $this->postTypes
        ];
    }
}
