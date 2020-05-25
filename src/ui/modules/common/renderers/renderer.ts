import * as PIXI from 'pixi.js';
import { Agent } from '@/multiagent-system/modules/common/agent/agent';

export interface RendererOps{
    canvans: any;
    width: number;
    height: number;
    backgroundColor: number;
}

export class Renderer {
    protected app: PIXI.Application;
    protected unitSprites: Array<PIXI.Sprite> = [];

    constructor(options: RendererOps) {
        this.app = new PIXI.Application({
            view: options.canvans,
            width: options.width,
            height: options.height,
            backgroundColor: options.backgroundColor,
        });
    }

    protected init(agents: Array<Agent>) {
        const unitContainer = new PIXI.Container();
        agents.forEach(agent => {
            const unit = agent.unit;
            const unitSprite = PIXI.Sprite.from(unit.textureUrl);
            unitSprite.width = unit.width;
            unitSprite.height = unit.height;
            unitContainer.addChild(unitSprite);
            this.unitSprites.push(unitSprite);
        });

        this.app.stage.addChild(unitContainer);
    }

    render(agents: Array<Agent>) {
        if (this.unitSprites.length == 0) {
            this.init(agents);
            return;
        }
        for (let i = 0; i < agents.length; i++) {
            const unit = agents[i].unit;
            this.unitSprites[i].position.set(unit.position.x - unit.width / 2, unit.position.y - unit.height / 2);
        }
    }
}
