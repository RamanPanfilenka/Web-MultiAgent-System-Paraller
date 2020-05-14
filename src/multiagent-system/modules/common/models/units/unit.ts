import { Point, PointScheme } from '../primitives/point';
import { Speed, SpeedScheme} from '../primitives/speed';

export interface UnitPackage {
    constructor: string;
    data: UnitScheme;
}

export interface UnitScheme {
    id: number;
    position: PointScheme;
    speed: SpeedScheme;
    connectionRange: number;
}

export class Unit {
    id: number;
    position: Point;
    speed: Speed;
    connectionRange: number;

    constructor(unit: UnitScheme) {
        this.id = unit.id;
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
