import Ball from "../src/js/model/ball"	
import { Drawer } from "./paraller/drawer";
import WorkerController from "./js/workerController";


const BallCount = 60;
const balls = [...new Array(BallCount)].map((a, index) => new Ball(20, index));

window.onload = function(){
    this.document.getElementById("c").width = window.innerWidth;
    this.document.getElementById("c").height = window.innerHeight;
    let drawer = new Drawer(c);
    let workerController = new WorkerController(drawer, balls);
    workerController.InitWorkers();
    workerController.RunWorkers();
}

