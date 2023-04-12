const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clear-btn");
const colorBtn = document.querySelectorAll(".color-btn");
let lastX = 0;
let lastY = 0;
let isDrawing = false;
let color = "black";

// Resize window
function resize () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Color choice
colorBtn.forEach(btn => {
    btn.addEventListener("click", e => {
        color = e.target.style.backgroundColor;
    });
});

// Clear
clearBtn.addEventListener("click", () => {
    socket.emit("clear");
});
socket.on("clear", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Draw
function startPosition(e){
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function drawLine(x1, y1, x2, y2, color, emit){
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    if(emit) {
        socket.emit("draw", {x1, y1, x2, y2, color});
    }
}

function draw(e) {
    if(isDrawing) {
        drawLine(lastX, lastY, e.offsetX, e.offsetY, color, true);
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
}

function finishedPosition() {
    isDrawing = false;
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mousemove", draw);
document.addEventListener("mouseup", finishedPosition);

socket.on("draw", data => {
    drawLine(data.x1, data.y1, data.x2, data.y2, data.color, false);
});