<?php

namespace Sample\ElasticPressSearchUi;

use Sample\ElasticPressSearchUi\Models\AppConfiguration;
use Sample\ElasticPressSearchUi\ReactControllerInterface;

class ReactController implements ReactControllerInterface
{
    protected string $controllerDomain;

    public function __construct(
        public AppConfiguration $appConfiguration,
        public string $domain = ''
    )
    {
        $this->appConfiguration = $appConfiguration;
        $this->controllerDomain = $domain;
    }

    public function init(): void
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueReactAppAssets']);
    }

    public function enableRestApis(): void 
    {
        add_filter('bb_enable_private_rest_apis_public_content', [$this, 'enableEndpoints']);
    }

    public function shouldEnqueueAssets(): bool
    {
        return false;
    }

    /**
     * TODO add CRM tags using fluentcrm_get_current_contact() or FluentCrmApi('contacts')->getContactByUserRef($userIdOrEmail);
     */
    public function enqueueReactAppAssets(): void
    {
        if (!$this->shouldEnqueueAssets()) {
            return;
        }

        $assetFile = SAMPLE_JS_DIR . 'build/scripts.asset.php';

        if ( ! file_exists( $assetFile ) ) {
            return;
        }

        $asset = include $assetFile;

        wp_enqueue_style(
            "sample-$this->controllerDomain-ui-styles",
            SAMPLE_JS_PLUGIN_URL . 'styles.css', 
            [], 
            $asset['version']
        );
        wp_enqueue_script(
            "sample-$this->controllerDomain-ui",
            SAMPLE_JS_PLUGIN_URL . 'scripts.js',
            $asset['dependencies'],
            $asset['version'],
            array(
                'in_footer' => true,
            )
        );

        $appConfigJSON = wp_json_encode($this->appConfiguration);

        wp_add_inline_script("sample-$this->controllerDomain-ui", "window.appConfiguration = '$appConfigJSON';", 'before');
    }
}
