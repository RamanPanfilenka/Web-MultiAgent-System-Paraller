import * as PIXI from 'pixi.js';
import { Unit } from '@/multiagent-system/modules/common/models/units/unit';
import { AgentsEnvironment } from '@/multiagent-system/modules/common/environment/agentsEnvironment';
import { Agent } from '@/multiagent-system/modules/common/agent/agent';

export default class Renderer {
    app: PIXI.Application;
    unitSprites: Array<PIXI.Sprite> = [];

    constructor(canvans: any, width: number, height: number) {
        this.app = new PIXI.Application({
            view: canvans,
            width: width,
            height: height,
            backgroundColor: 0xffffff,
        });
    }

    init(agents: Array<Agent>, texture: any) {
        const ballTextureUrl = require('./asserts/ball.png').default;
        const unitContainer = new PIXI.Container();
        agents.forEach(agent => {
            const unitSprite = PIXI.Sprite.from(ballTextureUrl);
            unitSprite.position.set(agent.unit.position.x, agent.unit.position.y);
            unitSprite.width = 40;
            unitSprite.height = 40;
            unitContainer.addChild(unitSprite);
            this.unitSprites.push(unitSprite);
        });

        this.app.stage.addChild(unitContainer);
    }

    render(agents: Array<Agent>) {
        for (let i = 0; i < agents.length; i++) {
            const unit = agents[i].unit;
            this.unitSprites[i].position.set(unit.position.x - 40, unit.position.y - 40);
        }
    }
}
