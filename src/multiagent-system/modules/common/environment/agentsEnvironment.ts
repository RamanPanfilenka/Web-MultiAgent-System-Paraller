import { Agent } from '@mas/modules/common/agent/agent';
import { Unit } from '@mas/modules/common/models/units/unit';
import Renderer from '@/ui/renderer';

export class AgentsEnvironment {
    public agents: Array<Agent>;
    private renderer: Renderer

    constructor(agents: Array<Agent>, renderer: Renderer) {
        this.agents = agents;
        this.renderer = renderer;
        renderer.init(this.agents, null);
    }

    async run(): Promise<void> {
        for (let i = 0; i < 100000; i++) {
            await this.ponderAgents();
            this.renderer.render(this.agents);
        }

    }

    private async ponderAgents(): Promise<PromiseSettledResult<void>[]> {
        const ponderPromises = this.agents.map(agent => {
            const nearestUnits = this.getNearestUnits(agent.unit);
            const ponderPromise = agent.runPondering(nearestUnits);
            return ponderPromise;
        });
        return Promise.allSettled(ponderPromises);
    }

    private getNearestUnits(targetUnit: Unit): Array<Unit> {
        const nearestUnits = this.agents
            .map(agent => agent.unit)
            .filter(unit => unit.isInRange(targetUnit) && unit.id != targetUnit.id);
        return nearestUnits;
    }
}
