$(document).ready(function(){
    var canvas = document.getElementById('canvas');
    var c;
    var cwidth;
    var cheight;
    var id;
    var d;


    cwidth = canvas.width;
    cheight = canvas.height;
    c = canvas.getContext('2d');
    c.beginPath();
    c.rect(100,50,10, 10);
    var col = 1000;
    c.fillStyle = "hsl("+col+", 100%,50%)";
    c.fill();
    function mandelbrot(ar, ai) {
        var maxcount = 30;
        var threshhold = 4;
        var zr = ar;
        var zi = ai;
        var tmpr;
        for (var i = 0; i < maxcount; i++) {
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + ar;
            zi = 2*tmpr*zi + ai;
            if (zr*zr + zi*zi > threshhold) {
                break;
            }
        }
        return i;
    }
    function setColor(n, max) {
        return 0;
    }
    function drawFractal( ) {
        for (var i = 0, h = cheight; i < h; i ++) {
            for (var j = 0, w = cwidth; j < w; j ++) {
                setColor(j,i);
            }
        }
    }
   // id = c.createImageData(100,100);
   // d = id.data;
   // d[0] = 0;
   // d[1] = 0;
   // d[2] = 0;
   // d[3] = 0;

    //c.putImageData(id, 5,5);
})
