window.metamedia = window.metamedia || {};

(function( window, $, undefined ) {
	'use strict';

	var Attachment = wp.media.model.Attachment,
		$control, $controlTarget, media;

	media = metamedia.media = {};

	/**
	 * Wire up controls for selecting a single attachment.
	 */
	media.control = {
		init: function() {
			$('.metamedia-control').on('click', '.choose .js-trigger, .preview', function( e ) {
				var targetSelector;

				e.preventDefault();

				$control = $(this).closest('.metamedia-control');

				targetSelector = $control.data('target') || '.target';
				if ( 0 === targetSelector.indexOf('#') ) {
					// Context doesn't matter if the selector is an ID.
					$controlTarget = $( targetSelector );
				} else {
					// Search for other selectors within the context of the control.
					$controlTarget = $control.find( targetSelector );
				}

				media.control.frame().open();
			}).on('click', '.remove .js-trigger', function(e) {
				var targetSelector;

				e.preventDefault();

				$control = $(this).closest('.metamedia-control').removeClass('has-attachment');

				// Clear the attachment preview.
				$control.find('.preview').html('');

				// Clear the target value.
				targetSelector = $control.data('target') || '.target';
				if ( 0 === targetSelector.indexOf('#') ) {
					// Context doesn't matter if the selector is an ID.
					$( targetSelector ).val('');
				} else {
					// Search for other selectors within the context of the control.
					$control.find( targetSelector ).val('');
				}
			}).on('selectionChange.metamedia', function( e, selection ) {
				var $control = $( e.target ),
					model = selection.first(),
					sizes = model.get('sizes'),
					image, size;

				if ( sizes ) {
					// The image size to display in the widget.
					size = sizes['post-thumbnail'] || sizes.medium;
				}

				size = size || model.toJSON();

				image = $( '<img />', { src: size.url } );

				$control.addClass('has-attachment')
					.find('.preview').html( image );
			});
		},

		// Update the control when an image is selected from the media library.
		select: function() {
			var selection = this.get('selection'),
				returnProperty = $control.data('return-property') || 'id';

			// Insert the selected attachment id into the target element.
			if ( $controlTarget.length ) {
				$controlTarget.val( selection.first().get( returnProperty ) );
			}

			// Trigger an event on the control to allow custom updates.
			$control.trigger( 'selectionChange.metamedia', [ selection ] );

			selection.reset( [] );
		},

		// Update the selected image in the media library based on the image in the control.
		updateLibrarySelection: function() {
			var selection = this.get('library').get('selection'),
				attachment, selectedIds;

			if ( $controlTarget.length ) {
				selectedIds = $controlTarget.val();
				if ( selectedIds && '' !== selectedIds && -1 !== selectedIds && '0' !== selectedIds ) {
					attachment = Attachment.get( selectedIds );
					attachment.fetch();
				}
			}

			selection.reset( attachment ? [ attachment ] : [] );
		},

		// Initialize a new media manager or return an existing frame.
		// @see wp.media.featuredImage.frame()
		frame: function() {
			if ( this._frame )
				return this._frame;

			this._frame = wp.media({
				title: $control.data('title') || metamediaL10n.frameTitle,
				library: {
					type: $control.data('media-type') || 'image'
				},
				button: {
					text: $control.data('update-text') || metamediaL10n.frameUpdateText
				},
				multiple: $control.data( 'select-multiple' ) || false
			});

			this._frame.on( 'open', this.updateLibrarySelection ).state('library').on( 'select', this.select );

			return this._frame;
		}
	};

	/**
	 * Wire up controls for selecting a gallery of images.
	 */
	media.gallery = {
		init: function() {
			$('.metamedia-gallery .attachments').sortable({
				forcePlaceholderSize: true,
				forceHelperSize: false,
				update: function( e, ui ) {
					var ids = $.map( ui.item.parent().children(), function( el ) { return $(el).data('attachment-id'); } ).join(',');
					ui.item.closest('.metamedia-gallery').find('.target').val( ids );
				}
			});

			$('.metamedia-gallery').on('click', '.choose .js-trigger', function(e) {
				var targetSelector;

				e.preventDefault();

				$control = $(this).closest('.metamedia-gallery');

				targetSelector = $control.data('target') || '.target';
				if ( 0 === targetSelector.indexOf('#') ) {
					// Context doesn't matter if the selector is an ID.
					$controlTarget = $( targetSelector );
				} else {
					// Search for other selectors within the context of the control.
					$controlTarget = $control.find( targetSelector );
				}

				media.gallery.frame().open();
			});
		},

		refresh: function() {
			console.log( $controlTarget.val() );
		},

		update: function( selection ) {
			var images = [];

			if ( $controlTarget.length ) {
				$controlTarget.val( selection.pluck( 'id' ) );

				$.each( selection.models, function( i, model ) {
					var sizes = model.get('sizes'),
						image, size;

					console.log( model.toJSON() );

					if ( sizes ) {
						// The image size to display in the meta box.
						size = sizes.thumbnail || sizes.medium;
					}

					size = size || model.toJSON();

					images.push( $( '<img />', { src: size.url } ).data('attachment-id', model.get('id') ) );
				});

				$control.find('.attachments').html( images );
				this.refresh();
			}
		},

		// Initialize a new frame.
		// @see wp.media.gallery.edit()
		// @link https://gist.github.com/4192094
		frame: function() {
			var attachments, query, selection;

			attachments = $control.find('.target').val().split(',');
			query = wp.media.query({ post__in: attachments, orderby: 'post__in' });

			selection = new wp.media.model.Selection( query.models, {
				props: query.props.toJSON(),
				multiple: true
			});

			// Fetch the query's attachments, and then break ties from the query to allow for sorting.
			selection.more().done( function() {
				// Break ties with the query.
				selection.props.set({ query: false });
				selection.unmirror();
				selection.props.unset('orderby');
			});

			if ( this._frame )
				this._frame.dispose();

			this._frame = wp.media({
				frame: 'post',
				state: $control.find('.target').val() ? 'gallery-edit' : 'gallery-library',
				className: 'media-frame metamedia-frame--gallery',
				editing: true,
				multiple: true,
				selection: selection,
				sortable: true
			});

			this._frame.state('gallery-edit').on( 'update', this.update, this );

			return this._frame;
		}
	};

	/**
	 * Method for updating a dropdown allowing an image size to be selected.
	 */
	media.updateSizeDropdown = function( field, sizes ) {
		var currentValue = field.val(),
			label, options;

		if ( sizes ) {
			$.each( sizes, function( key, size ) {
				if ( key in metamediaL10n.imageSizeNames ) {
					label = metamediaL10n.imageSizeNames[ key ];
				}

				options += '<option value="' + key + '">' + label + ' (' + size.width + '&times;' + size.height + ')</option>';
			});
		}

		if ( ! options ) {
			label = metamediaL10n.imageSizeNames.full || metamediaL10n.fullSizeLabel;
			options = '<option value="full">' + label + '</option>';
		}

		// Try to maintain the previously selected size if it still exists.
		field.html( options ).val( currentValue ).removeAttr('disabled');
	};

	/**
	 * Initiliaze controls when the DOM is ready.
	 */
	jQuery(function($) {
		metamedia.media.control.init();
		metamedia.media.gallery.init();
	});
})( window, jQuery );