import Agent from '@mas/agent';
import Unit from '@mas/modules/common/models/units/unit';

export default class AgentsEnvironment {
    agents: Agent[];
    processData: any;

    async run() {
        await this.ponderAgents();
    }

    async ponderAgents() {
        const ponderPromises = this.agents.map(agent => {
            const nearestUnits = this.getNearestUnits(agent.unit);
            const ponderPromise = agent.ponder(nearestUnits);

            return ponderPromise;
        });

        return Promise.allSettled(ponderPromises);
    }

    private getNearestUnits(targetUnit: Unit): Unit[] {
        const nearestUnits = this.agents
            .map(agent => agent.unit)
            .filter(unit => unit.isInRange(targetUnit));

        return nearestUnits;
    }
}