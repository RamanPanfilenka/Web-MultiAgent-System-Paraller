export default class Speed{
    constructor(value, angle){
        this.value = value;
        this.angle = angle;
    }

    get x(){
        return -this.value * Math.cos(this.angle);
    }

    get y(){
        return -this.value * Math.sin(this.angle);
    }

}