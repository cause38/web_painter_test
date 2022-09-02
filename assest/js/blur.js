var tempCanvas = document.getElementById('tempCanvas');
var tempCtx = tempCanvas.getContext('2d');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var $canvas = $('#canvas');
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();
var isDown = false;

var PI2 = Math.PI * 2;

var img = new Image();
img.crossOrigin = 'anonymous';
img.onload = start;
img.src = '/assest/img/test.jpg';

function start() {
    canvas.width = tempCanvas.width = img.width;
    canvas.height = tempCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);
}

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    // 새로 그릴 때 마다 cavase 초기화
    // tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    isDown = true;
}

function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();
    isDown = false;
    tempCtx.save();
    tempCtx.globalCompositeOperation = 'source-in';
    tempCtx.drawImage(img, 0, 0);
    tempCtx.restore();
    boxBlurCanvasRGBA('tempCanvas', 0, 0, tempCanvas.width, tempCanvas.height, 4, 0);
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(img, 0, 0);
    ctx.restore();
}

function handleMouseOut(e) {
    e.preventDefault();
    e.stopPropagation();
    isDown = false;
}

function handleMouseMove(e) {
    if (!isDown) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 20, 0, PI2);
    ctx.closePath();
    ctx.fill();
    tempCtx.beginPath();
    tempCtx.arc(mouseX, mouseY, 20, 0, PI2);
    tempCtx.closePath();
    tempCtx.fill();
}

$('#canvas').mousedown(function (e) {
    console.log('mousedown');
    handleMouseDown(e);
});
$('#canvas').mousemove(function (e) {
    console.log('mousemove');
    handleMouseMove(e);
});
$('#canvas').mouseup(function (e) {
    console.log('mouseup');
    handleMouseUp(e);
});
$('#canvas').mouseout(function (e) {
    console.log('mouseout');
    handleMouseOut(e);
});
