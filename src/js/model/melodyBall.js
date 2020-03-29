import Ball from "./ball";
import { melodyBallStatus } from "../helpers/melodyBallStatus";

export class melodyBall extends Ball{
    constructor(id, enviroment) {
        super(id, enviroment);
        this.note = null;
        this.timeToNote = 0;
        this.status = 0;
    }

    Sensive(worker) {
        const postMessage = {
            ball: this
        };
        worker.postMessage(JSON.stringify(postMessage));
    }

    Pondering(nearestBalls) {
        this.status = melodyBallStatus.Draw;;
        if(note == null){
            this.status = melodyBallStatus.InAgreement;;
            FindNote();
            return;
        }

        nearestBalls.filter(ball => this.note != null && ball.note == this.note).forEach(ball => {
           if(ball.timeToNote < this.timeToNote){
               this.note = FindNote();
               this.status = melodyBallStatus.InAgreement;
           }
        });
    }

    CopyBall(ball){
        super.CopyBall(ball);
        this.note = ball.note;
        this.timeToNote = ball.timeToNote;
        this.status = ball.status;
    }
}