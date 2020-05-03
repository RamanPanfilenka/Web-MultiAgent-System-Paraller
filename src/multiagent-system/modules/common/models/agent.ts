import Process from './process';
import { Unit } from './units/unit';
import { PonderingData } from './ponderingData';

export default class Agent {
    unit: Unit;
    process: Process;
    private mapper: any;

    constructor(unit: Unit, process: Process) {
        this.unit = unit;
        this.process = process;
        this.mapper = unit.constructor;
    }

    async runPondering(nearestUnits: Array<Unit>): Promise<void> {
        const ponderingData = this.createPonderingData(nearestUnits);
        const result = await this.process.runPondering(ponderingData);
        this.unit = new this.mapper(result);
    }

    createPonderingData(nearestUnits: Array<Unit>): PonderingData {
        const unitPackage = this.unit.package();
        const ponderingData: PonderingData = {
            unitPackage: unitPackage,
            nearestUnitPackages : nearestUnits.map(unit => unit.package()),
        };

        return ponderingData;
    }

    terminate(): void {
        this.process.terminate();
    }
}