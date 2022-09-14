'use strict';
{
    const canvasWrap = document.getElementById('canvasWrap');
    const tempCanvas = document.getElementById('tempCanvas');
    let tempCtx = tempCanvas.getContext('2d');
    const copyCanvas = document.getElementById('copyCanvas');
    let copyCtx = copyCanvas.getContext('2d');
    const canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    let img = null,
        action = null,
        isDown = false,
        isTouch = null,
        prevTouch = null,
        _width = 0,
        _height = 0,
        mouseX = 0,
        mouseY = 0,
        startX = 0,
        startY = 0,
        drawColor = null,
        _color = {},
        canvasTop = 0;

    /* TODO:추후 불필요시 삭제 */
    let PI2 = Math.PI * 2;
    let count = 0;
    let mLog = document.querySelector('textArea');

    const draw = (() => {
        const drawFn = (() => {
            return {
                arrow(context, fromx, fromy, tox, toy) {
                    var headlen = 10; // length of head in pixels
                    var dx = tox - fromx;
                    var dy = toy - fromy;
                    var angle = Math.atan2(dy, dx);
                    context.moveTo(fromx, fromy);
                    context.lineTo(tox, toy);
                    context.lineTo(
                        tox - headlen * Math.cos(angle - Math.PI / 6),
                        toy - headlen * Math.sin(angle - Math.PI / 6)
                    );
                    context.moveTo(tox, toy);
                    context.lineTo(
                        tox - headlen * Math.cos(angle + Math.PI / 6),
                        toy - headlen * Math.sin(angle + Math.PI / 6)
                    );
                },
            };
        })();

        return {
            init() {
                isDown = false;

                this.initEvent(canvas);
                this.reset();
            },
            reset() {
                mouseX = 0;
                mouseY = 0;
                startX = 0;
                startY = 0;
                canvasTop = canvasWrap.offsetTop;
            },
            initEvent(target) {
                target.addEventListener('mousedown', e => this.handleMouseDown(e));
                target.addEventListener('mousemove', e => this.handleMouseMove(e));
                target.addEventListener('mouseup', e => this.handleMouseUp(e));
                target.addEventListener('mouseout', e => this.handleMouseOut(e));

                target.addEventListener('touchstart', e => this.handleMouseDown(e));
                target.addEventListener('touchmove', e => this.handleMouseMove(e));
                target.addEventListener('touchend', e => this.handleMouseUp(e));

                document.addEventListener('resize', () => this.reset());
            },
            handleMouseUp(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = false;
                $(mLog).append('\nend');
                $(mLog).append('\n============================');

                if (action === 'text') {
                } else if (action === 'brush') {
                } else if (action === 'blur') {
                    const blurRadius = document.getElementById('blurRadius').value;
                    ctx.closePath();
                    tempCtx.closePath();
                    copyCtx.closePath();

                    tempCtx.save();
                    tempCtx.globalCompositeOperation = 'source-in';
                    tempCtx.drawImage(img, 0, 0);
                    tempCtx.restore();

                    copyCtx.save();
                    copyCtx.drawImage(tempCanvas, 0, 0);
                    copyCtx.restore();
                    boxBlurCanvasRGBA('copyCanvas', 0, 0, _width, _height, blurRadius, 0);

                    /**
                     *
                     * 현재 로직
                     * 1. ctx 위에 사진, 흰색 브러쉬로 그림 영역 그린다
                     * 2. temp 위에 img 올려져 있음
                     * 3. ctx 위에 그려진 그림과 temp img 의 겹쳐진 부분만 temp 위에 source-in
                     * 4. copy 에 temp 그대로 가져와서 블러처리 후 ctx 위에 올림
                     *
                     * 변경 로직
                     * 
                     * rect 시작점 잡히는데
                     * brush 안잡힘;;
                     * 둘이 비교해서 brush 수정
                     *
                     */

                    ctx.save();
                    ctx.clearRect(0, 0, _width, _height);
                    ctx.drawImage(copyCanvas, 0, 0);
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.drawImage(img, 0, 0);
                    ctx.restore();
                } else if (action === 'circle') {
                } else if (action === 'rect') {
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'square';
                    ctx.fillStyle = 'transparent';
                    ctx.setLineDash([0]);
                    ctx.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
                    copyCtx.clearRect(0, 0, _width, _height);
                    copyCanvas.style.right = -9999 + 'px';
                } else if (action === 'arrow') {
                } else if (action === 'ruler') {
                } else if (action === 'angle') {
                }

                prevTouch = isTouch;
            },
            handleMouseMove(e) {
                e.preventDefault();
                e.stopPropagation();

                $(mLog).append('move ');
                drawColor = _color[action] ? _color[action] : '#ff0000';

                if (isTouch) {
                    mouseX = e.touches[0].clientX - e.target.offsetLeft;
                    mouseY = e.touches[0].clientY - canvasTop;
                } else {
                    mouseX = e.offsetX;
                    mouseY = e.offsetY;
                }

                if (action === 'text') {
                } else if (action === 'brush') {
                    ctx.fillStyle = drawColor;
                    ctx.strokeStyle = drawColor;
                    ctx.lineWidth = 3;

                    if (isTouch) {
                        ctx.beginPath();
                        ctx.moveTo(mouseX, mouseY);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.stroke();
                        ctx.closePath();
                    } else {
                        if (!isDown) {
                            ctx.beginPath();
                            ctx.moveTo(mouseX, mouseY);
                        } else {
                            ctx.lineTo(mouseX, mouseY);
                            ctx.stroke();
                        }
                    }
                } else if (action === 'blur') {
                    drawColor = '#ffffff';
                    ctx.fillStyle = ctx.strokeStyle = drawColor;
                    ctx.lineWidth = tempCtx.lineWidth = copyCtx.lineWidth = 20;
                    ctx.lineCap = tempCtx.lineCap = copyCtx.lineCap = 'round';

                    if (!isDown) {
                        ctx.beginPath();
                        ctx.moveTo(mouseX, mouseY);
                        tempCtx.beginPath();
                        tempCtx.moveTo(mouseX, mouseY);
                        copyCtx.beginPath();
                        copyCtx.moveTo(mouseX, mouseY);
                    } else {
                        ctx.lineTo(mouseX, mouseY);
                        ctx.stroke();
                        tempCtx.lineTo(mouseX, mouseY);
                        tempCtx.stroke();
                        copyCtx.lineTo(mouseX, mouseY);
                        copyCtx.stroke();
                    }
                } else if (action === 'circle') {
                } else if (action === 'rect') {
                    if (isDown) {
                        copyCtx.lineWidth = 3;
                        copyCtx.lineCap = 'square';
                        copyCtx.fillStyle = 'transparent';
                        copyCtx.setLineDash([6]);
                        copyCtx.clearRect(0, 0, _width, _height);
                        copyCtx.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
                    }
                } else if (action === 'arrow') {
                } else if (action === 'ruler') {
                } else if (action === 'angle') {
                }
            },
            handleMouseDown(e) {
                e.preventDefault();
                e.stopPropagation();

                // $(mLog).append('\nstart');
                isDown = true;
                isTouch = e.sourceCapabilities.firesTouchEvents;
                const sameEvent = isTouch === prevTouch;
                if (prevTouch && !sameEvent) this.reset();

                copyCtx.clearRect(0, 0, _width, _height);

                if (isTouch) {
                    startX = e.touches[0].clientX - e.target.offsetLeft;
                    startY = e.touches[0].clientY - canvasTop;
                } else {
                    startX = e.offsetX;
                    startY = e.offsetY;
                }

                if (action === 'rect') {
                    copyCanvas.style.right = 0;
                }
            },
            handleMouseOut(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = false;
            },
        };
    })();

    draw.init();

    const view = (() => {
        const drawToolWrap = document.getElementById('drawToolWrap');
        const downloadBtn = document.getElementById('downloadBtn');

        return {
            init() {
                this.setImg();
                this.initEvent();
                this.setColorPicker();
            },
            initEvent() {
                $(drawToolWrap).on('click', 'button', e => this.changTool(e));
                downloadBtn.addEventListener('click', () => this.downloadImg());
            },
            setImg() {
                img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    _width = img.width;
                    _height = img.height;
                    canvas.width = tempCanvas.width = copyCanvas.width = _width;
                    canvas.height = tempCanvas.height = copyCanvas.height = _height;
                    ctx.drawImage(img, 0, 0);
                    ctx.save();
                };
                img.src = '/assest/img/test.jpg';
            },
            setColorPicker() {
                const item = document.querySelectorAll('.color-picker');

                item.forEach(el => {
                    const id = el.getAttribute('data-id');

                    $(el).spectrum({
                        type: 'color',
                        showPaletteOnly: true,
                        togglePaletteOnly: true,
                        hideAfterPaletteSelect: true,
                        showInput: true,
                        showInitial: true,
                        change: color => {
                            _color[id] = color.toHexString();
                        },
                    });
                });
            },
            changTool(e) {
                e.preventDefault();
                e.stopPropagation();

                const id = e.currentTarget.getAttribute('data-id');
                const onButton = document.querySelector('button[class="on"]');
                if (onButton) onButton.classList.remove('on');

                if (id === 'removeAll') {
                    if (confirm('삭제 시 복구가 불가능합니다. \n정말 삭제하시겠습니까?')) {
                        ctx.clearRect(0, 0, _width, _height);
                        tempCtx.clearRect(0, 0, _width, _height);
                        ctx.drawImage(img, 0, 0);
                    }
                } else {
                    if (id === 'rect') {
                        copyCanvas.style.right = 0;
                    } else {
                        copyCanvas.style.right = -9999 + 'px';
                    }

                    action = id;
                    e.currentTarget.classList.add('on');
                }
            },
            downloadImg() {
                const imageData = canvas.toDataURL('image/png');
                const anchorTag = document.createElement('a');
                document.body.appendChild(anchorTag);
                anchorTag.href = imageData;
                anchorTag.download = 'image';
                anchorTag.click();
                document.body.removeChild(anchorTag);
            },
        };
    })();

    view.init();
}
