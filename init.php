<?php
/*
Plugin Name: ElasticPress Search UI
Description: Creates React-based search results page with content indexed from ElasticPres
Version: 1.0.0
Author: Ryan Smith
Text Domain: sample
License: proprietary
*/

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

use Sample\ElasticPressSearchUi\{
    Admin\ElasticPress\ElasticPressConfiguration,
    Models\AppConfiguration,
    RecipeController,
    TemplateLoader,
};

use Sample\ElasticPressSearchUi\PostTypes\Recipe;

use Sample\ElasticPressSearchUi\Taxonomies\{
    Occasions,
    Categories,
    Tag,
};

require_once __DIR__ . '/vendor/autoload.php';

define('SAMPLE_SRC_DIR', plugin_dir_path(__FILE__) . 'src/');
define('SAMPLE_JS_DIR', plugin_dir_path(__FILE__) . 'js/');
define('SAMPLE_VIEWS_DIR', plugin_dir_path(__FILE__) . 'src/Views/');
define('SAMPLE_JS_PLUGIN_URL', plugins_url( 'js/build/', __FILE__ ));

// Post Types
$recipe = new Recipe('recipe');
$recipe->init();

// Taxonomies
$occasions = new Occasions();
$occasions->init();

$categories = new Categories();
$categories->init();

$tag = new Tag();
$tag->init();

$elasticPressConfiguration = new ElasticPressConfiguration();
$elasticPressConfiguration->init();

$templateLoader = new TemplateLoader();
$templateLoader->init();

$currentBlogId = get_current_blog_id();

(new RecipeController(new AppConfiguration(
    $categories,
    $tag,
    '/wp/v2/users/me?context=edit',
    'http://localhost:4000/graphql/'
)))->init();
