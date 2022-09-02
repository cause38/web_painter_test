<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>야누스 테스트</title>
    <link rel="stylesheet" href="/assest/css/reset.css">
    <link rel="stylesheet" href="/assest/css/main.css">
    <link rel="stylesheet" href="/assest/css/spectrum.min.css">
</head>

<body class="flex-center">
    <h1>JANUS</h1>
    <div class="wrap btn-wrap">
        <button id="downloadBtn" type="button">다운로드</button>
    </div>
    <div class="wrap wrap-box">
        <nav id="drawToolWrap" class="draw-wrap">
            <ul>
                <li>
                    <button type="button" data-id="text">T</button>
                    <input class="color-picker" data-id="text" value='#ff0000' />
                </li>
            </ul>
            <ul>
                <li>
                    <button type="button" data-id="brush">🖌</button>
                    <input class="color-picker" data-id="brush" value='#ff0000' />
                    <select id="brushSize">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </li>
            </ul>
            <ul>
                <li>
                    <button type="button" data-id="blur">🧪</button>
                    <select id="blurRadius">
                        <option value="5">10</option>
                        <option value="6">25</option>
                        <option value="10">50</option>
                        <option value="15">75</option>
                        <option value="20">100</option>
                    </select>
                </li>
            </ul>
            <ul>
                <li><button type="button" data-id="circle">⚪</button></li>
                <li><button type="button" data-id="rect">⬜</button></li>
                <li><button type="button" data-id="arrow"> ➡ </button></li>
                <li><button type="button" data-id="ruler">📏</button></li>
                <li><button type="button" data-id="angle">📐</button></li>
            </ul>
            <ul>
                <!-- <li><button type="button" data-id="prev"></button></li>
                <li><button type="button" data-id="next"></button></li> -->
                <li><button type="button" data-id="removeAll">🗑</button></li>
            </ul>
        </nav>
    </div>
    <div class="wrap wrap-box">
        <div id="canvasWrap" class="canvas-wrap flex-center">
            <canvas id="canvas"></canvas>
            <canvas id="tempCanvas" class="hidden"></canvas>
        </div>
    </div>
    <canvas id="copyCanvas" class="hidden"></canvas>



    <!-- script -->
    <script src="/assest/js/jquery-3.5.1.min.js" defer></script>
    <script src="https://kit.fontawesome.com/e8137f8867.js" crossorigin="anonymous"></script>
    <script src="/assest/js/spectrum.min.js" defer></script>
    <script src="/assest/js/canvasFastBoxBlur.js" defer></script>

    <!-- custom -->
    <script src="/assest/js/main.js" defer></script>
</body>

</html>