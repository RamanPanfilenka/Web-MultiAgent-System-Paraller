import { PianoKey, IPianoKey } from './primitives/pianoKey';

export class PianoKeyboard {
    keys: Map<string, PianoKey> = new Map();

    constructor(keysData: Array<IPianoKey>) {
        keysData.forEach(keyData => {
            const pianoKey = new PianoKey(keyData);
            this.keys.set(keyData.tone, pianoKey);
        });
    }
}
