import { PianoKey, PianoKeyScheme } from './primitives/pianoKey';

export class PianoKeyboard {
    keys: Map<string, PianoKey> = new Map();

    constructor(keysData: Array<PianoKeyScheme>) {
        keysData.forEach(keyData => {
            const pianoKey = new PianoKey(keyData);
            this.keys.set(keyData.tone, pianoKey);
        });
    }
}
