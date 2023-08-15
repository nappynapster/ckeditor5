import { Plugin } from '@ckeditor/ckeditor5-core';
import CrewConnectVideoEditing from './crew-connect-video-editing';
import CrewConnectVideoUI from './crew-connect-video-ui';
export default class CrewConnectVideo extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires(): readonly [typeof CrewConnectVideoEditing, typeof CrewConnectVideoUI];
    /**
     * @inheritDoc
     */
    static get pluginName(): "CrewConnectVideo";
}
