import * as PIXI from 'pixi.js';
import { Agent } from '@/multiagent-system/modules/common/agent/agent';
import { UnitTexture } from '@/multiagent-system/modules/common/models/units/unitTexture';

export default class Renderer {
    app: PIXI.Application;
    unitSprites: Array<PIXI.Sprite> = [];

    constructor(canvans: any, width: number, height: number, backgroundColor: number) {
        this.app = new PIXI.Application({
            view: canvans,
            width: width,
            height: height,
            backgroundColor: backgroundColor,
        });
    }

    init(unitTextures: Array<UnitTexture>) {
        const unitContainer = new PIXI.Container();
        unitTextures.forEach(unitTexture => {
            const unitSprite = unitTexture.getSprite();
            unitContainer.addChild(unitSprite);
            this.unitSprites.push(unitSprite);
        });

        this.app.stage.addChild(unitContainer);
    }

    render(agents: Array<Agent>) {
        for (let i = 0; i < agents.length; i++) {
            const unit = agents[i].unit;
            this.unitSprites[i].position.set(unit.position.x - unit.width / 2, unit.position.y - unit.height / 2);
        }
    }
}
