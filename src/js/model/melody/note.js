export default class Note {
    constructor(id, x, y, tone) {
        this.id = id;
        this.position = {
            x : x,
            y : y,
        };
        this.tone = tone;
    }
}