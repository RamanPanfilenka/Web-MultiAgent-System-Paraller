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
        this.nearestUnits = [];
        ponderingData.nearestUnitPackages.forEach(unitPackage => {
            const nearestUnit = this.mappers.map(unitPackage);
            this.nearestUnits.push(nearestUnit);
        });
    }


    protected step() {
        this.unit.position.x += this.unit.speed.x;
        this.unit.position.y += this.unit.speed.y;

        // if (this.unit.velocity > this.unit.radius / 2) {
        //     this.unit.velocity -= 0.5;
        //     this.unit.speed.x = Math.cos(this, this.unit.angle) * this.unit.velocity;
        //     this.unit.speed.y = Math.sin(this.unit.angle) * this.unit.velocity;
        // }

        if (this.unit.position.x < 0) {
            this.unit.position.x = 0;
            this.unit.speed.angle += Math.PI;
            this.changeAngle();
        } else if (this.unit.position.x > 1920 - 20) {
            this.unit.position.x = 1900;
            this.unit.speed.angle += Math.PI;
            this.changeAngle();
        }

        if (this.unit.position.y < 0) {
            this.unit.position.y = 0;
            this.unit.speed.angle += Math.PI;
            this.changeAngle();
        } else if (this.unit.position.y > 900) {
            this.unit.position.y = 900;
            this.unit.speed.angle += Math.PI;
            this.changeAngle();
        }
    }

    protected changeAngle() {
        this.unit.speed.angle = Math.atan(this.unit.speed.y / this.unit.speed.x);

        if (this.unit.speed.x < 0)
            this.unit.speed.angle += Math.PI;
        // if (this.unit.speed.x !== 0)
        //     this.unit.speed = this.unit.speed.x / Math.cos(this.unit.angle);
        // else
        //     this.unit.velocity = this.unit.speed.y / Math.sin(this.unit.angle);
    }
}
