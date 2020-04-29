import Shape from "./shape";
import Point from "../point";

export default class Rect extends Shape {
    constructor(centerPoint: Point, size: number) {
        super(centerPoint, size);
    }

    isUnitIn(unitPosition: Point, deviation: number = 0) : boolean {
        const dx = Math.abs(this.centerPoint.x - unitPosition.x);
        const dy = Math.abs(this.centerPoint.y - unitPosition.y);
        if (dx < this.size + deviation && dy < this.size + deviation) {
            return true;
        }

        return false;
    }
}