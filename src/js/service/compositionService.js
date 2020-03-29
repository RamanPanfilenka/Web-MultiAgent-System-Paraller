import { melodyBallStatus } from "../helpers/melodyBallStatus";

export class compositionService{
    constructor(balls, melody, drawer){
        this.balls = balls;
        this.melody = melody;
        this.ansCount = 0;
        this.drawer = drawer;
    }

    WorkerAnsverSubscription(worker){
        worker.onmessage = (msg) => {
            const model = JSON.parse(msg);
            this.balls[model.ball.Id] = model.ball;
            this.ball.worker = worker;
            this.ansCount++;
            if(this.ansCount == this.balls.length){
                if(this.balls.filter(ball => ball.status == melodyBallStatus.InAgreement).length != 0){
                    SendDataToWorkers();
                }

                if(this.balls.filter(ball => ball.status == melodyBallStatus.Draw).length == this.balls.length){
                    Draw();
                }
            }
        };

    }

    SendDataToWorkers() {
        this.balls.forEach((ball) => {
            const postModel = {
                ball: ball
            };
            const worker = ball.worker;
            delete ball.nearestBalls;
            delete ball.worker;
            worker.postMessage(JSON.stringify(postModel));
        });
    }

    Draw(){
        this.drawer.Init();
        this.balls.forEach(ball => {
            this.drawer.StepDraw(ball);
        });

    }

}