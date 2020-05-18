import { Ball, BallScheme} from '@mas/modules/common/models/units/ball';
import { Note, NoteScheme } from '../primitives/note';
import { PianoKey, PianoKeyScheme } from '../primitives/pianoKey';
import { Unit } from '@/multiagent-system/modules/common/models/units/unit';

export interface MelodyBallScheme extends BallScheme {
    targetNote?: NoteScheme;
    targetKey?: PianoKeyScheme;
}

export class MelodyBall extends Ball {
    targetNote?: Note;
    targetKey?: PianoKey;


    constructor(melodyBall: MelodyBallScheme) {
        super(melodyBall);
        if (melodyBall.targetNote) {
            this.targetNote = new Note(melodyBall.targetNote);
        }
        if (melodyBall.targetKey) {
            this.targetKey = new PianoKey(melodyBall.targetKey);
        }
    }

    getTimeToNote(): number;
    getTimeToNote(key: PianoKey): number;
    getTimeToNote(key? : PianoKey): number {
        const distance = key
            ? this.position.getDistanceTo(key.centerPoint)
            : this.position.getDistanceTo(this.targetKey.centerPoint);
        return distance.value / (this.speed.value * 100);
    }

    isInKey(pianoKey?: PianoKey): boolean {
        if (pianoKey) {
            return pianoKey.isPointIn(this.position);
        }
        return (this.targetKey && this.targetKey.isPointIn(this.position));
    }

    isNotePlayed(currentTime: number): boolean {
        return (
            this.targetNote
            && this.targetNote.playTime + this.targetNote.duration < currentTime
            && this.isInKey()
        );
    }

    hasSameTargetNoteWith(otherBall: MelodyBall): boolean {
        if (!otherBall) {
            return false;
        }
        return this.targetNote.equals(otherBall.targetNote);
    }

    resetTargetNote() {
        this.targetKey = undefined;
        this.targetNote = undefined;
    }
}
