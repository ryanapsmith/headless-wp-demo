<?php

namespace Sample\ElasticPressSearchUi\Taxonomies;

use Sample\ElasticPressSearchUi\Taxonomies\Taxonomy;

class Occasions extends Taxonomy
{
    public const OCCASIONS_DEFAULT_POST_TYPES = [
        'recipe'
    ];

    public const TAXONOMY_NAME = 'occasions';

    public function __construct()
    {
        parent::__construct(self::TAXONOMY_NAME);
    }
    
    public function init(): void
    {
        add_action('init', [$this, 'register'], 99999);
    }

    public function register(): void
    {
        /**
         * Occasion Taxonomy Post Types.
         * 
         * For when folks ibnvariably change their mind.
         * 
         * @since 1.0.0
         * 
         * @param array $postTypes Array of post type slugs
         */
        $associatedPostTypes = apply_filters('sample_occasions_post_types', self::OCCASIONS_DEFAULT_POST_TYPES); // filters, for when folks change their mind about something. @since 

        register_taxonomy(self::TAXONOMY_NAME, $associatedPostTypes, [
            'hierarchical'          => true,
            'public'                => true,
            'show_in_nav_menus'     => true,
            'show_ui'               => true,
            'show_admin_column'     => false,
            'query_var'             => true,
            'rewrite'               => true,
            'capabilities'          => [
                'manage_terms' => 'edit_posts',
                'edit_terms'   => 'edit_posts',
                'delete_terms' => 'edit_posts',
                'assign_terms' => 'edit_posts',
            ],
            'labels'                => [
                'name'                       => __('Occasions', 'sample'),
                'singular_name'              => _x('Occasion', 'taxonomy general name', 'sample'),
                'search_items'               => __('Search Occasions', 'sample'),
                'popular_items'              => __('Popular Occasions', 'sample'),
                'all_items'                  => __('All Occasions', 'sample'),
                'parent_item'                => __('Parent Occasion', 'sample'),
                'parent_item_colon'          => __('Parent Occasion:', 'sample'),
                'edit_item'                  => __('Edit Occasion', 'sample'),
                'update_item'                => __('Update Occasion', 'sample'),
                'view_item'                  => __('View Occasion', 'sample'),
                'add_new_item'               => __('Add New Occasion', 'sample'),
                'new_item_name'              => __('New Occasion', 'sample'),
                'separate_items_with_commas' => __('Separate occasion with commas', 'sample'),
                'add_or_remove_items'        => __('Add or remove occasion', 'sample'),
                'choose_from_most_used'      => __('Choose from the most used occasions', 'sample'),
                'not_found'                  => __('No occasion found.', 'sample'),
                'no_terms'                   => __('No occasion', 'sample'),
                'menu_name'                  => __('Occasions', 'sample'),
                'items_list_navigation'      => __('Occasions list navigation', 'sample'),
                'items_list'                 => __('Occasions list', 'sample'),
                'most_used'                  => _x('Most Used', 'occasion', 'sample'),
                'back_to_items'              => __('&larr; Back to Occasions', 'sample'),
            ],
            'show_in_rest'          => true,
            'rest_base'             => self::TAXONOMY_NAME,
            'rest_controller_class' => 'WP_REST_Terms_Controller',
        ]);
    }
}
