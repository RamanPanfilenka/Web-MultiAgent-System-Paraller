function nearsBalls(msg){
    self.onmessage = function (msg) {
        var model = JSON.parse(msg.data);
        neearsBalls = [];
        ballsInRadius = [];
        this.eval(model.parallerForEach);
        parallerForEach(model.balls, function(ball, index, balls) {
            let dx = model.executedBall.Position.X - ball.Position.X;
            let dy = model.executedBall.Position.Y - ball.Position.Y;
            let distance = dx*dx + dy*dy;
            
            if (Math.sqrt((Math.pow(Math.abs(ball.Position.X - model.executedBall.Position.X), 2) +
                Math.pow(Math.abs(ball.Position.Y - model.executedBall.Position.Y), 2))) <= model.executedBall.ConnectRadius) {
                    ballsInRadius.push(ball);
                    if(distance <= model.enviroment.SmashKoef * ( 2*ball.Radius)){
                        var sameObject = {ball: ball, dx: dx, dy: dy};
                        neearsBalls.push(sameObject);
                    }   
            }
        })
    
        var responseObject = {nearsBalls: neearsBalls, ballsInRadius: ballsInRadius};
        postMessage(JSON.stringify(responseObject));
    }
}