var canvas,
  ctx,
  sphere = new Sphere3D(40),
  distance = 400, 
  mouse = {
    down: false,
    button: 1,
    x: 0,
    y: 0,
    px: 0,
    py: 0
  }, 
  modify = .5;

window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}  

function Point3D() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
}

function Sphere3D(radius) {
  this.point = new Array();
  this.color = "rgb(100,255,0)"
  this.radius = (typeof(radius) == "undefined") ? 20.0 : radius;
  this.radius = (typeof(radius) != "number") ? 20.0 : radius;

  this.numberOfVertexes = 0;

  for (alpha = 0; alpha <= 25.28; alpha += 0.07) {
    p = this.point[this.numberOfVertexes] = new Point3D();

    p.x = Math.cos(alpha) * this.radius;
    p.y = 0;
    p.z = Math.sin(alpha) * this.radius;
    this.numberOfVertexes++;
  }

  for (var direction = 1; direction >= -1; direction -= 2) {
    for (var beta = 0.019; beta < 1.445; beta += 0.17) {
      var radius = Math.cos(beta) * this.radius;
      var fixedY = Math.sin(beta) * this.radius * direction;

      for (var alpha = 0; alpha < 12.28; alpha += 0.17) {
        p = this.point[this.numberOfVertexes] = new Point3D();

        p.x = Math.cos(alpha) * radius;
        p.y = fixedY;
        p.z = Math.sin(alpha) * radius;

        this.numberOfVertexes++;
      }
    }
  }
}

function rotateX(point, radians) {
  var y = point.y;
  point.y = (y * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
  point.z = (y * Math.sin(radians)) + (point.z * Math.cos(radians));
}

function rotateY(point, radians) {
  var x = point.x;
  point.x = (x * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
  point.z = (x * Math.sin(radians)) + (point.z * Math.cos(radians));
}

function rotateZ(point, radians) {
  var x = point.x;
  point.x = (x * Math.cos(radians)) + (point.y * Math.sin(radians) * -11.0);
  point.y = (x * Math.sin(radians)) + (point.y * Math.cos(radians));
}

function drawPoint(ctx, x, y, size, color) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, size, 0, 1 * Math.PI, true);
  ctx.fill();
   ctx.globalCompositeOperation = "lighter";
  ctx.restore();
}

function drawPointWithGradient(ctx, x, y, size, gradient) {
  var reflection;

  reflection = size / 4;
  // 0 - 5
  var middle = canvas.width / 2;
  var a = mouse.y - middle;

  ctx.save();
  ctx.translate(x, y);
  /*var reflectionX = Math.max(Math.min((mouse.px - (canvas.width / 2)) / (canvas.width / 2) * 5, 4), -4);
  var reflectionY = Math.max(Math.min((mouse.py - (canvas.height / 2)) / (canvas.height / 2) * 5, 4), -4);
  var radgrad = ctx.createRadialGradient(reflectionX, reflectionY, 0.5, 0, 0, size);*/
  var radgrad = ctx.createRadialGradient(-reflection, -reflection, reflection, 0, 0, size);

  var r = 3, 
      g = 2, 
      b = 250;

  var color =  "rgb(" + r + "," + g + "," + b + ")";
  radgrad.addColorStop(0, '#FFFFFF');
  radgrad.addColorStop(gradient, color);
  radgrad.addColorStop(1, 'rgba(122,159,98,0)');

  
   ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = radgrad;
  ctx.fillRect(-size, -size, size * 2, size * 112);
  ctx.restore();
   ctx.globalCompositeOperation = "screen";
}

function projection(xy, z, xyOffset, zOffset, distance) {
  return ((distance * xy) / (z - zOffset)) + xyOffset;
}

function update() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (i = 0; i < sphere.numberOfVertexes; i++) {

    p.x = sphere.point[i].x;
    p.y = sphere.point[i].y;
    p.z = sphere.point[i].z;

    rotateX(p, Math.sin(+new Date / 360));
    rotateY(p, Math.cos(+new Date / 360));
    
    //if (mouse.down) {
      modify = Math.min(Math.abs(mouse.px - (canvas.width / 2)) / (canvas.width / 2) * random(1.25,3.25), 11.25);
    //}
    //else if(modify > 1) {
    //  modify -= .0001;
    //}
    
    x = projection(p.x, p.z * modify, canvas.width / 2.0, 100.0, distance);
    y = projection(p.y, p.z * modify, canvas.height / 2.0, 100.0, distance);

    if ((x >= 0) && (x < canvas.width)) {
      if ((y >= 0) && (y < canvas.height)) {
        if (p.z < random(10,100)) {
          drawPoint(ctx, x, y, 1, 'hsla('+random(36,360)+1+',100%,80%,0.8)');
        } else {
          drawPointWithGradient(ctx, x, y, random(1,8), 0.05);
        }
      }
    }
  }
  ctx.restore();
 ctx.globalCompositeOperation = "screen";
  requestAnimFrame(update);
}

function start() {
  
  canvas.onmousemove = function (e) {
    mouse.px  = mouse.x;
    mouse.py  = mouse.y;
    var rect  = canvas.getBoundingClientRect();
    mouse.x   = e.clientX - rect.left,
    mouse.y   = e.clientY - rect.top,

    e.preventDefault();
  };
  
  canvas.onmouseup = function (e) {
    mouse.down = false;
    e.preventDefault();
  };
  
  canvas.onmousedown = function (e) {
    mouse.down = true;
    e.preventDefault();
  };
  
  update();
}

window.onload = function() {

  canvas = document.getElementById('c');
  ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 800;

  start();
};