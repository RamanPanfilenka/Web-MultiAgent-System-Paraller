import { Message, MessageTypes } from '../models/messages/message';
import { PonderingData } from '../models/messages/ponderingData';
import { Unit } from '../models/units/unit';
import { UnitMapperList } from '../utils/unitMapperList';
import { Distance } from '../models/primitives/distance';

const globalSelf: Worker = self as any;

export abstract class WebWorker<T extends Unit> {
    protected unit: T;
    protected nearestUnits: Array<Unit> = [];
    protected mappers: UnitMapperList = new UnitMapperList();
    protected isMoved: boolean;

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
                    this.setStatistics();
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
        this.nearestUnits = [];
        ponderingData.nearestUnitPackages.forEach(unitPackage => {
            const nearestUnit = this.mappers.map(unitPackage);
            this.nearestUnits.push(nearestUnit);
        });
        this.isMoved = false;
    }

    protected setStatistics() {
        if (this.isMoved) {
            const dx = this.unit.speed.x;
            const dy = this.unit.speed.y;
            const distance = new Distance(dx, dy);
            this.unit.statistics.distanceTraveled += distance.value;
        }
    }
}
