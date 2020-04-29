import Ball from "@/modules/common/models/units/ball";
import Speed from "@/modules/common/models/speed";
import Point from "@/modules/common/models/point";

export default class FillingBall extends Ball {
    isInPotential: boolean = false;
    approximationPoint: null | Point = null;

    constructor(
        position: Point,
        speed: Speed,
        connectionRadius: number,
        radius: number,
    ) {
        super(position, speed, connectionRadius, radius);
    }

    update(fillingBall: FillingBall) {
        super.update(fillingBall);
        this.isInPotential = fillingBall.isInPotential;
        this.approximationPoint = fillingBall.approximationPoint;
    }
}