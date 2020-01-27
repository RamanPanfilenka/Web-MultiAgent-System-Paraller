export default class Rect {
	constructor(x, y, potencialRadius) {
		this.X = x;
		this.Y = y;
		this.PotencialRadius = potencialRadius;
	}

	GetPotencial(x, y, deviation = 0) {
		let inPotencial = false;
		let pathX = Math.abs(x - this.X);
		let pathY = Math.abs(y - this.Y);
		if (pathX < this.PotencialRadius + deviation && pathY < this.PotencialRadius + deviation) {
			inPotencial = true;
		}

		return inPotencial;
	}

	DrawPotencial(ctx) {
		ctx.beginPath();
		ctx.rect(this.X-this.PotencialRadius, this.Y-this.PotencialRadius, 2*this.PotencialRadius,2*this.PotencialRadius);
		let old = ctx.lineWidth;
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.lineWidth = old;
	}
}
