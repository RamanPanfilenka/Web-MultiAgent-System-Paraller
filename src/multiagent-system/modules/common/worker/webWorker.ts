import { Message, MessageTypes } from '../models/messages/message';
import { PonderingData } from '../models/messages/ponderingData';
import { Unit } from '../models/units/unit';
import { UnitMapperList } from '../utils/unitMapperList';

const globalSelf: Worker = self as any;

export abstract class WebWorker<T extends Unit> {
    unit: T;
    nearestUnits: Array<Unit> = [];
    mappers: UnitMapperList = new UnitMapperList();

    constructor() {
        this.initMessageHandler();
        this.initMappers();
    }

    protected abstract runPondering(): void;

    protected abstract initMappers(): void;

    protected abstract setInitialData(initialData: any): void;

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
        this.unit = <T> this.mappers.map(ponderingData.unitPackage);

        ponderingData.nearestUnitPackages.forEach(unitPackage => {
            const nearestUnit = this.mappers.map(unitPackage);
            this.nearestUnits.push(nearestUnit);
        });
    }
}
