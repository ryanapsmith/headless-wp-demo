=== ElasticPress Search UI ===
Contributors:      Ryan Smith
Tags:              search
Tested up to:      6.7
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Replace default archive and search templates with React app powered by ElasticPress

== Description ==

This plugin takes the first step towards decoupling the WordPress backend from the front end by creating a React application that loads on select archive pages. The components of the app are hydrated with data from an ElasticSearch index and various REST API calls. 

There is also an option to set some post tags as priority so they appear before all other tags in the tag cloud in the side bar.


== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/elasticpress-search-ui` directory, or install the plugin through the WordPress plugins screen directly.
This plugin is built using Composer for autoloading, and also has two plugin dependencies – Advanced Custom Fields and ElasticPress plugins. Run `composer install` to get things going.
2. Activate the plugin through the 'Plugins' screen in WordPress, as well as the two dependencies.
3. This plugin needs a working ElasticSearch index. You can start a local Apollo server by filling in the variables in the js/.env.sample file and renaming it to .env . You will need a working WordPress user application password as well for retrieving user info. Then run node index.mjs to start the server.
4. Create a few recipes and index the content from the Sync page of the ElasticPress plugin.
5. Visit the yoursite.com/recipe post type archive page to see it in action.


== Frequently Asked Questions ==

= Page isn't working. =

- Double check that your local Apollo instance is running at http://localhost:4000/graphql/
- Did you run `composer install`? This ensures Advanced Custom Fields and ElasticPress are available – install them  via WP admin plugins page if you don't have composer installed and activate them.
- Make sure you have at least one Recipe published and indexed, with an assigned category, occasion and a couple tags to test everything is working.


== Screenshots ==

1. Recipe archive page

== Changelog ==

= 1.0.0 =
* Release
