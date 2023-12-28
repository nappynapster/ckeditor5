/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';
import { v4 as uuidv4 } from 'uuid';

export default class CrewConnectVideoUI extends Plugin {
	public uuid: string = uuidv4();

	public init(): void {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'crewConnectVideo', () => {
			const button = new ButtonView();

			button.label = 'Dateimanager';
			button.tooltip = true;
			button.withText = true;

			this.listenTo( button, 'execute', () => {
				const event = new CustomEvent( 'CrewConnectVideo.OpenVideoUploadUI', {
					detail: this.uuid
				} );

				window.dispatchEvent( event );

				window.addEventListener( 'CrewConnectVideo.insertVideo', this.insertVideoFn );
			} );

			return button;
		} );
	}

	private insertVideoFn = ( evt: any ): void => {
		if ( evt.detail.uuid === this.uuid )
		{
			const model = this.editor.model;

			model.change( writer => {
				const type = 'videoBlock';
				const attributes = {
					src: evt.detail.url
				};
				const videoElement = writer.createElement( type, attributes );

				model.insertContent( videoElement );
			} );

			window.removeEventListener( 'CrewConnectVideo.insertVideo', this.insertVideoFn );
		}
	};
}
