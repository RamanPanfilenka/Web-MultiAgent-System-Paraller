import { Ball, IBall } from '@mas/modules/common/models/units/ball';
import { Point } from '@mas/modules/common/models/point';

export interface IFillingBall extends IBall {
    isInPotential: boolean;
    approximationPoint?: Point ;
}

export class FillingBall extends Ball implements IFillingBall {
    isInPotential = false;
    approximationPoint: null | Point = null;

    constructor(fillingBall: IFillingBall) {
        super(fillingBall);
    }
}
