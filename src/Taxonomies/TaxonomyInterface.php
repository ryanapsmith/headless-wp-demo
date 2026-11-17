<?php

namespace Sample\ElasticPressSearchUi\Taxonomies;

interface TaxonomyInterface
{
    public function register(): void;

    public function init(): void;
}