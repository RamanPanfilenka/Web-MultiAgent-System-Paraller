import { Unit } from './unit';
import * as PIXI from 'pixi.js';

export class UnitTexture {
    private unit: Unit;
    private sprite: PIXI.Sprite;

    constructor(unit: Unit, spriteUrl: string) {
        this.unit = unit;
        this.sprite = PIXI.Sprite.from(spriteUrl);
    }

    getSprite(): PIXI.Sprite {
        this.sprite.width = this.unit.width;
        this.sprite.height = this.unit.height;
        this.sprite.position.set(this.unit.position.x, this.unit.position.y);
        return this.sprite;
    }
}
