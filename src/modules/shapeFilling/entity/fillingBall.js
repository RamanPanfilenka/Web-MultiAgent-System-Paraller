import Ball from "@/modules/common/models/entity/ball";

export default class FillingBall extends Ball{
    constructor(position, speed, connectionRadius, radius){
        super(position, speed, connectionRadius, radius);
        this.isInPotencial = false;
        this.approximationPoint = null;
    }

    update(fillingBall){
        super.update(fillingBall);
        this.isInPotencial = fillingBall.isInPotencial;
        this.approximationPoint = fillingBall.approximationPoint;
    }
}