import { Point } from '@mas/modules/common/models/primitives/point';
import { Shape, IShape } from '@mas/modules/common/models/shapes/shape';

export interface IPianoKey extends IShape {
    tone: string;
}

// TODO: Should extend Rectangle class.
export class PianoKey extends Shape implements IPianoKey {
    tone: string;

    constructor(key: IPianoKey) {
        super(key);
        this.tone = key.tone;
    }

    isPointIn(point: Point): boolean {
        const isInside = this.centerPoint.equals(point);
        return isInside;
    }
}
