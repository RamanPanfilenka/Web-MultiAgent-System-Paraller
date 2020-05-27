import { Ball, BallScheme } from '@mas/modules/common/models/units/ball';
import { Point } from '@/multiagent-system/modules/common/models/primitives/point';

export interface FillingBallScheme extends BallScheme {
    isInPotential: boolean;
    approximationPoint?: Point ;
}

export class FillingBall extends Ball {
    isInPotential = false;
    approximationPoint?: Point = null;

    constructor(fillingBall: FillingBallScheme) {
        super(fillingBall);
    }
}
