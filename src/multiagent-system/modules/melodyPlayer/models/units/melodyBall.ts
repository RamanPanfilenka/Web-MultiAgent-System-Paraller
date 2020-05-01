import Ball from '@mas/modules/common/models/units/ball';
import Point from '@mas/modules/common/models/point';
import Speed from '@mas/modules/common/models/speed';
import Note from '../note';

export default class MelodyBall extends Ball {
    note?: Note;
    destinationPoint?: Point;

    constructor(
        position: Point,
        speed: Speed,
        connectionRadius: number,
        radius: number
    ) {
        super(position, speed, connectionRadius, radius);
    }

    update(melodyBall: MelodyBall) {
        super.update(melodyBall);
        this.note = melodyBall.note;
        this.destinationPoint = melodyBall.destinationPoint;
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