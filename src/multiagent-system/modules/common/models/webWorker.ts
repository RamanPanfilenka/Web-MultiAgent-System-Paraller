import { Message, MessageTypes } from './message';
import { PonderingData } from './ponderingData';
import { Unit } from './units/unit';
import { UnitMapperList } from './unitMapperList';

const globalSelf: Worker = self as any;

export default abstract class WebWorker<T extends Unit> {
    unit: T;
    nearestUnits: Array<Unit> = [];                 //It can be not only T type
    mappers: UnitMapperList;

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
        this.unit = this.mappers.map(ponderingData.unitPackage);

        ponderingData.nearestUnitPackages.forEach(unitPackage => {
            const nearestUnit = this.mappers.map(unitPackage);
            this.nearestUnits.push(nearestUnit);
        });
    }

    abstract runPondering(): void;

    protected abstract initMappers(): void;

    abstract setInitialData(initialData: any): void;
}
