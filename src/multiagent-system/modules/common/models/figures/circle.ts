import Shape from "./shape";
import Point from "../point";

export default class Circle extends Shape {
    constructor(centerPoint: Point, size: number){
        super(centerPoint, size);
    }

    isUnitIn(unitPosition: Point, deviation: number = 0) : boolean {
        const dx = this.centerPoint.x - unitPosition.x;
        const dy = this.centerPoint.y - unitPosition.y;
        if (Math.sqrt(dx ** 2 + dy ** 2) < this.size + deviation) {
            return true;
        }

        return false;
    }
}