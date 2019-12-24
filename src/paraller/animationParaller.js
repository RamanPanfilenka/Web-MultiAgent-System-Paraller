function animationParaller(){
    var nearest = [];
    var ballsInRadisu = [];
    var ballAnimation;
    self.onmessage = function (msg) {
        var model = JSON.parse(msg.data);
        if(model.status === "new"){
            ballAnimation = new BallAnimation(model.ball, model.enviroment, model.nearest, model.ballsInRadisu);
            ballAnimation.Anim();
        }else{
            ballAnimation.nearest = model.nearsBalls;
            ballAnimation.ballsInRadius = model.ballsInRadius;
        }
        
    }   

    class BallAnimation{
        constructor(ball, enviroment, nearest, ballsInRadius){
            this.ball = ball;
            this.enviroment = enviroment;
            this.nearest = nearest;
            this.ballsInRadius = ballsInRadius;
        }
    
        Smash(){
            this.nearest.forEach(nearestObject => {
                this.ball.Speed.X += nearestObject.dx * this.ball.Radius / 80;
                this.ball.Speed.Y += nearestObject.dy * this.ball.Radius / 80;
            });
        }
    
        Anim(){
            var postModel = {status: "start",ball: null, additionalBall: null};
            postMessage(JSON.stringify(postModel));
            setInterval(() => {
                this.Smash();
                this.Step();
                postModel.status = "step";
                postModel.ball = this.ball;
                postMessage(JSON.stringify(postModel));
            }, 50);
        }
    
        Step(){
            this.ball.PreviousPosition.X = this.ball.Position.X;
            this.ball.PreviousPosition.Y = this.ball.Position.Y;
            this.ball.Position.X += this.ball.Speed.X;
            this.ball.Position.Y += this.ball.Speed.Y;


            if( this.ball.Velocity > this.ball.Radius / 2 ){
        
                this.ball.Velocity -= .5;
                this.ball.Speed.X = Math.cos( this.ball.Angle ) * this.ball.Velocity;
                this.ball.Speed.Y = Math.sin( this.ball.Angle ) * this.ball.Velocity;
            }
        
            if( this.ball.Position.X < 0 ){
        
                this.ball.Position.X = 0;
                this.ball.Speed.X *= -1;
                this.ChangeAngle();
        
            } else if( this.ball.Position.X > this.enviroment.width - 20 ){
        
                this.ball.Position.X = this.enviroment.width - 20;
                this.ball.Speed.X *= -1;
                this.ChangeAngle();
            }
        
            if( this.ball.Position.Y < 0 ){
        
                this.ball.Position.Y = 0;
                this.ball.Speed.Y *= -1;
                this.ChangeAngle();
            } else if( this.ball.Position.Y> this.enviroment.height - 20){
        
                this.ball.Position.Y = this.enviroment.height - 20;
                this.ball.Speed.Y *= -1;
                this.ChangeAngle();
            }
        }
        
        ChangeAngle(){
            this.ball.Angle = Math.atan( this.ball.Speed.Y / this.ball.Speed.X );
        
            if( this.ball.Speed.X < 0 )
                this.ball.Angle += Math.PI;
            if( this.ball.Speed.X !== 0 )
                this.ball.Velocity = this.ball.Speed.X / Math.cos( this.ball.Angle );
            else
                this.ball.Velocity = this.ball.Speed.Y / Math.sin( this.ball.Angle );
        }
    }	
}
