import io from 'socket.io-client';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const frames = 15;
const socket = io('http://localhost:3000');

let gs = 20, ts = 20;
let xv = 0, yv = 0;
let fx = 15, fy = 15;
let sy = 10, sx = 10;
let tail = 5;
let trail = []
let paintTail = false;

let ptTail = 5;
let ptTrail = [];
let ptSx,ptSy = 20;
document.addEventListener('keydown', keyPush);

const game = () => {
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
    paintPlayerTwoSnake();
    addFood();
}
function addFood() {
    if (sx === fx && sy === fy) {
        tail++;
        fx = Math.floor(Math.random() * ts);
        fy = Math.floor(Math.random() * ts);
        socket.emit('add food', {
            fx: fx,
            fy: fy,
        });
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
    trail.push({ x: sx, y: sy });
    socket.emit('snake moved', {
        trail: trail,
        head: {sx:sx, sy:sy},
    });
    while (trail.length > tail) {
        trail.shift();
    }   
}

function paintPlayerTwoSnake() {
    ctx.fillStyle = 'rgb(41,128,255)';
    ctx.fillRect(ptSx * gs, ptSy * gs, gs - 2, gs - 2);

    for (t of ptTrail) {
        ctx.fillStyle = 'rgb(255,204,113)';
        ctx.fillRect(t.x * gs, t.y * gs, gs - 2, gs - 2);
    }
}

function updatePlayerTwoSnake(data) {
    ptSx = data.sx;
    ptSy = data.sy;
    ptTrail = data.trail;
}

function updateFood(data) {
    fx = data.fx;
    fy = data.fy;
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

socket.on('snake move', function (data) {
    updatePlayerTwoSnake(data);
});

socket.on('new food', function (data) {
    updateFood(data);
});