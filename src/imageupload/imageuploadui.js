/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageupload/imageuploadui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// Added this our own:
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import { isImageType } from './utils';

/**
 * The image upload button plugin.
 *
 * For a detailed overview, check the {@glink features/image-upload/image-upload Image upload feature} documentation.
 *
 * Adds the `'imageUpload'` button to the {@link module:ui/componentfactory~ComponentFactory UI component factory}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageUploadUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Setup `imageUpload` button.
		editor.ui.componentFactory.add( 'imageUpload', locale => {
			// bulb change -- Changed from using the FileDialogButtonView Button type.
			const view = new ButtonView( locale );
			const command = editor.commands.get( 'imageUpload' );

			view.set( {
				acceptedType: 'image/*',
				allowMultipleFiles: true
			} );

			// This was changed from the native dialog box to the button ui on the editor toolbar:
			view.set({
				label: 'Insert Bulb Image',
				icon : imageIcon,
				tooltip: true
			});

			view.bind( 'isEnabled' ).to( command );

			// Callback executed once the button is clicked:
			view.on('execute', (event) => {
				console.log('we are in here?');
				let customEvent = new CustomEvent('bulbInsertImage',{
					detail : {
						event: event,
						eventFiredFromEditor : true
					}
				});

				// dispatch the event on the global window object so our AngularJs code may work?
				window.dispatchEvent(customEvent);


				window.addEventListener('bulbImageFile', (data) => {
					console.log('the bulb data:', data.detail.file);

					const bulbImageFile = data.detail.file;
					// CKEditor gracefully handles uploading multiple imgaes, we don't unfortunately. This code is not going
					// To change however since we will support it in the future.
					const imagesToUpload = Array.from( bulbImageFile ).filter( isImageType );

					if ( imagesToUpload.length ) {
						editor.execute( 'imageUpload', { file: imagesToUpload } );
					}

				});

			});

			return view;
		} );
	}
}
