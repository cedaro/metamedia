/*global _:false, metamediaL10n:false, wp:false */

window.metamedia = window.metamedia || {};

(function( window, $, undefined ) {
	'use strict';

	var Attachment = wp.media.model.Attachment,
		$control, $controlTarget, media;

	media = window.metamedia.media = {};

	/**
	 * Wire up controls for selecting a single attachment.
	 */
	media.control = {
		init : function() {
			$( '.metamedia-control' ).on( 'click', '.choose .js-trigger, .preview', function( e ) {
				e.preventDefault();

				$control = $( this ).closest( '.metamedia-control' );
				$controlTarget = media.control.findTarget( $control );

				media.control.frame().open();
			}).on( 'click', '.remove .js-trigger', function( e ) {
				e.preventDefault();

				$control = $( this ).closest( '.metamedia-control' ).removeClass( 'has-attachment' );

				// Clear the target value.
				media.control.findTarget( $control ).val( '' );

				// Clear the attachment preview.
				$control.find( '.preview' ).html( '' );
			}).on( 'selectionChange.metamedia', function( e, selection ) {
				var $control = $( e.target ),
					model = selection.first(),
					sizes = model.get( 'sizes' ),
					image, size;

				if ( sizes ) {
					// The image size to display in the widget.
					size = sizes['post-thumbnail'] || sizes.medium;
				}

				size = size || model.toJSON();

				image = $( '<img />', { src : size.url } );

				$control.addClass( 'has-attachment' )
					.find('.preview' ).html( image );
			});
		},

		findTarget : function( $control ) {
			var selector = $control.data( 'target' ) || '.target',
				$target;

			if ( 0 === selector.indexOf( '#' ) ) {
				// Context doesn't matter if the selector is an ID.
				$target = $( selector );
			} else {
				// Search for other selectors within the context of the control.
				$target = $control.find( selector );
			}

			return $target;
		},

		// Update the control when an image is selected from the media library.
		select : function() {
			var selection = this.get( 'selection' ),
				returnProperty = $control.data( 'return-property' ) || 'id';

			// Insert the selected attachment id into the target element.
			if ( $controlTarget.length ) {
				$controlTarget.val( selection.first().get( returnProperty ) ).trigger( 'change' );
			}

			// Trigger an event on the control to allow custom updates.
			$control.trigger( 'selectionChange.metamedia', [ selection ] );

			selection.reset( [] );
		},

		// Update the selected image in the media library based on the image in the control.
		updateLibrarySelection : function() {
			var selection = this.get( 'library' ).get( 'selection' ),
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
		frame : function() {
			if ( this._frame ) {
				return this._frame;
			}

			this._frame = wp.media({
				title : $control.data( 'title' ) || metamediaL10n.frameTitle,
				library : {
					type: $control.data( 'media-type' ) || 'image'
				},
				button : {
					text: $control.data( 'update-text' ) || metamediaL10n.frameUpdateText
				},
				multiple : $control.data( 'select-multiple' ) || false
			});

			this._frame.on( 'open', this.updateLibrarySelection ).state( 'library' ).on( 'select', this.select );

			return this._frame;
		}
	};

	/**
	 * Wire up controls for selecting a gallery of images.
	 */
	media.gallery = {
		init : function() {
			$( '.metamedia-gallery .attachments' ).sortable({
				forcePlaceholderSize : true,
				forceHelperSize : true,
				start : function( e, ui ) {
					ui.placeholder.css( 'visibility', 'visible' );
				},
				update : function( e, ui ) {
					var $control = ui.item.closest( '.metamedia-gallery' ),
						$target = media.control.findTarget( $control ),
						ids;

					ids = _.map( ui.item.parent().find( '[data-attachment-id]' ), function( el ) {
						return $( el ).data( 'attachment-id' );
					}).join( ',' );

					$target.val( ids );
				}
			});

			$( '.metamedia-gallery' ).on( 'click', '.choose .js-trigger', function( e ) {
				e.preventDefault();

				$control = $( this ).closest( '.metamedia-gallery' );
				$controlTarget = media.control.findTarget( $control );

				media.gallery.frame().open();
			}).on( 'click', '.remove', function() {
				var $this = $( this ),
					$control = $this.closest( '.metamedia-gallery' ),
					$target = media.control.findTarget( $control );

				$this.closest( 'li' ).remove();

				$target.val( media.gallery.getAttachmentIds( $control ).join( ',' ) );
			});
		},

		getAttachmentIds : function( $control ) {
			return _.map( $control.find( '[data-attachment-id]' ), function( el ) {
					return $( el ).data( 'attachment-id' );
				});
		},

		update : function( selection ) {
			var items = [];

			if ( $controlTarget.length ) {
				$controlTarget.val( selection.pluck( 'id' ) ).trigger( 'change' );

				_.each( selection.models, function( model ) {
					var sizes = model.get( 'sizes' ),
						size;

					if ( sizes ) {
						// The image size to display in the meta box.
						size = sizes.thumbnail || sizes.medium;
					}

					size = size || model.toJSON();

					items.push( $( '<li />', {
						html : [
							$( '<img />', { src : size.url, 'data-attachment-id' : model.get( 'id' ) } ),
							'<a class="remove">&times;</a>'
						]
					} ) );
				});

				$control.find( '.attachments' ).html( items ).sortable( 'refresh' );
			}
		},

		// Initialize a new frame.
		// @see wp.media.gallery.edit()
		// @link https://gist.github.com/4192094
		frame : function() {
			var attachments, query, selection;

			attachments = $control.find( '.target' ).val().split( ',' );
			query = wp.media.query({ post__in : attachments, orderby: 'post__in' });

			selection = new wp.media.model.Selection( query.models, {
				props: query.props.toJSON(),
				multiple: true
			});

			// Fetch the query's attachments, and then break ties from the query to allow for sorting.
			selection.more().done(function() {
				// Break ties with the query.
				selection.props.set({ query: false });
				selection.unmirror();
				selection.props.unset( 'orderby' );
			});

			if ( this._frame ) {
				this._frame.dispose();
			}

			this._frame = wp.media({
				frame : 'post',
				state : $control.find( '.target' ).val() ? 'gallery-edit' : 'gallery-library',
				className : 'media-frame metamedia-frame--gallery',
				editing : true,
				multiple : true,
				selection : selection,
				sortable : true
			});

			this._frame.state( 'gallery-edit' ).on( 'update', this.update, this );

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
			_.each( sizes, function( size, key ) {
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
		field.html( options ).val( currentValue ).removeAttr( 'disabled' );
	};

	/**
	 * Initialize controls when the DOM is ready.
	 */
	jQuery(function() {
		media.control.init();
		media.gallery.init();
	});

})( this, jQuery );
