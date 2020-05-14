import * as PIXI from 'pixi.js';
import Renderer from './renderer';
import { Agent } from '@/multiagent-system/modules/common/agent/agent';
import { PianoKey } from '@/multiagent-system/modules/melody-player/models/primitives/pianoKey';

const pianoKeyUncheckedUrl = require('./asserts/piano-key.png').default;
const pianoKeyBlackUncheckedUrl = require('./asserts/piano-key-black.png').default;

export default class MelodyRenderer extends Renderer {
    whiteKeys: Array<PianoKey>;
    blackKeys: Array<PianoKey>;

    constructor(canvans: any, width: number, height: number, whiteKeys: Array<PianoKey>, blackKeys: Array<PianoKey>) {
        super(canvans, width, height);
        this.whiteKeys = whiteKeys;
        this.blackKeys = blackKeys;
    }

    init(agents: Array<Agent>, unitTexture: any) {
        const pianoKeysContainer = new PIXI.Container();
        this.app.stage.addChild(pianoKeysContainer);
        this.rederKeys(this.whiteKeys, pianoKeyUncheckedUrl, pianoKeysContainer);
        this.rederKeys(this.blackKeys, pianoKeyBlackUncheckedUrl, pianoKeysContainer);

        super.init(agents, unitTexture);
    }

    private rederKeys(pianoKeys: Array<PianoKey>, spriteUrl: string, pianoKeysContainer: PIXI.Container) {
        pianoKeys.forEach(key => {
            const pianoSprite = PIXI.Sprite.from(spriteUrl);
            pianoSprite.position.set(key.centerPoint.x, key.centerPoint.y);
            pianoSprite.width = key.width;
            pianoSprite.height = key.height;
            pianoKeysContainer.addChild(pianoSprite);
        });
    }
}
