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
 * Library path and URL.
 */
if ( ! defined( 'METAMEDIA_DIR' ) ) {
    define( 'METAMEDIA_DIR', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'METAMEDIA_URI' ) ) {
    define( 'METAMEDIA_URI', plugin_dir_url( __FILE__ ) );
}

/**
 * Load the library text domain.
 *
 * @since 1.0.0
 */
function metamedia_load_textdomain() {
	load_plugin_textdomain( 'metamedia', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}

/**
 * Load API functions.
 */
require( METAMEDIA_DIR . 'includes/functions.php' );

/**
 * Load and initialize admin functions and hooks.
 */
if ( is_admin() ) {
	require( METAMEDIA_DIR . 'includes/admin.php' );

	add_action( 'plugins_loaded', 'metamedia_load_textdomain' );
	add_action( 'admin_enqueue_scripts', 'metamedia_register_assets', 1 );
	add_action( 'save_post', 'metamedia_save_post', 10, 2 );
	add_action( 'add_meta_boxes', 'metamedia_add_meta_boxes' );
}
