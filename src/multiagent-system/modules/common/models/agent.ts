import Process from './process';
import Unit from './units/unit';
import PonderingData from './ponderingData';

export default class Agent {
    unit: Unit;
    process: Process;

    constructor(unit: Unit) {
        this.unit = unit;
    }

    async runPondering(nearestUnits: Array<Unit>) {
        const ponderingData = this.createPonderingData(nearestUnits);
        const result = await this.process.runPondering(ponderingData);
        this.unit.update(result);
    }

    createPonderingData(nearestUnits: Array<Unit>): PonderingData {
        const ponderingData: PonderingData = {
            unit: this.unit,
            nearestUnits : nearestUnits,
        };

        return ponderingData;
    }

    terminate() {
        this.process.terminate();
    }
}