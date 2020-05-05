import { Point } from '@mas/modules/common/models/primitives/point';

export interface IPianoKey {
    tone: string;
    position: Point;
}

export class PianoKey {
    tone: string;
    position: Point;

    constructor(key: IPianoKey) {
        this.tone = key.tone;
        this.position = key.position;
    }
}
