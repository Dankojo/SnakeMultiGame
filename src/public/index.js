var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var frames = 15;
var gs = ts = 20;
var xv = yv = 0;
var fx = fy = 15;
var sy = sx = 10;
var tail = 5;
var trail = []
var paintTail = false;
document.addEventListener('keydown', keyPush);

const testArray = [1,2,3,4];
const newArray = [...testArray, ...[5,6,7]];

console.log(newArray);

var game = () => {
    sx += xv;
    sy += yv;
    if (sx < 0) {
        sx = ts;
    }
    if (sx > ts) {
        sx = 0;
    }
    if (sy < 0) {
        sy = ts;
    }
    if (sy > ts) {
        sy = 0;
    }
    ctx.fillStyle = 'rgb(44,62,80)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    paintSnake();
    trail.push({ x: sx, y: sy });
    while (trail.length > tail) {
        trail.shift();
    }
    addFood();
}
function addFood() {
    if (sx === fx && sy === fy) {
        tail++;
        fx = Math.floor(Math.random() * ts);
        fy = Math.floor(Math.random() * ts);
    }
    ctx.fillStyle = 'rgb(231,76,60)';
    ctx.fillRect(fx * gs, fy * gs, gs - 2, gs - 2)
}

function paintSnake() {
    ctx.fillStyle = 'rgb(41,128,185)';
    ctx.fillRect(sx * gs, sy * gs, gs - 2, gs - 2);

    if (paintTail) {
        for (t of trail) {
            ctx.fillStyle = 'rgb(46,204,113)';
            ctx.fillRect(t.x * gs, t.y * gs, gs - 2, gs - 2);
            if (t.x == sx && t.y == sy) {
                tail = 5;
                xv = yv = 0;
            }
        }
    }
}
function keyPush(evt) {
    switch (evt.keyCode) {
        case 37:
            xv = -1; yv = 0;
            break;
        case 38:
            xv = 0; yv = -1;
            break;
        case 39:
            xv = 1; yv = 0;
            break;
        case 40:
            xv = 0; yv = 1;
            break;
    }
    paintTail = true;
}
setInterval(game, 1000 / frames);