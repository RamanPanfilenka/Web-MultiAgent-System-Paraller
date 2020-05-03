import { Message, MessageTypes } from './message';
import { PonderingData, UnitPackage } from './ponderingData';
import { Unit } from './units/unit';

const globalSelf: Worker = self as any;

export default abstract class WebWorker<T extends Unit> {
    unit: T;
    nearestUnits: Array<Unit>;                 //It can be not only T type
    mappers: any;
    constructor() {
        this.initMessageHandler();
        this.initMappers();
    }

    private initMessageHandler(): void {
        globalSelf.onmessage = (event: MessageEvent): void => {
            const message: Message = event.data;
            switch (message.type) {
                case MessageTypes.INITIAL_DATA: {
                    this.setInitialData(message.data);
                    break;
                }

                case MessageTypes.PONDERING_DATA: {
                    this.setPonderingData(message.data);
                    this.runPondering();
                    this.sendResult(this.unit);
                    break;
                }
            }
        };
    }

    protected sendResult(result: T): void {
        globalSelf.postMessage(result);
    }

    private setPonderingData(ponderingData: PonderingData): void {
        this.nearestUnits = [];
        const constructor = this.getConstructor(ponderingData.unitPackage);
        this.unit = new constructor(ponderingData.unitPackage.data);

        ponderingData.nearestUnitPackages.forEach(unitPackage => {
            const constructor = this.getConstructor(unitPackage);
            const nearestUnit = new constructor(unitPackage.data);
            this.nearestUnits.push(nearestUnit);
        });
    }

    private getConstructor(unitPackage: UnitPackage): any {
        const constructorName = unitPackage.constructor;
        const constructor = this.mappers[constructorName];

        return constructor;
    }

    abstract runPondering(): void;

    protected abstract initMappers(): void;

    abstract setInitialData(initialData: any): void;
}