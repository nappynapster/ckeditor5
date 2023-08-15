/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Plugin } from 'ckeditor5/src/core';
import CrewConnectVideoEditing from './crew-connect-video-editing';
import CrewConnectVideoUI from './crew-connect-video-ui';

export default class CrewConnectVideo extends Plugin {
	/**
   * @inheritDoc
   */
	public static get requires() {
		return [ CrewConnectVideoEditing, CrewConnectVideoUI ] as const;
	}

	/**
   * @inheritDoc
   */
	public static get pluginName() {
		return 'CrewConnectVideo' as const;
	}
}
