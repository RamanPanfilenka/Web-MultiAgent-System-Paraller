import { Point } from '@mas/modules/common/models/primitives/point';
import { Shape, ShapeScheme } from '@mas/modules/common/models/shapes/shape';

export interface PianoKeyScheme extends ShapeScheme {
    tone: string;
    width: number;
    height: number;
    isPressed: boolean;
}

// TODO: Should extend Rectangle class.
export class PianoKey extends Shape {
    tone: string;
    width: number;
    height: number;
    isPressed: boolean;

    constructor(key: PianoKeyScheme) {
        super(key);
        this.tone = key.tone;
        this.width = key.width;
        this.height = key.height;
        this.isPressed = key.isPressed;
    }

    isPointIn(point: Point): boolean {
        const isInside = Math.abs((this.centerPoint.x - point.x)) < (this.width / 10)
                         && Math.abs((this.centerPoint.y - point.y)) < (this.height / 10);
        return isInside;
    }
}
