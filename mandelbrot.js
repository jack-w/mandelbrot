$(document).ready(function(){
    var canvas = document.getElementById('canvas');
    var c;
    var cwidth;
    var cheight;
    var id;
    var d;
    var iterations = 1000;


    cwidth = canvas.width;
    cheight = canvas.height;
    c = canvas.getContext('2d');
//    c.beginPath();
//    c.rect(100,50,10, 10);
//    var col = 1000;
//    c.fillStyle = "hsl("+col+", 100%,50%)";
//    c.fill();
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
           map[i] = [255,255,255,255];
        }
        map[max] = [0,0,0,255];
        return map;
    }
    function getFractal(width, height, rl,ru,il,iu) {
        var r,i;
        var rdiff = ru - rl;
        var idiff = iu - il;
        var fractalMap = new Array(width*height);
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
//        alert(fractalMap[500]+","+colorMap[fractalMap[500]])
//        arr = colorMap[fractalMap[500]];
//        setPixel(image,10,10,arr[0],arr[1],arr[2],arr[3]);
//        alert(fractalMap[500]+","+colorMap[fractalMap[500]])
        for (var i = 0; i < h; i ++) {
            for (var j = 0; j < w; j ++) {
//                alert(fractalMap[j+i*w]);
                arr = colorMap[fractalMap[j+i*w]];
//                alert(arr[0]);
                r = arr[0];
                g = arr[1];
                b = arr[2];
                a = arr[3];
//                alert(r[0]+","+r[1])
                setPixel(image,i,j,r,g,b,a);
            }
        }
        c.putImageData(image,0,0);
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
    fractalMap = getFractal(cwidth, cheight,-2,1,-1,1);
    colorMap = setColorMap(iterations);
//    alert(colorMap[29][3]);
    drawFractal(c,fractalMap, colorMap,cwidth,cheight);
    
//    c.putImageData(id, 0,0);
})
