var canvas = document.getElementById('screen'),
	ctx = canvas.getContext('2d');

// Fullscreen
canvas.width  = 2*640;
canvas.height = 2*480;

window.requestAnimFrame =
	window.requestAnimationFrame 		||
	window.webkitRequestAnimationFrame 	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame 		||
	function (callback) {
		setTimeout(callback, 1000 / 60);
	};

function Thing(vert, faces) {
	this.weight = 2;
	this.pos = {x: 0, y: 0, z: 0};

	/* OFF like format */
	this.vert = vert;
	this.faces = faces;
}

Thing.prototype.translateTo = function(x, y, z) {
	this.pos.x += x;
	this.pos.y += y;
	this.pos.z += z;
	for(var i=0; i < this.vert.length; i++) {
		this.vert[i][0] += x;
		this.vert[i][1] += y;
		this.vert[i][2] += z;
	}
}

Thing.prototype.rotateX = function(rx) {
	this.pos.x = Math.cos(rx)*this.pos.x - Math.sin(rx)*this.pos.y;
	this.pos.y = Math.sin(rx)*this.pos.x + Math.cos(rx)*this.pos.y;
	for(var i=0; i < this.vert.length; i++) {
		this.vert[i][0]	= Math.cos(rx)*this.vert[i][0] - Math.sin(rx)*this.vert[i][1];
		this.vert[i][1] = Math.sin(rx)*this.vert[i][0] + Math.cos(rx)*this.vert[i][1];
	}
}

Thing.prototype.rotateY = function(ry) {
	this.pos.x =  Math.cos(ry)*this.pos.x - Math.sin(ry)*this.pos.z;
	this.pos.z =  Math.sin(ry)*this.pos.x + Math.cos(ry)*this.pos.z;
	for(var i=0; i < this.vert.length; i++) {
		this.vert[i][0]	= Math.cos(ry)*this.vert[i][0] - Math.sin(ry)*this.vert[i][2];
		this.vert[i][2] = Math.sin(ry)*this.vert[i][0] + Math.cos(ry)*this.vert[i][2];
	}
}

Thing.prototype.rotateZ = function(rz) {
	this.pos.y = Math.cos(rz)*this.pos.y - Math.sin(rz)*this.pos.z;
	this.pos.z = Math.sin(rz)*this.pos.y + Math.cos(rz)*this.pos.z;
	for(var i=0; i < this.vert.length; i++) {
		this.vert[i][1]	= Math.cos(rz)*this.vert[i][1] - Math.sin(rz)*this.vert[i][2];
		this.vert[i][2] = Math.sin(rz)*this.vert[i][1] + Math.cos(rz)*this.vert[i][2];
	}
}

Thing.prototype.scale = function(scale) {
	for(var i=0; i < this.vert.length; i++) {
		this.vert[i][0] *= scale;
		this.vert[i][1] *= scale;
		this.vert[i][2] *= scale;
	}
}

function Camera() {
	this.aspectRatio = canvas.width / canvas.height;
	/* This is not functional */
	this.position = [0, 0, 0];
	this.lookAt = [0, 0, -1];
}

Camera.prototype.update = function(obj) {
	var i, j, x, y, z, index;
	ctx.lineWidth = obj.weight;
	
	for(i=0; i < obj.faces.length; i++) {
		var face = [];
		for(j=0; j < obj.faces[i].length; j++) {
			index = obj.faces[i][j];
			x = obj.vert[index][0];
			y = obj.vert[index][1];
			z = obj.vert[index][2];
			x = (z + x) / (2 * z) * canvas.width;
			y = (this.aspectRatio * z + y) / (this.aspectRatio * 2 * z) * canvas.height;
			face.push({x: x, y: y});
		}
		this.drawFace(face);
	}
}

Camera.prototype.drawFace = function(face) {
	var i, nV = face.length;
	ctx.beginPath();
	ctx.strokeStyle = "white";
	for(i=0; i < nV; i++) {
		ctx.moveTo(face[i].x, face[i].y);
		ctx.lineTo(face[(i+1) % nV].x, face[(i+1) % nV].y);
		ctx.stroke();
	}
}

var cub = new Thing(
		[[ 1.0,  0.0,  1.0],
		 [ 0.0,  1.0,  1.0],
		 [-1.0,  0.0,  1.0],
		 [ 0.0, -1.0,  1.0],
		 [ 1.0,  0.0, -1.0],
		 [ 0.0,  1.0, -1.0],
		 [-1.0,  0.0, -1.0],
		 [ 0.0, -1.0, -1.0]],
		[[0, 1, 2, 3],  
		 [7, 4, 0, 3],  
		 [4, 5, 1, 0],  
		 [5, 6, 2, 1],  
		 [3, 2, 6, 7],  
		 [6, 5, 4, 7]]
	);
var oth = new Thing(
		[[1.214124, 0.000000, 1.589309],
		 [0.375185, 1.154701, 1.589309],
		 [-0.982247, 0.713644, 1.589309],
		 [-0.982247, -0.713644, 1.589309],
		 [0.375185, -1.154701, 1.589309],
		 [1.964494, 0.000000, 0.375185],
		 [0.607062, 1.868345, 0.375185],
		 [-1.589309, 1.154701, 0.375185],
		 [-1.589309, -1.154701, 0.375185],
		 [0.607062, -1.868345, 0.375185],
		 [1.589309, 1.154701, -0.375185],
		 [-0.607062, 1.868345, -0.375185],
		 [-1.964494, 0.000000, -0.375185],
		 [-0.607062, -1.868345, -0.375185],
		 [1.589309, -1.154701, -0.375185],
		 [0.982247, 0.713644, -1.589309],
		 [-0.375185, 1.154701, -1.589309],
		 [-1.214124, 0.000000, -1.589309],
		 [-0.375185, -1.154701, -1.589309],
		 [0.982247, -0.713644, -1.589309]],
		[[0, 1, 2, 3, 4],
		 [0, 5, 10, 6, 1],
		 [1, 6, 11, 7, 2],
		 [2, 7, 12, 8, 3],
		 [3, 8, 13, 9, 4],
		 [4, 9, 14, 5, 0],
		 [15, 10, 5, 14, 19],
		 [16, 11, 6, 10, 15],
		 [17, 12, 7, 11, 16],
		 [18, 13, 8, 12, 17],
		 [19, 14, 9, 13, 18],
		 [19, 18, 17, 16, 15]]
	);

var cam = new Camera();
var r = 0;

cub.scale(0.5);

(function animloop() {
	requestAnimFrame(animloop);

	clrscrn();
	cam.update(cub);
	cam.update(oth);

	cub.translateTo(-cub.pos.x, -cub.pos.y, -cub.pos.z);
	cub.rotateX(0.005);
	cub.rotateY(-0.005);
	cub.rotateZ(0.005);
	cub.translateTo(0, 0, -1);


	oth.translateTo(-oth.pos.x, -oth.pos.y, -oth.pos.z);
	oth.rotateX(-0.005);
	oth.rotateY(0.005);
	oth.rotateZ(-0.005);
	oth.translateTo(0, 0, -8);

})();

function clrscrn() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
