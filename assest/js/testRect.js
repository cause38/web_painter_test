{
    const tempCanvas = document.getElementById('tempCanvas');
    let tempCtx = tempCanvas.getContext('2d');
    const copyCanvas = document.getElementById('copyCanvas');
    let copyCtx = copyCanvas.getContext('2d');

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
            initEvent() {
                isDown = false;
                $(canvas).off();
                $(canvas).on('mousedown', e => this.handleMouseMove(e));
                $(canvas).on('mouseup', e => this.handleMouseUp(e));
                $(canvas).on('mousedown', e => this.handleMouseDown(e));
                $(canvas).on('mouseout', e => this.handleMouseOut(e));
            },
            handleMouseUp(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = false;

                if (action === 'text') {
                } else if (action === 'brush') {
                } else if (action === 'blur') {
                    const blurRadius = document.getElementById('blurRadius').value;
                    tempCtx.save();
                    tempCtx.globalCompositeOperation = 'source-in';
                    tempCtx.drawImage(canvas, 0, 0);
                    tempCtx.restore();

                    copyCtx.save();
                    copyCtx.drawImage(tempCanvas, 0, 0);
                    copyCtx.restore();
                    boxBlurCanvasRGBA('copyCanvas', 0, 0, copyCanvas.width, copyCanvas.height, blurRadius, 0);

                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(copyCanvas, 0, 0);
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.drawImage(img, 0, 0);
                    ctx.restore();
                } else if (action === 'circle') {
                } else if (action === 'rect') {
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
                    if (!isDown) return;
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(mouseX, mouseY, 20, 0, PI2);
                    ctx.closePath();
                    ctx.fill();
                    tempCtx.beginPath();
                    tempCtx.arc(mouseX, mouseY, 20, 0, PI2);
                    tempCtx.closePath();
                    tempCtx.fill();
                    copyCtx.beginPath();
                    copyCtx.arc(mouseX, mouseY, 20, 0, PI2);
                    copyCtx.closePath();
                    copyCtx.fill();
                } else if (action === 'circle') {
                } else if (action === 'rect') {
                    rectCtx.strokeRect(startX, startY, mouseX - startX, mouseY - startY);
                } else if (action === 'arrow') {
                    // ctx.beginPath();
                    // drawFn.arrow(ctx, 10, 30, 200, 150);
                    // drawFn.arrow(ctx, 100, 200, 400, 50);
                    // drawFn.arrow(ctx, 200, 30, 10, 150);
                    // drawFn.arrow(ctx, 400, 200, 100, 50);
                    // ctx.stroke();
                } else if (action === 'ruler') {
                } else if (action === 'angle') {
                }
            },
            handleMouseDown(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = true;
                copyCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

                startX = parseInt(e.offsetX);
                startY = parseInt(e.offsetY);

                // if (action === 'text') {
                //     var input = document.createElement('textarea');
                //     input.id = 'textbox';
                //     input.type = 'text';
                //     input.style.position = 'fixed';
                //     input.style.left = startX + 'px';
                //     input.style.top = startY - Math.floor(e_group.size.replace('px', '') / 2) + 'px';
                //     input.style.width = '500px';
                //     input.style.opacity = '0.5';
                //     input.style.filter.opacity = '0.5';
                //     input.style.fontSize = '12px';
                //     input.style.zIndex = '2147483647';

                //     input.onkeydown = this.handleENTER;

                //     document.body.appendChild(input);

                //     input.focus();
                // }
            },
            handleMouseOut(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = false;
            },
            // handleENTER(event) {
            //     var blank_pattern = /^\s+|\s+$/g;
            //     var keyCode = event.keyCode;
            //     if (keyCode === 27) {
            //         var textList = this.value.split('\n');
            //         for (var i = 0; i < textList.length; i++) {
            //             e_group.drawText(
            //                 textList[i],
            //                 parseInt(e_group.pageX, 10),
            //                 parseInt(e_group.pageY, 10) + e_group.size.replace('px', '') * i + 5
            //             );
            //         }
            //         document.body.removeChild(this);
            //         if (this.value.replace(blank_pattern, '') != '') {
            //             e_group.saveImage = e_group.ctx.getImageData(0, 0, e_group.canvas.width, e_group.canvas.height);
            //             e_group.addHistory();
            //         }
            //         e_group.hasInput = false;
            //         e_group.textactive = false;
            //     }
            // },
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

                if (action === 'removeAll') {
                    ctx.clearRect(0, 0, _width, _height);
                    tempCtx.clearRect(0, 0, _width, _height);
                    copyCtx.clearRect(0, 0, _width, _height);
                } else {
                    action = id;
                    e.currentTarget.classList.add('on');
                    draw.initEvent(e);
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
