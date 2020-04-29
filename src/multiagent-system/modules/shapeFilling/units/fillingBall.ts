import Ball from "@/multiagent-system/modules/common/models/units/ball";
import Point from "@/multiagent-system/modules/common/models/point"
import Speed from "@/multiagent-system/modules/common/models/speed"

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