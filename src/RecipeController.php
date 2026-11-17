<?php

namespace Sample\ElasticPressSearchUi;

use Sample\ElasticPressSearchUi\Models\AppConfiguration;

class RecipeController extends ReactController
{
    public const DOMAIN = 'recipe';

    public function __construct(
        public AppConfiguration $appConfiguration,
    ) {
        $this->appConfiguration->setPostTypes(
            ['recipe']
        );
        parent::__construct($this->appConfiguration, self::DOMAIN);
    }

    public function shouldEnqueueAssets(): bool
    {
        if (is_post_type_archive('recipe')) {
            return true;
        }

        return false;
    }
}
