<?php

namespace Sample\ElasticPressSearchUi\Taxonomies;

use Sample\ElasticPressSearchUi\Taxonomies\Taxonomy;
use StoutLogic\AcfBuilder\FieldsBuilder;

class Tag extends Taxonomy
{
    public const TAXONOMY_NAME = 'post_tag';

    public function __construct()
    {
        parent::__construct(self::TAXONOMY_NAME);
    }

    public function init(): void
    {
        add_action('init', [$this, 'associateTagsWithRecipes'], 99999);
        add_action('acf/init', [$this, 'addTagsMetaFields']);
    }

    public function associateTagsWithRecipes(): void
    {
        $cpts = ['recipe'];
        foreach($cpts as $cpt) {
            register_taxonomy_for_object_type(self::TAXONOMY_NAME, $cpt);
        }
    }

    public function addTagsMetaFields(): void
    {
        $fields = new FieldsBuilder('tags_field_customizations', [
            'title' => __('Tag Options', 'sample-ui'),
        ]);
        $fields
            ->addTrueFalse('priority', [
                'label' => __('Priority', 'sample-ui'),
                'ui' => true,
                'ui_on_text' => __('Display tag first in lists', 'sample-ui'),
                'ui_off_text' => __('Display tag using default order ', 'sample-ui'),
                'default_value' => 0
            ]);
        $fields->setLocation('taxonomy', '==', self::TAXONOMY_NAME);
        acf_add_local_field_group($fields->build());
    }

    public function getPriorityTags(): array
    {
        $priorityTags = [];

        $args = [
            'taxonomy' => self::TAXONOMY_NAME,
            'hide_empty' => false, // Include empty tags if needed
        ];
        
        $tags = get_terms( $args );
    
        if ( empty($tags) || is_wp_error( $tags ) ) return $priorityTags;
        foreach ( $tags as $tag ) {
            $priority = get_field( 'priority', $tag );
    
            if ( wp_validate_boolean($priority) ) { 
                $priorityTags[] = $tag->name; // Add the tag name to the array
            }
        }

        return $priorityTags;
    }
}
