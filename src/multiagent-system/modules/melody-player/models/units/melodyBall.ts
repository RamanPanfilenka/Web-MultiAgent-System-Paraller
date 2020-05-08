import { Ball, IBall} from '@mas/modules/common/models/units/ball';
import { Note, INote } from '../primitives/note';
import { PianoKey, IPianoKey } from '../primitives/pianoKey';

export interface IMelodyBall extends IBall {
    targetNote?: INote;
    targetKey?: IPianoKey;
}

export class MelodyBall extends Ball implements IMelodyBall {
    targetNote?: Note;
    targetKey?: PianoKey;

    constructor(melodyBall: IMelodyBall) {
        super(melodyBall);
    }

    getTimeToNote(): number;
    getTimeToNote(key: PianoKey): number;
    getTimeToNote(key? : PianoKey): number {
        const distance = key
            ? this.position.getDistanceTo(key.centerPoint)
            : this.position.getDistanceTo(this.targetKey.centerPoint);
        return distance.value / this.speed.value;
    }

    isInKey(): boolean {
        return (this.targetKey && this.targetKey.isPointIn(this.position));
    }

    isNotePlayed(currentTime: number): boolean {
        return (
            this.targetNote
            && this.targetNote.playTime < currentTime
            && this.isInKey()
        );
    }

    hasSameTargetNoteWith(otherBall: MelodyBall): boolean {
        return this.targetNote.equals(otherBall.targetNote);
    }
}
