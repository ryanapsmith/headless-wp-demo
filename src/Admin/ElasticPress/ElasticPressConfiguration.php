<?php

namespace Sample\ElasticPressSearchUi\Admin\ElasticPress;

use WP_Post;

class ElasticPressConfiguration
{
    public function init(): void
    {
        add_filter('ep_prepare_meta_allowed_protected_keys', [$this, 'addCustomMetaKeys'], 10, 2);
    }

    public function addCustomMetaKeys(array $keys, WP_Post $post): array
    {
        $filteredPostTypes = ['post', 'recipe'];

        if ($post && !in_array($post->post_type, $filteredPostTypes)) {
            return $keys;
        }

        $keysToAdd = [];
        switch ($post->post_type) {
            case 'post':
                $keysToAdd = [
                    'source_url'
                ];
                break;
            case 'recipe':
                $keysToAdd = [
                    'prep_time',
                    'cook_time',
                    'refrigerate_time',
                    'total_time',
                    'servings',
                    'calories'
                ];
                break;
            default:
                $keysToAdd = [];
        }

        return $keysToAdd;
    }
}
