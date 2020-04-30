import Ball from "@/multiagent-system/modules/common/models/units/ball";
import Point from "@/multiagent-system/modules/common/models/point";
import Speed from "@/modules/common/models/speed";
import Note from "../note";

export default class MelodyBall extends Ball {
    note: null | Note = null;
    destinationPoint: null | Point = null;

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

    getTimeToNote() : number;

    getTimeToNote(notePoint : Point) : number;
    
    getTimeToNote(notePoint? : Point) : number {
        const distance = notePoint 
                            ? this.position.getDistanceTo(notePoint).value
                            : this.position.getDistanceTo(this.destinationPoint).value;
        return distance / this.speed.value;
    }
 }