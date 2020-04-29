import Shape from "./shape";

export default class Circle extends Shape{
    constructor(centerPoint, size){
        super(centerPoint, size);
    }

    isEntityIn(entityPosition, deviation = 0){
        const dx = this.centerPoint.x - entityPosition.x;
        const dy = this.centerPoint.y - entityPosition.y;
        if (Math.sqrt(dx ** 2 + dy ** 2) < this.size + deviation) {
            return true;
        }

        return false;
    }
}