<?php

namespace Sample\ElasticPressSearchUi\PostTypes;

use StoutLogic\AcfBuilder\FieldsBuilder;

class Recipe implements PostTypeInterface
{
    public function __construct(
        public string $postTypeSlug
    ) {}

    public function init(): void
    {
        add_action('init', [$this, 'register']);
        add_filter('post_type_link', [$this, 'alterRecipePermalink'], 10, 2);
        add_filter('post_link', [$this, 'alterRecipePermalink'], 10, 2);
        add_action('acf/init', [$this, 'addMetaFields']);
    }

    public function register(): void
    {
        register_post_type(
            $this->postTypeSlug,
            [
                'labels'                => [
                    'name'                  => __('Recipes', 'sample'),
                    'singular_name'         => __('Recipe', 'sample'),
                    'all_items'             => __('All Recipes', 'sample'),
                    'archives'              => __('Recipe Archives', 'sample'),
                    'attributes'            => __('Recipe Attributes', 'sample'),
                    'insert_into_item'      => __('Insert into Recipe', 'sample'),
                    'uploaded_to_this_item' => __('Uploaded to this Recipe', 'sample'),
                    'featured_image'        => _x('Featured Image', 'recipe', 'sample'),
                    'set_featured_image'    => _x('Set featured image', 'recipe', 'sample'),
                    'remove_featured_image' => _x('Remove featured image', 'recipe', 'sample'),
                    'use_featured_image'    => _x('Use as featured image', 'recipe', 'sample'),
                    'filter_items_list'     => __('Filter Recipes list', 'sample'),
                    'items_list_navigation' => __('Recipes list navigation', 'sample'),
                    'items_list'            => __('Recipes list', 'sample'),
                    'new_item'              => __('New Recipe', 'sample'),
                    'add_new'               => __('Add New', 'sample'),
                    'add_new_item'          => __('Add New Recipe', 'sample'),
                    'edit_item'             => __('Edit Recipe', 'sample'),
                    'view_item'             => __('View Recipe', 'sample'),
                    'view_items'            => __('View Recipes', 'sample'),
                    'search_items'          => __('Search Recipes', 'sample'),
                    'not_found'             => __('No Recipes found', 'sample'),
                    'not_found_in_trash'    => __('No Recipes found in trash', 'sample'),
                    'parent_item_colon'     => __('Parent Recipe:', 'sample'),
                    'menu_name'             => __('Recipes', 'sample'),
                ],
                'public'                => true,
                'hierarchical'          => false,
                'show_ui'               => true,
                'show_in_nav_menus'     => true,
                'supports'              => ['title', 'editor', 'thumbnail', 'excerpt'],
                'has_archive'           => $this->postTypeSlug,
                'rewrite'               => [
                    "slug" => $this->postTypeSlug
                ],
                'query_var'             => true,
                'menu_position'         => null,
                'menu_icon'             => 'dashicons-admin-post',
                'show_in_rest'          => true,
                'rest_base'             => $this->postTypeSlug,
                'rest_controller_class' => 'WP_REST_Posts_Controller',
            ]
        );
    }

    public function alterRecipePermalink($permalink, $post)
    {
        if ('recipe' === $post->post_type) {
            $categories = wp_get_post_terms($post->ID, 'category');

            if (! empty($categories)) {
                $primary_category = $categories[0];
                $permalink = home_url('/recipe/' . $primary_category->slug . '/' . $post->post_name . '/');
            } else {
                $permalink = home_url('/recipe/' . $post->post_name . '/');
            }
        }

        return $permalink;
    }

    public function addMetaFields(): void
    {
        $fields = new FieldsBuilder('tags_field_customizations', [
            'title' => __('Recipe Options', 'sample-ui'),
        ]);
        $fields
            ->addText('prep_time', [
                'label' => __('Prep Time', 'sample-ui'),
                'append' => __('mins', 'sample-ui')
            ])
            ->addText('cook_time', [
                'label' => __('Cook Time', 'sample-ui'),
                'append' => __('mins', 'sample-ui')
            ])
            ->addText('refrigerate_time', [
                'label' => __('Refrigerate Time', 'sample-ui'),
                'append' => __('mins', 'sample-ui')
            ])
            ->addText('total_time', [
                'label' => __('Total Time', 'sample-ui'),
                'append' => __('mins', 'sample-ui')
            ])
            ->addText('servings', [
                'label' => __('Servings', 'sample-ui'),
            ])
            ->addText('calories', [
                'label' => __('Calories', 'sample-ui')
            ]);
        $fields->setLocation('post_type', '==', $this->postTypeSlug);
        acf_add_local_field_group($fields->build());
    }
}
