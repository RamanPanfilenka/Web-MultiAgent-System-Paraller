import Ball from "@/modules/common/models/unit/ball";

export default class MelodyBall extends Ball{
    constructor(position, speed, connectionRadius, radius){
        super(position, speed, connectionRadius, radius);
        this.note = null;
        this.destinationPoint = null;
    }

    update(melodyBall){
        super.update(melodyBall);
        this.note = melodyBall.note;
        this.destinationPoint = note.destinationPoint;
    }

    getTimeToNote(){
        const dx = this.position.x - this.note.position.x;
        const dy = this.position.y - this.note.position.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        return distance / this.speed.value;
    }
}