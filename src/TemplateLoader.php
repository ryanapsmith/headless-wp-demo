<?php

namespace Sample\ElasticPressSearchUi;

class TemplateLoader
{
    public function init(): void
    {
        add_filter('template_include', [$this, 'addRecipesTemplate'], 10, 1);
        add_action('init', [$this, 'recipeRewriteRules']);
    }

    public function recipeRewriteRules()
    {
        add_rewrite_rule(
            '^recipe/([^/]+)/([^/]+)/?$',
            'index.php?recipe=$matches[2]&category_name=$matches[1]',
            'top'
        );
    }

    public function addRecipesTemplate(string $template): string
    {
        if (!is_post_type_archive('recipe')) {
            return $template;
        }

        return $this->getTemplateFile('Recipes/archive.php', $template);
    }

    private function getTemplateFile(string $file, string $defaultTemplate): string
    {
        $templateFile = SAMPLE_VIEWS_DIR . $file;
        if (file_exists($templateFile)) {
            return $templateFile;
        }

        return $defaultTemplate;
    }
}
