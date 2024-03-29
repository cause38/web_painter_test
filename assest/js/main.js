{
    const tempCanvas = document.getElementById('tempCanvas');
    let tempCtx = tempCanvas.getContext('2d');
    const copyCanvas = document.getElementById('copyCanvas');
    let copyCtx = copyCanvas.getContext('2d');

    const $canvas = $('#canvas');
    const canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    let img = null,
        isDown = false,
        _width = 0,
        _height = 0,
        mouseX = 0,
        mouseY = 0,
        startX = 0,
        startY = 0,
        drawColor = null,
        _color = {},
        action = null,
        PI2 = Math.PI * 2;

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
            initEvent(id) {
                isDown = false;
                canvas.onmousemove = e => this.handleMouseMove(e);
                canvas.onmouseup = e => this.handleMouseUp(e);
                canvas.onmousedown = e => this.handleMouseDown(e);
                canvas.onmouseout = e => this.handleMouseOut(e);
            },
            handleMouseUp(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = false;

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

                    ctx.save();
                    ctx.clearRect(0, 0, _width, _height);
                    ctx.drawImage(copyCanvas, 0, 0);
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.drawImage(img, 0, 0);
                    ctx.restore();
                } else if (action === 'circle') {
                } else if (action === 'rect') {
                    ctx.setLineDash(0);
                    ctx.clearRect(0, 0, mouseX - startX, mouseY - startY);
                    ctx.drawImage(img, 0, 0);
                    ctx.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
                } else if (action === 'arrow') {
                } else if (action === 'ruler') {
                } else if (action === 'angle') {
                }
            },
            handleMouseMove(e) {
                e.preventDefault();
                e.stopPropagation();

                mouseX = parseInt(e.offsetX);
                mouseY = parseInt(e.offsetY);
                drawColor = _color[action] ? _color[action] : '#ff0000';

                if (action === 'text') {
                } else if (action === 'brush') {
                    ctx.fillStyle = drawColor;
                    ctx.strokeStyle = drawColor;

                    if (!isDown) {
                        ctx.beginPath();
                        ctx.moveTo(mouseX, mouseY);
                    } else {
                        ctx.lineTo(mouseX, mouseY);
                        ctx.stroke();
                    }
                } else if (action === 'blur') {
                    drawColor = '#ffffff';
                    ctx.fillStyle = drawColor;
                    ctx.strokeStyle = drawColor;
                    ctx.lineWidth = 20;
                    tempCtx.lineWidth = 20;
                    copyCtx.lineWidth = 20;
                    ctx.lineCap = 'round';
                    tempCtx.lineCap = 'round';
                    copyCtx.lineCap = 'round';

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
                copyCtx.clearRect(0, 0, _width, _height);
                isDown = true;

                startX = e.offsetX;
                startY = e.offsetY;

                if (action === 'rect') {
                    copy;
                }
            },
            handleMouseOut(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = false;
            },
        };
    })();

    draw.initEvent();

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
