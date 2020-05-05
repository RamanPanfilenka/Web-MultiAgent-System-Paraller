import { Agent } from '@mas/modules/common/agent/agent';
import { Unit } from '@mas/modules/common/models/units/unit';

export class AgentsEnvironment {
    private agents: Array<Agent>;

    constructor(agents: Array<Agent>) {
        this.agents = agents;
    }

    async run(): Promise<void> {
        await this.ponderAgents();
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
            .filter(unit => unit.isInRange(targetUnit));
        return nearestUnits;
    }
}
