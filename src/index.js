
import Ball from "../src/js/model/ball"	
import AlgotithmAnimation from "./js/animation/algoritm";
import {Circle} from "../src/js/model/figures/circle"
import {Rect} from "../src/js/model/figures/rect"
import {enviroment} from "./enviroment/enviroment";
import { Drawer } from "./paraller/drawer";


var figures = ["1", "0"]
var balls = [];
var animation;
var StopX, StopY, currentFigure;
var smashKoef = enviroment.SmashKoef;
var figureIndex = 0;
var countInPotencial = 0;
var BallCount = 60;
var workers = [];
for( var i = 0; i < BallCount; ++i )
   balls.push(new Ball(20, i));

window.onload = function(){
    let index = 0;
    this.document.getElementById("c").width = window.innerWidth;
    this.document.getElementById("c").height = window.innerHeight;
    mainAnim();
}

function mainAnim() {
    var parallerForEach = require('async-foreach').forEach;
    var drawer = new Drawer(c);
    balls.forEach(ball => {
        var blob = new Blob(["(" + animationParaller.toString() +")()"], {type: 'text/javascript'})
        var url = window.URL || window.webkitURL;
        var blobUrl = url.createObjectURL(blob);
        let worker = new Worker(blobUrl);
        worker.onmessage = msg => {
            let model = JSON.parse(msg.data);
            balls[model.ball.id] = model.ball;
            switch(model.status){
                case "start":
                    drawer.StartDraw(ball);
                    break;
                case "step":
                    drawer.StepDraw(model.ball);
                    drawer.NewBallDraw(model.ball);
                    let ballsModel = getNearestBalls(model.ball);
                    let post = {status: "old", nearsBalls: ballsModel.nearsBalls, ballsInRadius: ballsModel.ballsInRadius, ball: model.ball};
                    balls[model.ball.id].inPotencial = model.isPotencial;
                    if(checkAllInPotencial()){
                        stopWorkers();
                    }
                    worker.postMessage(JSON.stringify(post));
                    break;
                case "reDraw":
                   drawer.ReDraw(model.ball, model.additionalBall);
                    break;
                case "stop":
                    drawer.StopDraw();
                    break;
            }
        };
    
        let postModel = {ball: ball, enviroment: enviroment, nearest: [], ballsInRadisu: [], status: "new"};
        let saveObj = {worker: worker, postModel: postModel};
        workers.push(saveObj);
    });
    parallerForEach(workers, (obj, index) => {
        obj.worker.postMessage(JSON.stringify(obj.postModel));
    });
}

function checkAllInPotencial() {
    return balls.every(ball => {
        return ball.inPotencial == true;
    })
}

function stopWorkers() {
    workers.forEach(obj =>{
        obj.worker.terminate();
    })
}

function getNearestBalls(executedBall){
        var parallerForEach = require('async-foreach').forEach;
        var neearsBalls = [];
        var ballsInRadius = [];
        parallerForEach(balls, function(ball, index, balls) {
            let dx = executedBall.Position.X - ball.Position.X;
            let dy = executedBall.Position.Y - ball.Position.Y;
            let distance = dx*dx + dy*dy;
            
            if (Math.sqrt((Math.pow(Math.abs(ball.Position.X - executedBall.Position.X), 2) +
                Math.pow(Math.abs(ball.Position.Y - executedBall.Position.Y), 2))) <= executedBall.ConnectRadius) {
                    ballsInRadius.push(ball);
                    if(distance <= enviroment.SmashKoef * ( 2*ball.Radius)){
                        var sameObject = {ball: ball, dx: dx, dy: dy};
                        neearsBalls.push(sameObject);
                    }   
            }
        })
    
        var responseObject = {nearsBalls: neearsBalls, ballsInRadius: ballsInRadius};
        return responseObject;
}
