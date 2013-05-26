# Metamedia #

A WordPress plugin to register media selection meta boxes.

__Contributors:__ [Brady Vercher](https://github.com/bradyvercher)  
__Requires:__ 3.5  
__Tested up to:__ 3.5.1  
__License:__ [GPL-2.0+](http://www.gnu.org/licenses/gpl-2.0.html)

With the release of WordPress 3.5, an effort was made to decouple attachments from the posts where they were uploaded, which was a shift from previous versions, and a greater emphasis was placed on the `[gallery]` shortcode. Backward compatibility was maintained, but it became a little less intuitive to manage a gallery of images that were simply attached to a post. In any case it has always been a little difficult to select multiple featured images, or multiple galleries, for use in different areas in a template.

Metamedia allows for registering simple meta boxes like the "Featured Image" meta box for selecting a single image or gallery of images to be stored in a post meta field for easy retrieval and usage in templates. It can be used with any post type and uses the native media frame.

## Usage ##

To add a meta box similar to the "Featured Post" meta box, simply register it using `register_metamedia_metabox()` like this:

```php
function themename_register_mediameta() {
	if ( ! is_admin() || ! function_exists( 'register_metamedia_meta_box' ) ) {
		return;
	}

	// Register a meta box for assigning a 'hero' image to posts.
	register_metamedia_meta_box( 'hero', 'post' );
}
add_action( 'init', 'themename_register_mediameta' );
```

Now in a template, the image ID can be retrieved using `get_post_meta( $post_id, 'hero', true )`.

### Methods

The parameters for both methods are the same. Most labels and properties of registered meta boxes and the media modal can be customized using the optional `$args` parameter.

__`register_metamedia_meta_box( $meta_key, $post_type, $args = array() )`__

__`register_metamedia_gallery_meta_box( $meta_key, $post_type, $args = array() )`__

<table><caption><h3>Arguments</h3></caption>
  <thead>
    <tr>
      <th>Key</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong><code>meta_box_title</code></strong></td>
      <td>The title of the meta box.</td>
	  <td><em><code>Hero Image</code></td>
    </tr>
    <tr>
      <td><strong><code>meta_box_context</code></strong></td>
      <td>Where the meta box should appear.</td>
      <td><em><code>side</code></em></td>
    </tr>
	<tr>
		<td><strong><code>choose_label</code></strong></td>
		<td>Label of the button used to open the media frame.</td>
		<td><em><code>Select Image</code></td>
	</tr>
	<tr>
	  <td><strong><code>remove_label</code></strong></td>
	  <td>Label of the link used to remove a selected image.</td>
	  <td><em><code>Remove image</code></em></td>
	</tr>
    <tr>
      <td><strong><code>frame_title</code></strong></td>
      <td>The title of the media frame.</td>
	  <td><em><code>2-10</code></em></td>
    </tr>
	<tr>
	  <td><strong><code>frame_button</code></strong></td>
	  <td>The label of the button used to select an image in the media frame.</td>
	  <td><em><code>Update Image</code></em></td>
	</tr>
  </tbody>
</table>

*Some arguments may not work with the gallery meta box. Additional arguments are available for more advanced usage.*

## Installation ##

### Upload ###

1. Download the latest tagged archive (choose the "zip" option).
2. Go to the __Plugins &rarr; Add New__ screen, then click the __Upload__ link just under the screen heading.
3. Upload the zipped archive.
4. If the plugin installed successfully, you will see a link that says __Activate Plugin__ — click it to activate.

### Manual ###

1. Download the latest tagged archive (choose the "zip" option).
2. Unzip the archive.
3. Copy the folder to your `/wp-content/plugins/` directory.
4. Go to the __Plugins__ screen and click the __Activate__ link.

*Check out the Codex for more information on [installing plugins manually](http://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation).*

### Git ###

Change your working directory to `/wp-content/plugins/` and clone this repository:

`git clone git://github.com/blazersix/metamedia.git`

Then go to your __Plugins__ screen and click the __Activate__ link.


## Credits ##

Built by [Brady Vercher](https://twitter.com/bradyvercher)
