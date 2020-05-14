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
            unitSprite.scale.x = 0.2;
            unitSprite.scale.y = 0.2;
            unitContainer.addChild(unitSprite);
            this.unitSprites.push(unitSprite);
        });

        this.app.stage.addChild(unitContainer);
    }

    render(agents: Array<Agent>) {
        for (let i = 0; i < agents.length; i++) {
            this.unitSprites[i].position.set(agents[i].unit.position.x, agents[i].unit.position.y);
        }
    }
}
