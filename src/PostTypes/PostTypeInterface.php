<?php

namespace Sample\ElasticPressSearchUi\PostTypes;

interface PostTypeInterface
{
    public function init() : void;

    public function register() : void;    
    
}