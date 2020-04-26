import { melodyBallStatus } from '../helpers/melodyBallStatus';
import ActionList from '../model/actionList';

export class CompositionService {
    constructor(notes, balls, melody, ballDrawer, noteDrawer) {
        this.balls = balls;
        this.melody = melody;
        this.ansCount = 0;
        this.ballDrawer = ballDrawer;
        this.noteDrawer = noteDrawer;
        this.notes = notes;
        this.actionList = new ActionList();
        this.startTime = Date.now();
        this.lastMelodyTime = melody.notes[melody.notes.length - 1].time;
    }

    WorkerAnswerSubscription(worker) {
        worker.onmessage = (msg) => {
            const model = JSON.parse(msg.data);
            this.balls[model.ball.id] = model.ball;
            this.balls[model.ball.id].worker = worker;
            this.ansCount++;
            if (this.ansCount == this.balls.length) {
                const currentTime = (Date.now() - this.startTime)/600;
                if (this.balls.filter(ball => ball.status == melodyBallStatus.InAgreement).length != 0) {
                    this.SendDataToWorkers(true, currentTime);

                    return;
                }

                if (this.balls.filter(ball => ball.status == melodyBallStatus.Draw).length == this.balls.length || currentTime < this.lastMelodyTime + 0.5) {
                    this.Draw(currentTime);
                    this.SendDataToWorkers(false, currentTime);
                }
            }
        };

    }

    SendDataToWorkers(checkNearest, currentTime) {
        this.balls.forEach((ball) => {
            ball.checkNearest = checkNearest;
            ball.nearestBalls = this.balls.filter(fball => fball.id != ball.id);
            ball.melody = this.melody;
            ball.currentTime = currentTime;
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

    Draw(currentTime) {
        this.ballDrawer.Init(currentTime);
        this.noteDrawer.DrawNotes(this.notes, currentTime);
        this.balls.forEach(ball => {
            const aimNote = this.notes.find(note => note.id == ball.note.id);
            const dx = Math.abs(ball.Position.X - aimNote.position.x);
            const dy = Math.abs(ball.Position.Y - aimNote.position.y);
            if (dx < 20 && dy < 20) {
                ball.Speed.X = 0;
                ball.Speed.Y = 0;
                ball.Angel = 0;
            } else {
                this.actionList.MoveToNote(ball, aimNote);
            }

            this.ballDrawer.StepDraw(ball);
            const noteOrderNumber = ball.noteNumber;
            delete this.melody.notes[noteOrderNumber - 1];
        });

    }

}