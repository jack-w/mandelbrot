$(document).ready(function(){
    var canvas = document.getElementById('canvas');
    var c;
    var cwidth;
    var cheight;
    var id;
    var d;
    var iterations = 1000, it0 = 50;
    var redraw;
    var rl=-2,ru=2, il=-2,iu=2;
    var trl,tru, til,tiu;
    var mouseZoom = {x0:0, y0:0, x:100, y:100, dx:0, dy:0, down:false, zoom:1, origSize:(ru-rl)*(iu-il)};

    iterations = $('#iter').val();
    cwidth = canvas.width;
    cheight = canvas.height;
    c = canvas.getContext('2d');
    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mouseup", doMouseUp, false);
    canvas.addEventListener("mousemove", doMouseMove, false);
//    c.beginPath();
//    c.rect(100,50,10, 10);
//    var col = 1000;
//    c.fillStyle = "hsl("+col+", 100%,50%)";
//    c.fill();
    $('#redraw').click(function(){
        iterations = $('#iter').val();
        c.clearRect(0,0,cwidth, cheight);
        fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
        colorMap = setColorMap(iterations);
        drawFractal(c,fractalMap, colorMap,cwidth,cheight);
    });
    
    
    
    
    
    
    
    function doMouseDown(event) {
        mouseZoom.down = true;
        mouseZoom.x0 = event.pageX-canvas.offsetLeft;
        mouseZoom.y0 = event.pageY-canvas.offsetTop;
  //      alert([mouseZoom.x0,mouseZoom.y0]);
    }
    function doMouseUp(event) {
        var tmp;
        mouseZoom.x = event.pageX-canvas.offsetLeft;
        mouseZoom.y = event.pageY-canvas.offsetTop;
        if (mouseZoom.x0 > mouseZoom.x) {
            tmp = mouseZoom.x0;
            mouseZoom.x0 = mouseZoom.x;
            mouseZoom.x = tmp;
        }
        if (mouseZoom.y0 > mouseZoom.y) {
            tmp = mouseZoom.y0;
            mouseZoom.y0 = mouseZoom.y;
            mouseZoom.y = tmp;
        }
        if (mouseZoom.down == true) {
            var dx = mouseZoom.x - mouseZoom.x0;
            var dy = mouseZoom.y - mouseZoom.y0;
            var tdx=dx, tdy=dy;
//            alert([dx,dy])
            if (dy/dx < cheight/cwidth) {
                dy = dx * cheight/cwidth;
                mouseZoom.y0 -= Math.abs(dy - tdy)/2;
                mouseZoom.y += Math.abs(dy - tdy)/2;
            }
            else {
                dx = dy * cwidth/cheight;
                mouseZoom.x0 -= Math.abs(dx - tdx)/2;
                mouseZoom.x += Math.abs(dx - tdx)/2;
            }
//            alert([mouseZoom.x-mouseZoom.x0, mouseZoom.y-mouseZoom.y0]);
            mouseZoom.dx = Math.abs(mouseZoom.x - mouseZoom.x0);
            mouseZoom.dy = Math.abs(mouseZoom.y - mouseZoom.y0);
            trl = rl;
            tru = ru;
            til = il;
            tiu = iu;

            rl += (tru-trl)*(mouseZoom.x0/cwidth);
            ru -= (tru-trl)*(1-mouseZoom.x/cwidth);
            il += (tiu-til)*(mouseZoom.y0/cheight);
            iu -= (tiu-til)*(1-mouseZoom.y/cheight);
            mouseZoom.zoom = mouseZoom.origSize / ((ru-rl)*(iu-il));
            $('#iter').val(Math.floor(10*Math.log(mouseZoom.zoom)+30));
            iterations = $('#iter').val();
            c.clearRect(0,0,cwidth, cheight);
            fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
            colorMap = setColorMap(iterations);
            drawFractal(c,fractalMap, colorMap,cwidth,cheight);
        }
        mouseZoom.down = false;
    }
    function doMouseMove(event) {
        mouseZoom.x = event.pageX-canvas.offsetLeft;
        mouseZoom.y = event.pageY-canvas.offsetTop;
        if (mouseZoom.down == true) {
            canvas.style.cursor="crosshair";
            c.clearRect(0,0,cwidth, cheight);
            drawFractal(c,fractalMap, colorMap,cwidth,cheight);
            c.beginPath();
            c.rect(mouseZoom.x0, mouseZoom.y0, mouseZoom.x-mouseZoom.x0, mouseZoom.y-mouseZoom.y0);
            c.lineWidth = 0.5;
            c.strokeStyle = 'red';
            c.stroke();
        }
    }
    function mandelbrot(ar, ai, maxcount) {
        var threshhold = 4;
        var zr = ar;
        var zi = ai;
        var tmpr;
        var i;
        for (i = 0; i < maxcount; i++) {
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + ar;
            zi = 2*tmpr*zi + ai;
            if (zr*zr + zi*zi > threshhold) {
                break;
            }
        }
        return i;
    }
    function setPixel(imageData, x, y, r,g,b,a) {
        index = (x + y * imageData.width) * 4;
        imageData.data[index+0] = r;
        imageData.data[index+1] = g;
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
    }
    function setColorMap(max) {
        var map = new Array(max+1);
        for (var i = 0; i < max; i++){
           map[i] = [((max-i)/max)*255,((max-i)/max)*255,((max-i)/max)*255,255];
        }
        map[max] = [0,0,0,255];
        return map;
    }
    function setColorMap2(max) {
        var map = new Array(max+1);
        for (var i = 0; i < max; i++){
           map[i] = "rgba("+255+","+255+","+255+","+255+");";
        }
        map[max] = "rgba("+0+","+0+","+0+","+255+")";
        return map;
    }
    function getFractal(width, height, rl,ru,il,iu) {
        var r,i;
        var properRatio;
        var improperRatio;
        var rdiff = ru - rl;
        var idiff = iu - il;
        var fractalMap = new Array(width*height);

        properRatio = height / width;
        improperRatio = idiff / rdiff;
        if (properRatio > improperRatio) {
            il -= Math.abs(properRatio*rdiff-idiff)/2;
            iu += Math.abs(properRatio*rdiff-idiff)/2;
            idiff = properRatio * rdiff;
        }
        else {
            rl -= Math.abs(idiff/properRatio-rdiff)/2;
            ru += Math.abs(idiff/properRatio-rdiff)/2;
            rdiff = idiff / properRatio;
        }
        for (var y = 0; y < height; y++){
            i = il + (idiff*y)/height;
            for (var x = 0; x < width; x++){
                r = rl + (rdiff*x)/width;
                fractalMap[x+y*width] = mandelbrot(r,i, iterations);
            }
        }
        return fractalMap;
    }
    function drawFractal(c,fractalMap,colorMap,w,h) {
        var image = c.createImageData(w,h);
        var arr = new Array(4);
        var r,g,b,a;
        for (var i = 0; i < h; i ++) {
            for (var j = 0; j < w; j ++) {
                arr = colorMap[fractalMap[j+i*w]];
                r = arr[0];
                g = arr[1];
                b = arr[2];
                a = arr[3];
                setPixel(image,j,i,r,g,b,a);
            }
        }
        c.putImageData(image,0,0);
    }
    function drawFractal2(c,fractalMap,colorMap,w,h) {
        for (var i = 0; i < h; i ++) {
            for (var j = 0; j < w; j ++) {
        c.beginPath();
                c.rect(j,i,1,1);
                c.fillStyle = colorMap[fractalMap[j+i*w]];
                c.fill();
            }
        }
    }
//    id = c.createImageData(cwidth,cheight);
//    for (var i = 0; i < 200; i++){
//        setPixel(id,i,0,[i%255, 200,0,250]);
//        setPixel(id,i,1,[i%255, 200,0,250]);
//        setPixel(id,i,2,[i%255, 200,0,250]);
//        setPixel(id,i,3,[i%255, 200,0,250]);
//        setPixel(id,i,4,[i%255, 200,0,250]);
//        setPixel(id,i,5,[i%255, 200,0,250]);
//        setPixel(id,i,6,[i%255, 200,0,250]);
//        setPixel(id,i,7,[i%255, 200,0,250]);
//        setPixel(id,i,8,[i%255, 200,0,250]);
//        setPixel(id,i,9,[i%255, 200,0,250]);
//        setPixel(id,i,10,[i%255, 200,0,250]);
//    }
//    fractalMap = getFractal(cwidth, cheight,-1.5,-1.1,-0.1,0.1);
//    colorMap = setColorMap(iterations);
//    drawFractal(c,fractalMap, colorMap,cwidth,cheight);
    
//    c.putImageData(id, 0,0);
})
