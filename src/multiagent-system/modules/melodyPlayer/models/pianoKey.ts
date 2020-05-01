import Point from '@mas/modules/common/models/point';

export default class PianoKey {
    tone: string;
    position: Point;

    constructor(tone: string, position: Point) {
        this.tone = tone;
        this.position = position;
    }
}