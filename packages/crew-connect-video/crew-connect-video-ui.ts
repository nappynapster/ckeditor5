/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

export default class CrewConnectVideoUI extends Plugin {
	public init(): void {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'crewConnectVideo', () => {
			const button = new ButtonView();

			button.label = 'Video Upload';
			button.tooltip = true;
			button.withText = true;

			this.listenTo( button, 'execute', () => {
				const model = this.editor.model;

				model.change( writer => {
					const type = 'videoBlock';
					const attributes = {
						src: 'https://crew-connect.s3.eu-central-1.amazonaws.com/video/file_example_MP4_1280_10MG.mp4'
					};
					const videoElement = writer.createElement( type, attributes );

					model.insertContent( videoElement );
				} );
			} );

			return button;
		} );
	}
}
