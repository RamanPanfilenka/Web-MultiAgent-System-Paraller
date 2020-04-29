import Point from '@mas/modules/common/models/point';

export default class PianoKey {
    tone: number;
    position: Point;

    constructor(tone: number, position: Point) {
        this.tone = tone;
        this.position = position;
    }
}