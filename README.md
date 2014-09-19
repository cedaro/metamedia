# Metamedia #

A WordPress plugin to register media selection meta boxes.

__Contributors:__ [Brady Vercher](https://github.com/bradyvercher)  
__Requires:__ 3.5  
__Tested up to:__ 3.5.1  
__License:__ [GPL-2.0+](http://www.gnu.org/licenses/gpl-2.0.html)

With the release of WordPress 3.5, an effort was made to decouple attachments from the posts where they were uploaded, which was a shift from previous versions, and a greater emphasis was placed on the `[gallery]` shortcode. Backward compatibility was maintained, but it became a little less intuitive to manage a gallery of images that were simply attached to a post. In any case it has always been a little difficult to select multiple featured images, or multiple galleries, for use in different areas in a template.

Metamedia allows for registering simple meta boxes like the "Featured Image" meta box for selecting a single image or gallery of images to be stored in a post meta field for easy retrieval and usage in templates. It can be used with any post type and uses the native media frame.

![Gallery Meta Box](https://raw.github.com/blazersix/metamedia/master/screenshot-1.png)  
_An example gallery meta box. The images can be sorted directly in the meta box._

![Featured Image Meta Box](https://raw.github.com/blazersix/metamedia/master/screenshot-2.png)  
_An example meta box with custom labels for selecting a single image._

## Usage ##

To add a meta box similar to the "Featured Post" meta box, simply register it using `register_metamedia_metabox()` like this:

```php
function themename_register_metamedia() {
	if ( ! is_admin() || ! function_exists( 'register_metamedia_meta_box' ) ) {
		return;
	}

	// Register a meta box for assigning a 'hero' image to posts.
	register_metamedia_meta_box( 'hero', 'post' );
}
add_action( 'init', 'themename_register_metamedia' );
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

Metamedia is available in the [WordPress plugin repository](https://wordpress.org/plugins/metamedia/), so it can be installed from within your admin panel like any other plugin. You may also download it directly from GitHub using one of the following methods:

### Upload ###

1. Download the [latest release](https://github.com/blazersix/metamedia/archive/master.zip) from GitHub.
2. Go to the __Plugins &rarr; Add New__ screen in your WordPress admin panel and click the __Upload__ tab at the top.
3. Upload the zipped archive.
4. Click the __Activate Plugin__ link after installation completes.

### Manual ###

1. Download the [latest release](https://github.com/blazersix/metamedia/archive/master.zip) from GitHub.
2. Unzip the archive.
3. Copy the folder to `/wp-content/plugins/`.
4. Go to the __Plugins__ screen in your WordPress admin panel and click the __Activate__ link under Metamedia.

Read the Codex for more information about [installing plugins manually](http://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation).

### Git ###

Clone this repository in `/wp-content/plugins/`:

`git clone git@github.com:blazersix/metamedia.git`

Then go to the __Plugins__ screen in your WordPress admin panel and click the __Activate__ link under Metamedia.

