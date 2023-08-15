/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Plugin } from 'ckeditor5/src/core';
// eslint-disable-next-line no-duplicate-imports
import type { Editor } from 'ckeditor5/src/core';
import { first } from 'ckeditor5/src/utils';
import { toWidget } from 'ckeditor5/src/widget';
import type { DowncastDispatcher, DowncastWriter, MatcherPattern, UpcastDispatcher } from 'ckeditor5/src/engine';

export default class CrewConnectVideoEditing extends Plugin {
	public init(): void {
		const editor = this.editor;
		const schema = editor.model.schema;

		schema.register( 'videoBlock', {
			isObject: true,
			isBlock: true,
			allowWhere: '$block',
			allowAttributes: [ 'src' ]
		} );

		this._setupConversion();
	}

	private _setupConversion() {
		const editor = this.editor;
		const conversion = editor.conversion;

		conversion.for( 'dataDowncast' )
			.elementToElement( {
				model: 'videoBlock',
				view: ( modelElement, { writer } ) => this.createVideoViewElement( writer )
			} );

		conversion.for( 'editingDowncast' )
			.elementToElement( {
				model: 'videoBlock',
				view: ( modelElement, { writer } ) => this.toVideoWidget( this.createVideoViewElement( writer ), writer )
			} );

		conversion.for( 'downcast' )
			.add( this.downcastVideoAttribute( 'videoBlock', 'src' ) );

		conversion.for( 'upcast' )
			.elementToElement( {
				view: this.getVideoViewElementMatcher( editor, 'videoBlock' ),
				model: ( viewVideo, { writer } ) => writer.createElement( 'videoBlock', { src: viewVideo.getAttribute( 'src' ) } )
			} )
			.add( this.upcastVideoFigure() );
	}

	private createVideoViewElement( writer: DowncastWriter ) {
		const emptyElement = writer.createEmptyElement( 'video' );
		emptyElement._setAttribute( 'controls', '' );

		const container = writer.createContainerElement( 'figure', { class: 'video' } );
		writer.insert( writer.createPositionAt( container, 0 ), emptyElement );

		return container;
	}

	private downcastVideoAttribute( videoType: string, attributeKey: string ) {
		return ( dispatcher: DowncastDispatcher ) => {
			dispatcher.on( `attribute:${ attributeKey }:${ videoType }`, ( evt, data, conversionApi ) => {
				if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
					return;
				}

				const viewWriter = conversionApi.writer;
				const element = conversionApi.mapper.toViewElement( data.item );
				const video = this.findViewVideoElement( element );

				viewWriter.setAttribute( data.attributeKey, data.attributeNewValue || '', video );
			} );
		};
	}

	private getVideoViewElementMatcher( editor: Editor, matchVideoType: string ): MatcherPattern {
		if ( editor.plugins.has( 'VideoInlineEditing' ) !== editor.plugins.has( 'VideoBlockEditing' ) ) {
			return {
				name: 'video',
				attributes: {
					src: true
				}
			};
		}

		return element => {
			if ( !this.isInlineVideoView( element ) || !element.hasAttribute( 'src' ) ) {
				return null;
			}

			const videoType = element.findAncestor( this.isBlockVideoView ) ? 'videoBlock' : 'videoInline';

			if ( videoType !== matchVideoType ) {
				return null;
			}

			return { name: true, attributes: [ 'src' ] };
		};
	}

	private isBlockVideoView( element: any ) {
		return !!element && element.is( 'element', 'figure' ) && element.hasClass( 'video' );
	}

	private upcastVideoFigure() {
		return ( dispatcher: UpcastDispatcher ) => {
			dispatcher.on( 'element:figure', ( evt, data, conversionApi ) => {
				if ( !conversionApi.consumable.test( data.viewItem, { name: true, classes: 'video' } ) ) {
					return;
				}

				const viewVideo = this.findViewVideoElement( data.viewItem );

				if ( !viewVideo || !viewVideo.hasAttribute( 'src' ) || !conversionApi.consumable.test( viewVideo, { name: true } ) ) {
					return;
				}

				const conversionResult = conversionApi.convertItem( viewVideo, data.modelCursor );

				const modelVideo = first( conversionResult.modelRange.getItems() );

				if ( !modelVideo ) {
					return;
				}

				conversionApi.convertChildren( data.viewItem, modelVideo );

				conversionApi.updateConversionResult( modelVideo, data );
			} );
		};
	}

	private toVideoWidget( viewElement: any, writer: DowncastWriter ) {
		writer.setCustomProperty( 'video', true, viewElement );

		return toWidget( viewElement, writer );
	}

	private findViewVideoElement( figureView: any ) {
		if ( this.isInlineVideoView( figureView ) ) {
			return figureView;
		}

		const editingView = this.editor.editing.view;

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		for ( const { item } of editingView.createRangeIn( figureView ) ) {
			if ( this.isInlineVideoView( item ) ) {
				return item;
			}
		}
	}

	private isInlineVideoView( element: any ) {
		return !!element && element.is( 'element', 'video' );
	}
}

