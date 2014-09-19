<?php
/**
 * Metamedia
 *
 * @package Metamedia
 * @copyright Copyright (c) 2014, Cedaro
 * @license GPL-2.0+
 */

/**
 * Load the library text domain.
 *
 * @since 1.0.0
 */
function metamedia_load_textdomain() {
	load_plugin_textdomain( 'metamedia', false, dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages' );
}

/**
 * Render a control to select a single attachment.
 *
 * @since 1.0.0
 *
 * @param array $args Optional. Arguments to modify behavior and display of the selection control.
 */
function metamedia_control( $args = array() ) {
	$args = wp_parse_args( $args, array(
		'attachment_id' => '',
		'choose_class'  => array(),
		'choose_label'  => __( 'Choose file', 'metamedia' ),
		'class'         => array(),
		'field_id'      => '',
		'frame_title'   => __( 'Choose a File', 'metamedia' ),
		'frame_button'  => __( 'Update', 'metamedia' ),
		'media_type'    => 'image',
		'meta_key'      => '',
		'remove_label'  => __( 'Remove file', 'metamedia' ),
		'target'        => '.target',
	) );

	$args = apply_filters( 'metamedia_control_args', $args );

	if ( empty( $args['meta_key'] ) ) {
		return;
	}

	$args['field_id'] = ( empty( $args['field_id'] ) ) ? $args['meta_key'] : $args['field_id'];

	if ( ! empty( $args['class'] ) && ! is_array( $args['class'] ) ) {
		$args['class'] = preg_split( '#\s+#', $args['class'] );
	}

	if ( ! empty( $args['button_class'] ) && ! is_array( $args['button_class'] ) ) {
		$args['button_class'] = preg_split( '#\s+#', $args['button_class'] );
	}

	$classes = array_merge( array( 'metamedia-control' ), $args['class'] );
	$choose_classes = array_merge( array( 'button', 'js-trigger' ), $args['choose_class'] );

	if ( ! empty( $args['attachment_id'] ) ) {
		$classes[] = 'has-attachment';
	}

	wp_nonce_field( 'save-metamedia-control-' . $args['meta_key'], 'metamedia_control_nonce-' . $args['meta_key'] );
	?>
	<div class="<?php echo implode( ' ', array_map( 'sanitize_html_class', $classes ) ); ?>"
		data-media-type="<?php echo esc_attr( $args['media_type'] ); ?>"
		data-multiple="false"
		data-target="<?php echo esc_attr( $args['target'] ); ?>"
		data-title="<?php echo esc_attr( $args['frame_title'] ); ?>"
		data-update-text="<?php echo esc_attr( $args['frame_button'] ); ?>">

		<p class="preview">
			<?php
			if ( $args['attachment_id'] ) {
				echo wp_get_attachment_image( $args['attachment_id'], 'medium', false );
			}
			?>
		</p>
		<p class="choose">
			<a href="#" class="<?php echo implode( ' ', array_map( 'sanitize_html_class', $choose_classes ) ); ?>"><?php echo $args['choose_label']; ?></a>
		</p>
		<p class="remove">
			<a href="#" class="js-trigger"><?php echo $args['remove_label']; ?></a>
		</p>

		<input type="hidden" name="<?php echo esc_attr( $args['meta_key'] ); ?>" id="<?php echo esc_attr( $args['field_id'] ); ?>" value="<?php echo esc_attr( $args['attachment_id'] ); ?>" class="target">
	</div>
	<?php
}

/**
 * Render a control to select a gallery of images.
 *
 * @since 1.0.0
 *
 * @param array $args Optional. Arguments to modify behavior and display of the selection control.
 */
function metamedia_collection_control( $args = array() ) {
	$args = wp_parse_args( $args, array(
		'attachment_ids' => '',
		'choose_class'   => array(),
		'choose_label'   => __( 'Update Gallery', 'metamedia' ),
		'class'          => array(),
		'field_id'       => '',
		'frame_title'    => __( 'Choose Files', 'metamedia' ),
		'frame_button'   => __( 'Update', 'metamedia' ),
		'media_type'     => 'image',
		'meta_key'       => '',
		'remove_label'   => __( 'Remove File', 'metamedia' ),
		'target'         => '.target',
	) );

	$args = apply_filters( 'metamedia_gallery_args', $args );

	if ( empty( $args['meta_key'] ) ) {
		return;
	}

	$args['field_id'] = ( empty( $args['field_id'] ) ) ? $args['meta_key'] : $args['field_id'];

	wp_nonce_field( 'save-metamedia-control-' . $args['meta_key'], 'metamedia_control_nonce-' . $args['meta_key'] );
	?>
	<div class="metamedia-gallery" data-target=".target">
		<ul class="attachments">
			<?php
			if ( ! empty( $args['attachment_ids'] ) ) {
				$ids = explode( ',', $args['attachment_ids'] );
				foreach ( $ids as $id ) {
					echo '<li>';
						echo wp_get_attachment_image( $id, 'thumbnail', true, array( 'data-attachment-id' => $id ) );
						echo '<a class="remove">&times;</a>';
					echo '</li>';
				}
			}
			?>
		</ul>

		<p class="choose">
			<a href="#" class="button js-trigger"><?php echo $args['choose_label']; ?></a>
		</p>

		<input type="hidden" name="<?php echo esc_attr( $args['meta_key'] ); ?>" id="<?php echo esc_attr( $args['field_id'] ); ?>" value="<?php echo esc_attr( $args['attachment_ids'] ); ?>" class="target">
	</div>
	<?php
}

/**
 * Register a meta box to select a single attachment.
 *
 * @since 1.0.0
 *
 * @param string $meta_key Post meta key to save attachment ID under.
 * @param string|array $post_type Post types to display the meta box on.
 * @param array $args Arguments to modify behavior and labels for the meta box and control.
 */
function register_metamedia_meta_box( $meta_key, $post_type, $args = array() ) {
	global $metamedia_meta_boxes;

	$id = sanitize_key( $meta_key );
	if ( 0 === strpos( $meta_key, '_' ) ) {
		$id = substr( $id, 1 );
	}

	$args = wp_parse_args( $args, array(
		'meta_key'           => $meta_key,
		'meta_box_id'        => $id . '-div',
		'meta_box_title'     => 'Select Media',
		'meta_box_callback'  => 'metamedia_select_attachment_meta_box',
		'meta_box_post_type' => $post_type,
		'meta_box_context'   => 'advanced',
		'meta_box_priority'  => 'default',
	) );

	$metamedia_meta_boxes[ $meta_key ] = $args;
}

/**
 * Register a meta box to select a gallery of images.
 *
 * @since 1.0.0
 *
 * @param string $meta_key Post meta key to save attachment ID under.
 * @param string|array $post_type Post types to display the meta box on.
 * @param array $args Arguments to modify behavior and labels for the meta box and control.
 */
function register_metamedia_gallery_meta_box( $meta_key, $post_type, $args = array() ) {
	global $metamedia_meta_boxes;

	$id = sanitize_key( $meta_key );
	if ( 0 === strpos( $meta_key, '_' ) ) {
		$id = substr( $id, 1 );
	}

	$args = wp_parse_args( $args, array(
		'meta_key'           => $meta_key,
		'meta_box_id'        => $id . '-div',
		'meta_box_title'     => 'Gallery',
		'meta_box_callback'  => 'metamedia_select_gallery_meta_box',
		'meta_box_post_type' => $post_type,
		'meta_box_context'   => 'advanced',
		'meta_box_priority'  => 'default',
	) );

	$metamedia_meta_boxes[ $meta_key ] = $args;
}
