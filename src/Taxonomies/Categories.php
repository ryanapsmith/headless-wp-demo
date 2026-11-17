<?php

namespace Sample\ElasticPressSearchUi\Taxonomies;

use Sample\ElasticPressSearchUi\Taxonomies\Taxonomy;
use StoutLogic\AcfBuilder\FieldsBuilder;

class Categories extends Taxonomy
{
    public const TAXONOMY_NAME = 'category';

    public function __construct()
    {
        parent::__construct(self::TAXONOMY_NAME);
    }

    public function init(): void
    {
        add_action('init', [$this, 'associateCategoriesWithRecipes'], 99999);
    }

    public function associateCategoriesWithRecipes(): void
    {
        $cpts = ['recipe'];
        foreach($cpts as $cpt) {
            register_taxonomy_for_object_type(self::TAXONOMY_NAME, $cpt);
        }
    }
}
