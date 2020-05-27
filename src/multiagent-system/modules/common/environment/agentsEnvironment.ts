import { Agent } from '@mas/modules/common/agent/agent';
import { Unit } from '@mas/modules/common/models/units/unit';
import { Statistics } from '../models/primitives/statistics';
import { Renderer } from '@/ui/modules/common/renderers/renderer';

export class AgentsEnvironment {
    public agents: Array<Agent>;

    constructor(agents: Array<Agent>) {
        this.agents = agents;
    }

    async run(): Promise<Array<Agent>> {
        await this.ponderAgents();
        return this.agents;
    }

    terminate() {
        this.agents.forEach(agent => {
            agent.terminate();
        });
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

    getStatistics(): Array<Statistics> {
        return this.agents.map(agent => agent.unit.statistics);
    }
}
