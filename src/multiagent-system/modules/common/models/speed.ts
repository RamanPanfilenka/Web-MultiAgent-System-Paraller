export interface ISpeed {
    value: number;
    angle: number;
}

export class Speed implements ISpeed {
    value: number;
    angle: number;

    constructor(speed: ISpeed) {
        this.value = speed.value;
        this.angle = speed.angle;
    }

    get x(): number {
        return -this.value * Math.cos(this.angle);
    }

    get y(): number {
        return -this.value * Math.sin(this.angle);
    }
}