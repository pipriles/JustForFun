var canvas = document.getElementById('screen'),
	ctx = canvas.getContext('2d');

// Fulscreen
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

window.requestAnimFrame = 
	window.requestAnimationFrame 		||
	window.webkitRequestAnimationFrame 	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame 		||
	function (callback) {
		setTimeout(callback, 1000 / 60);
	};

var gravity = 0.5;

function Ball() {
	this.x = canvas.width  / 2;
	this.y = canvas.height / 2;

	this.speed = 10;
	this.theta = Math.random() * 2*Math.PI;
	this.vx = Math.cos(this.theta) * this.speed;
	this.vy = Math.sin(this.theta) * this.speed;
	this.dx = 0;
	this.dy = 0;
	this.size = 20;

	this.color = "#" + ("00000" + (Math.random()*16777216 << 0).toString(16)).substr(-6);
}

Ball.prototype.draw = function () {
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = this.color;
	ctx.fill();
}

Ball.prototype.move = function() {
	this.x += this.vx;
	this.y += this.vy;
	this.getCollision();

	// External forces
	this.vx += this.dx;
	this.vy += this.dy;
	this.vy += gravity;
}

Ball.prototype.update = function() {

	this.getMove();
	// render
	this.move();
	this.draw();
}

Ball.prototype.getMove = function() {
	delta.x = window.screenX - Box.x;
	delta.y = window.screenY - Box.y;
	Box.alpha = Math.atan2(delta.y, delta.x);
	Box.newTime = new Date;
	Box.speed = Math.sqrt((delta.x * delta.x) + (delta.y * delta.y)) / (Box.newTime - Box.oldTime);
	this.dx = Math.cos(Box.alpha) * Box.speed;
	this.dy = Math.sin(Box.alpha) * Box.speed;
	Box.x = window.screenX;
	Box.y = window.screenY;
	Box.oldTime = Box.newTime;
}

Ball.prototype.getCollision = function() {
	if(this.x >= (n = canvas.width  - this.size) || this.x <= (n = this.size)) this.x = n, this.vx *= -0.5, this.vy *= 0.95;
	if(this.y >= (n = canvas.height - this.size) || this.y <= (n = this.size)) this.y = n, this.vy *= -0.5, this.vx *= 0.95;
}

var n = 0;
var item = new Ball(),
	delta = {},
	Box = {
		x: window.screenX,
		y: window.screenY,
		oldTime: new Date
	};

(function animloop() {
	requestAnimFrame(animloop);
	clrscrn();
	item.update();
})();

function clrscrn() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Events
window.addEventListener("resize", handleResize);
function handleResize(e) {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}