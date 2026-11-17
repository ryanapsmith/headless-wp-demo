<?php

namespace Sample\ElasticPressSearchUi;

interface ReactControllerInterface
{
    public function init(): void;

    public function shouldEnqueueAssets(): bool;
}