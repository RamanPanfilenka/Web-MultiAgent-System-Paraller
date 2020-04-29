import Shape from "./shape";

export default class Rect extends Shape{
    constructor(centerPoint, size){
        super(centerPoint, size);
    }

    isEntityIn(entityPosition, deviation = 0){
        const dx = Math.abs(this.centerPoint.x - entityPosition.x);
        const dy = Math.abs(this.centerPoint.y - entityPosition.y);
        if (dx < this.size + deviation && dy < this.size + deviation) {
            return true;
        }

        return false;
    }
}