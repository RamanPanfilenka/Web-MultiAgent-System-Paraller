import { Point, IPoint } from '../point';
import { Speed, ISpeed} from '../speed';

export interface UnitPackage {
    constructor: string;
    data: IUnit;
}

export interface IUnit {
    position: IPoint;
    speed: ISpeed;
    connectionRange: number;
}

export class Unit implements IUnit {
    position: Point;
    speed: Speed;
    connectionRange: number;

    constructor(unit: IUnit) {
        this.position = new Point(unit.position);
        this.speed = new Speed(unit.speed);
        this.connectionRange = unit.connectionRange;
    }

    isInRange(unit: Unit): boolean {
        const distance = this.position.getDistanceTo(unit.position);
        return (distance.value <= this.connectionRange);
    }

    package(): UnitPackage {
        const unitPackage: UnitPackage = {
            constructor: this.constructor.name,
            data: this,
        };
        return unitPackage;
    }
}
