import * as PIXI from 'pixi.js';
import { Renderer, RendererOps } from './renderer';
import { Agent } from '@/multiagent-system/modules/common/agent/agent';
import { PianoKey } from '@/multiagent-system/modules/melody-player/models/primitives/pianoKey';
import { MelodyBall } from '@/multiagent-system/modules/melody-player/models/units/melodyBall';
import { Point } from '@/multiagent-system/modules/common/models/primitives/point';
import { PianoPlayer } from './pianoPlayer';


export interface MelodyRendererOps extends RendererOps{
    whiteKeys: Array<PianoKey>;
    blackKeys: Array<PianoKey>;
    pianoPlayer: PianoPlayer;
}

const pianoKeyUncheckedUrl = require('./asserts/piano-key.png').default;
const pianoKeyBlackUncheckedUrl = require('./asserts/piano-key-black.png').default;
const pianoKeyCheckedUrl = require('./asserts/piano-key-checked.png').default;
const pianoKeyBlackCheckedUrl = require('./asserts/pinao-key-black-checked.png').default;

export class MelodyRenderer extends Renderer {
    whiteKeys: Array<PianoKey>;
    blackKeys: Array<PianoKey>;
    checkedBlackKeysContainer: PIXI.Container = new PIXI.Container();
    checkedWhiteKeysContainer:  PIXI.Container = new PIXI.Container();
    unchekedWhiteKeysContainer:  PIXI.Container = new PIXI.Container();
    unchekedBlackKeysContainer:  PIXI.Container = new PIXI.Container();
    playedNotes: Array<number> = [];
    pianoPlayer: PianoPlayer;

    constructor(options: MelodyRendererOps) {
        super(options);
        this.whiteKeys = options.whiteKeys;
        this.blackKeys = options.blackKeys;
        this.pianoPlayer = options.pianoPlayer;
        this.app.stage.addChild(this.unchekedWhiteKeysContainer);
        this.app.stage.addChild(this.checkedWhiteKeysContainer);
        this.app.stage.addChild(this.unchekedBlackKeysContainer);
        this.app.stage.addChild(this.checkedBlackKeysContainer);
    }

    init(agents: Array<Agent>) {
        this.rederKeys(this.whiteKeys, pianoKeyUncheckedUrl, pianoKeyCheckedUrl, this.unchekedWhiteKeysContainer, this.checkedWhiteKeysContainer, false);
        this.rederKeys(this.blackKeys, pianoKeyBlackUncheckedUrl, pianoKeyBlackCheckedUrl, this.unchekedBlackKeysContainer, this.checkedBlackKeysContainer, false);

        super.init(agents);
    }

    private rederKeys(pianoKeys: Array<PianoKey>, spriteUrl: string, checkedUrl: string, pianoKeysContainer: PIXI.Container, checkedPianoKeyContainer: PIXI.Container, visible: boolean) {
        pianoKeys.forEach(key => {
            const uncheckedKeySprite = PIXI.Sprite.from(spriteUrl);
            const checkedKeySprite = PIXI.Sprite.from(checkedUrl);
            pianoKeysContainer.addChild(uncheckedKeySprite);
            checkedPianoKeyContainer.addChild(checkedKeySprite);
            this.setSpritesSettings(key, uncheckedKeySprite, checkedKeySprite);
        });
    }

    private setSpritesSettings(key: PianoKey, uncheckedKeySprite: PIXI.Sprite, checkedKeySprite: PIXI.Sprite) {
        this.setSpriteSettings(checkedKeySprite, key.tone, key.width, key.height, key.centerPoint, false);
        this.setSpriteSettings(uncheckedKeySprite, key.tone, key.width, key.height, key.centerPoint, true);
    }

    private setSpriteSettings(sprite: PIXI.Sprite, name: string, width: number, height: number, position: Point, visible: boolean) {
        sprite.visible = visible;
        sprite.position.set(position.x - width / 2, position.y - height / 2);
        sprite.width = width;
        sprite.height = height;
        sprite.name = name;
    }

    render(agents: Array<Agent>) {
        for (let i = 0; i < agents.length; i++) {
            const unit = <MelodyBall>agents[i].unit;
            this.unitSprites[i].position.set(unit.position.x - 2 * unit.radius, unit.position.y - 2 * unit.radius);
            const pianoKey = unit.targetKey;
            if (pianoKey.isPressed && !this.playedNotes.includes(unit.targetNote.orderNumber)) {
                console.log(unit.targetNote.orderNumber);
                this.renderPressedSprite(pianoKey.tone, unit.targetNote.duration);
                unit.targetKey.isPressed = false;
                this.playedNotes.push(unit.targetNote.orderNumber);
            }
        }
    }

    private renderPressedSprite(tone: string, noteDuration: number) {
        const isBlackKey = tone.includes('#');
        const checkedKeySprite = isBlackKey
            ? this.checkedBlackKeysContainer.getChildByName(tone)
            : this.checkedWhiteKeysContainer.getChildByName(tone);
        checkedKeySprite.visible = true;
        this.pianoPlayer.play(tone, noteDuration);

        setInterval(() =>{
            checkedKeySprite.visible = false;
        },
        noteDuration * 2000);
    }
}
