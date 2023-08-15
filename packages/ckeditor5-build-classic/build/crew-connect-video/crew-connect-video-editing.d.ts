import { Editor, Plugin } from '@ckeditor/ckeditor5-core';
import { DowncastDispatcher, DowncastWriter, MatcherPattern, UpcastDispatcher } from '@ckeditor/ckeditor5-engine';
import ContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement';
export default class CrewConnectVideoEditing extends Plugin {
    init(): void;
    _setupConversion(): void;
    createVideoViewElement(writer: DowncastWriter): ContainerElement;
    downcastVideoAttribute(videoType: string, attributeKey: string): (dispatcher: DowncastDispatcher) => void;
    getVideoViewElementMatcher(editor: Editor, matchVideoType: string): MatcherPattern;
    isBlockVideoView(element: any): any;
    upcastVideoFigure(): (dispatcher: UpcastDispatcher) => void;
    toVideoWidget(viewElement: ContainerElement, writer: DowncastWriter): import("@ckeditor/ckeditor5-engine").ViewElement;
    findViewVideoElement(figureView: any): any;
    isInlineVideoView(element: any): any;
}
