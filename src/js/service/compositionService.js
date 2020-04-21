import { melodyBallStatus } from "../helpers/melodyBallStatus";
import ActionList from "../model/actionList";

export class compositionService{
    constructor(allnotes, balls, melody, ballDrawer, noteDraver){
        this.balls = balls;
        this.melody = melody;
        this.ansCount = 0;
        this.ballDrawer = ballDrawer;
        this.noteDraver = noteDraver;
        this.allnotes = allnotes;
        this.actionList = new ActionList();
        this.startTime = Date.now();
    }

    WorkerAnsverSubscription(worker){
        worker.onmessage = (msg) => {
            const model = JSON.parse(msg.data);
            this.balls[model.ball.id] = model.ball;
            this.balls[model.ball.id].worker = worker;
            this.ansCount++;
            if(this.ansCount == this.balls.length){
                if(this.balls.filter(ball => ball.status == melodyBallStatus.InAgreement).length != 0){
                    this.SendDataToWorkers(true);
                    return;
                }

                if(this.balls.filter(ball => ball.status == melodyBallStatus.Draw).length == this.balls.length){
                    this.Draw();
                    this.SendDataToWorkers(false);
                }
            }
        };

    }

    SendDataToWorkers(checkNearest) {
        this.balls.forEach((ball) => {
            ball.checkNearest = checkNearest;
            ball.nearestBalls = this.balls.filter(fball => fball.id != ball.id);
            ball.melody = this.melody;
            ball.currentTime = (Date.now() - this.startTime)/600;
            const postModel = {
                ball: ball,
            };
            const worker = ball.worker;
           
            worker.postMessage(JSON.stringify(postModel));
            delete ball.nearestBalls;
            delete ball.worker;
        });
        this.ansCount = 0;
    }

    Draw(){
        this.ballDrawer.Init();
        this.noteDraver.DrawNotes(this.allnotes);
        this.balls.filter(ball => ball.status != melodyBallStatus.Stop).forEach(ball => {
            const aimNote = this.allnotes.find(note => note.id == ball.note.id);
            const dx = Math.abs(ball.Position.X - aimNote.position.x);
            const dy = Math.abs(ball.Position.Y - aimNote.position.y);
            if(dx < 20 && dy < 20){
                ball.Speed.X = 0;
                ball.Speed.Y = 0;
                ball.Angel = 0;
            }else{
                this.actionList.MovaToNote(ball, aimNote);
            }
            
            this.ballDrawer.StepDraw(ball);
            const noteOrderNumber = ball.noteNumber;
            this.melody.notes[noteOrderNumber - 1] = undefined;
            this.melody.times[noteOrderNumber - 1] = undefined;
        });

    }

}