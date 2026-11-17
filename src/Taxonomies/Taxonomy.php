<?php

namespace Sample\ElasticPressSearchUi\Taxonomies;

abstract class Taxonomy implements TaxonomyInterface
{
    protected string $taxonomyName;

    public function __construct(string $taxonomyName) {
        $this->taxonomyName = $taxonomyName;
    }

    public function register(): void {} // Empty implementation

    public function init(): void {} // Empty implementation

    public function getTaxonomyTermsNested(): array
    {
        $terms = get_terms([
            'taxonomy' => $this->taxonomyName,
            'hide_empty' => false,
            'hierarchical' => true,
        ]);

        if (is_wp_error($terms) || empty($terms)) {
            return [];
        }

        $nestedTerms = [];
        $parentTerms = [];

        foreach ($terms as $term) {
            if ($term->parent == 0) {
                $parentTerms[$term->term_id] = $term->name;
            }
        }

        foreach ($terms as $term) {
            if ($term->parent != 0) {
                $parentId = $term->parent;
                $parentName = get_term_field('name', $parentId, $this->taxonomyName);
                if (isset($parentTerms[$parentId])) {
                    if (!isset($nestedTerms[$parentName])) {
                        $nestedTerms[$parentName] = [];
                    }
                    $nestedTerms[$parentName][] = $term->name;
                }
            }
        }

        foreach ($parentTerms as $parentId => $parentName) {
            if (!isset($nestedTerms[$parentName])) {
                $nestedTerms[$parentName] = '';
            }
        }

        return $nestedTerms;
    }
    
    public function getTermNamesFromIds( $termIds ) {
        $termNames = [];
    
        if ( ! empty( $termIds ) && is_array( $termIds ) ) {
            foreach ( $termIds as $termId ) {
                $term = get_term( $termId );
    
                if ( ! is_wp_error( $term ) && $term ) {
                    $termNames[] = $term->name;
                }
            }
        }
    
        return $termNames;
    }
}
