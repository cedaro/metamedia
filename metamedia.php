<?php
/**
 * Plugin Name: Metamedia
 * Plugin URI: http://www.blazersix.com/
 * Description: Register meta boxes for selecting featured images or galleries.
 * Version: 1.0.0
 * Author: Blazer Six, Inc.
 * Author URI: http://www.blazersix.com/
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: metamedia
 * Domain Path: /languages
 *
 * @package Metamedia
 * @author Brady Vercher <brady@blazersix.com>
 * @copyright Copyright (c) 2013, Blazer Six, Inc.
 * @license GPL-2.0+
 */

/**
 * Framework path and URL.
 */
if ( ! defined( 'METAMEDIA_DIR' ) )
    define( 'METAMEDIA_DIR', plugin_dir_path( __FILE__ ) );

if ( ! defined( 'METAMEDIA_URI' ) )
    define( 'METAMEDIA_URI', plugin_dir_url( __FILE__ ) );

/**
 * Load API functions.
 */
require( METAMEDIA_DIR . 'includes/functions.php' );

/**
 * Load and initialize admin functions and hooks.
 */
if ( is_admin() ) {
	require( METAMEDIA_DIR . 'includes/admin.php' );

	add_action( 'init', 'metamedia_init_admin' );
	add_action( 'init', 'metamedia_load_textdomain' );
}

/**
 * Support localization for the plugin strings.
 *
 * @see http://www.geertdedeckere.be/article/loading-wordpress-language-files-the-right-way
 *
 * @since 1.0.0
 */
function metamedia_load_textdomain() {
	$locale = apply_filters( 'plugin_locale', get_locale(), 'metamedia' );
	load_textdomain( 'metamedia', WP_LANG_DIR . '/metamedia/' . $locale . '.mo' );
	load_plugin_textdomain( 'metamedia', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
