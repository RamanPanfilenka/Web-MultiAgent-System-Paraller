import Ball from '@mas/modules/common/models/units/ball';
import Speed from '@mas/modules/common/models/speed';
import Point from '@mas/modules/common/models/point';

export default class FillingBall extends Ball {
    isInPotential = false;
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