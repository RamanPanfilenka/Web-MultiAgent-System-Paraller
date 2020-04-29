export default class Speed {
    value: number;
    angle: number;

    constructor(value: number, angle: number) {
        this.value = value;
        this.angle = angle;
    }

    get x(): number {
        return -this.value * Math.cos(this.angle);
    }

    get y(): number {
        return -this.value * Math.sin(this.angle);
    }
}