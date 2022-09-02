{
    const tempCanvas = document.getElementById('tempCanvas');
    let tempCtx = tempCanvas.getContext('2d');
    const copyCanvas = document.getElementById('copyCanvas');
    let copyCtx = copyCanvas.getContext('2d');

    const $canvas = $('#canvas');
    const canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    let img;

    const draw = (() => {
        let canvasOffset = $canvas.offset();
        let offsetX = canvasOffset.left;
        let offsetY = canvasOffset.top;
        let isDown = false;
        let PI2 = Math.PI * 2;

        return {
            initEvent(id) {
                isDown = false;
                $canvas.off();
                $canvas.on('mousedown', e => this.handleMouseDown(e));
                $canvas.on('mousemove', e => this.handleMouseMove(e, id));
                $canvas.on('mouseup', e => this.handleMouseUp(e, id));
                $canvas.on('mouseout', e => this.handleMouseOut(e));
            },
            handleMouseUp(e, id) {
                e.preventDefault();
                e.stopPropagation();
                isDown = false;

                if (id === 'text') {
                } else if (id === 'brush') {
                } else if (id === 'blur') {
                    const blurRadius = document.getElementById('blurRadius').value;
                    tempCtx.save();
                    tempCtx.globalCompositeOperation = 'source-in';
                    tempCtx.drawImage(img, 0, 0);
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
                } else if (id === 'circle') {
                } else if (id === 'rect') {
                } else if (id === 'arrow') {
                } else if (id === 'ruler') {
                } else if (id === 'angle') {
                }
            },
            handleMouseMove(e, id) {
                e.preventDefault();
                e.stopPropagation();
                if (!isDown) return;
                mouseX = parseInt(e.clientX - offsetX);
                mouseY = parseInt(e.clientY - offsetY);
                // console.log(`mouseX => ${mouseX}`);
                // console.log(`mouseY => ${mouseY}`);
                // console.log(`clientX => ${e.clientX}`);
                // console.log(`clientY => ${e.clientY}`);
                // console.log(`offsetX => ${offsetX}`);
                // console.log(`offsetY => ${offsetY}`);

                if (id === 'text') {
                } else if (id === 'brush') {
                } else if (id === 'blur') {
                    ctx.beginPath();
                    ctx.arc(mouseX, mouseY, 20, 0, PI2);
                    ctx.closePath();
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    tempCtx.beginPath();
                    tempCtx.arc(mouseX, mouseY, 20, 0, PI2);
                    tempCtx.closePath();
                    tempCtx.fill();
                    copyCtx.beginPath();
                    copyCtx.arc(mouseX, mouseY, 20, 0, PI2);
                    copyCtx.closePath();
                    copyCtx.fill();
                } else if (id === 'circle') {
                } else if (id === 'rect') {
                } else if (id === 'arrow') {
                } else if (id === 'ruler') {
                } else if (id === 'angle') {
                }
            },
            handleMouseDown(e) {
                e.preventDefault();
                e.stopPropagation();
                // 새로 그릴 때 마다 cavase 초기화
                copyCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                isDown = true;
            },
            handleMouseOut(e) {
                e.preventDefault();
                e.stopPropagation();
                isDown = false;
            },
        };
    })();

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
                    canvas.width = tempCanvas.width = copyCanvas.width = img.width;
                    canvas.height = tempCanvas.height = copyCanvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                };
                img.src = '/assest/img/test.jpg';
            },
            setColorPicker() {
                $('.color-picker').spectrum({
                    type: 'color',
                    showPaletteOnly: true,
                    togglePaletteOnly: true,
                    hideAfterPaletteSelect: true,
                    showInput: true,
                    showInitial: true,
                });
            },
            changTool(e) {
                e.preventDefault();
                e.stopPropagation();

                const id = e.currentTarget.getAttribute('data-id');
                const onButton = document.querySelector('button[class="on"]');
                if (onButton) onButton.classList.remove('on');

                if (id === 'removeAll') {
                    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                    draw.handleMouseUp(e);
                } else {
                    e.currentTarget.classList.add('on');
                    draw.initEvent(id);
                }
            },
            downloadImg() {
                const imageData = canvas.toDataURL('image/png');
                const anchorTag = document.createElement('a');
                document.body.appendChild(anchorTag);
                anchorTag.href = imageData;
                anchorTag.download = 'imageData';
                anchorTag.click();
                document.body.removeChild(anchorTag);
            },
        };
    })();

    view.init();
}
