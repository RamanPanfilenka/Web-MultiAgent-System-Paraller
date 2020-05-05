import { Ball, IBall} from '@mas/modules/common/models/units/ball';
import { Point } from '@mas/modules/common/models/primitives/point';
import { Note } from '../primitives/note';

export interface IMelodyBall extends IBall {
    note?: Note;
    destinationPoint?: Point;
}

export class MelodyBall extends Ball implements IMelodyBall {
    note?: Note;
    destinationPoint?: Point;

    constructor(melodyBall: IMelodyBall) {
        super(melodyBall);
    }

    getTimeToNote(): number;
    getTimeToNote(notePoint: Point): number;
    getTimeToNote(notePoint? : Point): number {
        const distance = notePoint
            ? this.position.getDistanceTo(notePoint)
            : this.position.getDistanceTo(this.destinationPoint);
        return distance.value / this.speed.value;
    }
}
