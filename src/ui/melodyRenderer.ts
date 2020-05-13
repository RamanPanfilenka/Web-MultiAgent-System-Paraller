import * as PIXI from 'pixi.js';
import Renderer from './renderer';
import { Agent } from '@/multiagent-system/modules/common/agent/agent';
import { PianoKey } from '@/multiagent-system/modules/melody-player/models/primitives/pianoKey';
const pianoKeyUrl = require('./asserts/piano-key.png').default;

export default class MelodyRenderer extends Renderer {
    pianoKeys: Array<PianoKey>

    constructor(canvans: any, width: number, height: number,  pianoKeys: Array<PianoKey>) {
        super(canvans, width, height);
        this.pianoKeys = pianoKeys;
    }

    init(agents: Array<Agent>, unitTexture: any) {
        super.init(agents, unitTexture);
        const pianoKeysContainer = new PIXI.Container();
        const pianoKeyTexture = PIXI.Texture.from(pianoKeyUrl);
        this.pianoKeys.forEach((key: PianoKey) => {
            const pianoSprite = new PIXI.Sprite(pianoKeyTexture);
            pianoSprite.position.set(key.centerPoint.x, key.centerPoint.y);
            pianoSprite.scale.x = 0.6;
            pianoSprite.scale.y = 0.6;
            pianoKeysContainer.addChild(pianoSprite);

        });

        this.app.stage.addChild(pianoKeysContainer);
    }
}
