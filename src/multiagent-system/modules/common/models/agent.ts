import Unit from './units/unit';
import Worker from '@/multiagent-system/modules/common/worker';
import Message from './message';

export default class Agent {
    unit: Unit;
    worker: Worker;

    constructor(unit: Unit) {
        this.unit = unit;
    }

    async pondering(nearestUnits: Array<Unit>) {
        const message = this.package(nearestUnits);
        const result = await this.worker.send(message);
        this.unit.update(result);
    }

    package(nearestUnits: Array<Unit>): string {
        const message: Message<Unit> = {
            unit: this.unit,
            nearestUnits : nearestUnits,
        };

        return JSON.stringify(message);
    }

    terminate() {
        this.worker.terminate();
    }
}