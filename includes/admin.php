<?php
/**
 * Metamedia
 *
 * @package Metamedia
 * @author Brady Vercher <brady@blazersix.com>
 * @copyright Copyright (c) 2013, Blazer Six, Inc.
 * @license GPL-2.0+
 */

/**
 * Register and localize media library.
 *
 * A preliminary attempt has been made to abstract the 'metamedia-control'
 * script in order to allow it to be re-used anywhere a similiar media selection
 * feature is needed.
 *
 * Custom image size labels should be added using the 'image_size_names_choose'
 * filter.
 *
 * @since 1.0.0
 */
function metamedia_init_admin() {
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	// Register styles.
	wp_register_style( 'metamedia', METAMEDIA_URI . 'assets/styles/metamedia.min.css' );

	// Register scripts.
	wp_register_script( 'metamedia', METAMEDIA_URI . 'assets/scripts/metamedia' . $suffix . '.js', array( 'media-upload', 'media-views' ) );
	wp_localize_script( 'metamedia', 'metamediaL10n', array(
		'frameTitle'      => __( 'Choose an Attachment', 'metamedia' ),
		'frameUpdateText' => __( 'Update Attachment', 'metamedia' ),
		'fullSizeLabel'   => __( 'Full Size', 'metamedia' ),
		'imageSizeNames'  => metamedia_image_size_names(),
	) );

	add_action( 'save_post', 'metamedia_save_post', 10, 2 );
	add_action( 'add_meta_boxes', 'metamedia_add_meta_boxes' );
}

/**
 * Enqueue scripts and styles needed for selecting media.
 *
 * @since 1.0.0
 */
function metamedia_enqueue_media() {
	global $post;

	$args = array();
	if ( ! empty( $post->ID ) ) {
		$args['post'] = $post->ID;
	}

	wp_enqueue_media( $args );
	wp_enqueue_script( 'metamedia' );
	wp_enqueue_style( 'metamedia' );
}

/**
 * Save post metadata.
 *
 * @since 1.0.0
 *
 * @param int $post_id Post ID.
 * @param WP_Post $post Post object.
 */
function metamedia_save_post( $post_id, $post ) {
	global $metamedia_meta_boxes;

	// Bail if the data shouldn't be saved.
	$is_autosave = defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE;
	$is_revision = wp_is_post_revision( $post_id );

	if( $is_autosave || $is_revision || ! is_array( $metamedia_meta_boxes ) ) {
		return;
	}

	foreach ( $metamedia_meta_boxes as $id => $box ) {
		if ( empty( $box['meta_box_post_type'] ) || ! isset( $_POST[ $box['meta_key'] ] ) ) {
			continue;
		}

		// Check if the meta box has been registered for this post type.
		$post_types = (array) $box['meta_box_post_type'];
		if ( ! in_array( $post->post_type, $post_types ) ) {
			continue;
		}

		// Continue if intention can't be verified.
		$is_valid_nonce = isset( $_POST['metamedia_control_nonce-' . $box['meta_key']] ) && wp_verify_nonce( $_POST['metamedia_control_nonce-' . $box['meta_key']], 'save-metamedia-control-' . $box['meta_key'] );
		if ( ! $is_valid_nonce ) {
			continue;
		}

		// Save the data.
		update_post_meta( $post_id, $box['meta_key'], $_POST[ $box['meta_key'] ] );
	}
}

/**
 * Add media meta boxes.
 *
 * @since 1.0.0
 *
 * @param WP_Post $post Post object.
 */
function metamedia_add_meta_boxes( $post ) {
	global $metamedia_meta_boxes;

	$current_post_type = get_current_screen()->post_type;

	if ( is_array( $metamedia_meta_boxes ) ) {
		foreach ( $metamedia_meta_boxes as $id => $box ) {
			if ( empty( $box['meta_box_post_type'] ) ) {
				continue;
			}

			foreach ( (array) $box['meta_box_post_type'] as $post_type ) {
				add_meta_box(
					$box['meta_box_id'],
					$box['meta_box_title'],
					$box['meta_box_callback'],
					$post_type,
					$box['meta_box_context'],
					$box['meta_box_priority'],
					$box
				);

				if ( $post_type == $current_post_type ) {
					metamedia_enqueue_media();
				}
			}
		}
	}
}

/**
 * Render a meta box to select a single attachment.
 *
 * @since 1.0.0
 *
 * @param WP_Post $post Post object.
 * @param array $meta_box Additional meta box data.
 */
function metamedia_select_attachment_meta_box( $post, $meta_box ) {
	$meta_box['args']['attachment_id'] = get_post_meta( $post->ID, $meta_box['args']['meta_key'], true );

	metamedia_control( (array) $meta_box['args'] );
}

/**
 * Render a meta box to select a gallery of images.
 *
 * @since 1.0.0
 *
 * @param WP_Post $post Post object.
 * @param array $meta_box Additional meta box data.
 */
function metamedia_select_gallery_meta_box( $post, $meta_box ) {
	$meta_box['args']['attachment_ids'] = get_post_meta( $post->ID, $meta_box['args']['meta_key'], true );

	metamedia_collection_control( (array) $meta_box['args'] );
}

/**
 * Localized image size labels.
 *
 * @since 1.0.0
 *
 * @return array
 */
function metamedia_image_size_names() {
	return apply_filters( 'image_size_names_choose', array(
		'thumbnail' => __( 'Thumbnail', 'metamedia' ),
		'medium'    => __( 'Medium', 'metamedia' ),
		'large'     => __( 'Large', 'metamedia' ),
		'full'      => __( 'Full Size', 'metamedia' )
	) );
}
