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
    var history = [];
    var counter = 0;
    var auto = true;
    var mouse = {x0:0, y0:0, x:100, y:100, dx:0, dy:0, down:false, zoom:1, origSize:(ru-rl)*(iu-il)};
    var functions = [];
    var n = 3;
    var jr = 0.4;
    var ji = 0.18;
    var fType = "mandelbrot";

    functions["mandelbrot"] = mandelbrot;
    functions["nMandelbrot"] = nMandelbrot;
    functions["julia"] = julia;
    functions["nJulia"] = nJulia;

    cwidth = canvas.width;
    cheight = canvas.height;
    c = canvas.getContext('2d');

    iterations = $('#iter').val();
    c.clearRect(0,0,cwidth, cheight);
    fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
    colorMap = setColorMap(iterations);
    drawFractal(c,fractalMap, colorMap,cwidth,cheight);

    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mouseup", doMouseUp, false);
    canvas.addEventListener("mousemove", doMouseMove, false);
    canvas.addEventListener("mouseout", doMouseOut, false);




//    c.beginPath();
//    c.rect(100,50,10, 10);
//    var col = 1000;
//    c.fillStyle = "hsl("+col+", 100%,50%)";
//    c.fill();
    $('#redraw').click(function(){
        readIterations();
        c.clearRect(0,0,cwidth, cheight);
        fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
        colorMap = setColorMap(iterations);
        drawFractal(c,fractalMap, colorMap,cwidth,cheight);
    });
    $('#reset').click(function(){
        mouse.zoom = 1;
        counter = 0;
        if (fType == 'mandelbrot') {
            rl = -2;
            ru = 1;
            il = -2;
            iu = 2;
        }
        if (fType == 'nMandelbrot') {
            rl = -2;
            ru = 2;
            il = -2;
            iu = 2;
        }
        if (fType == 'julia') {
            rl = -2;
            ru = 2;
            il = -2;
            iu = 2;
        }
        if (fType == 'nJulia') {
            rl = -2;
            ru = 2;
            il = -2;
            iu = 2;
        }
        readIterations();
        c.clearRect(0,0,cwidth, cheight);
        fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
        colorMap = setColorMap(iterations);
        drawFractal(c,fractalMap, colorMap,cwidth,cheight);
    });
    $('#back').click(function(){
        if (counter > 0) {
            counter--;
//                alert([counter,history[counter].rl,history[counter].ru,history[counter].iter]);
            rl = history[counter].rl;
            ru = history[counter].ru;
            il = history[counter].il;
            iu = history[counter].iu;
            iterations = history[counter].iter;
            mouse.zoom = history[counter].zoom;
            $('#iter').val(iterations);
            c.clearRect(0,0,cwidth, cheight);
            fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
            colorMap = setColorMap(iterations);
            drawFractal(c,fractalMap, colorMap,cwidth,cheight);
            
        }
    });
    $('#forward').click(function(){
        if (counter+1 < history.length) {
            counter++;
//                alert([counter,history[counter].rl,history[counter].ru,history[counter].iter]);
            rl = history[counter].rl;
            ru = history[counter].ru;
            il = history[counter].il;
            iu = history[counter].iu;
            iterations = history[counter].iter;
            mouse.zoom = history[counter].zoom;
            $('#iter').val(iterations);
            c.clearRect(0,0,cwidth, cheight);
            fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
            colorMap = setColorMap(iterations);
            drawFractal(c,fractalMap, colorMap,cwidth,cheight);
            
        }
    });

    $('#auto').click(function(){
        auto = true;
    });
    $('#man').click(function(){
        auto = false;
    });
    
   
    $('#ftype').click(function(){
        var t = $('#ftype').val();
        var str = ''
        $('#frac').empty();
        counter = 0;
        if (t == 'mandelbrot') {
            rl = -2;
            ru = 1;
            il = -1;
            iu = 1;
        }
        if (t == 'nMandelbrot') {
            rl = -2;
            ru = 2;
            il = -2;
            iu = 2;
            str += 'n: ';
            str += '<input type="number" id="expon" value="2"/>'
            $('#frac').append(str);
        }
        if (t == 'julia') {
            rl = -2;
            ru = 2;
            il = -2;
            iu = 2;
            str += 'Re(j): ';
            str += '<input type="number" id="jr" value="-1"/>';
            str += 'Im(j): ';
            str += '<input type="number" id="ji" value="0"/>';
            $('#frac').append(str);
        }
        if (t == 'nJulia') {
            rl = -2;
            ru = 2;
            il = -2;
            iu = 2;
            str += 'n: ';
            str += '<input type="number" id="expon" value="2"/>';
            str += 'Re(j): ';
            str += '<input type="number" id="jr" value="-1"/>';
            str += 'Im(j): ';
            str += '<input type="number" id="ji" value="0"/>';
            $('#frac').append(str);
        }
//        $('<ul><li> iuanert </li> </ul>').appendTo('#frac');
    
    });
    
    
    
    function readIterations() {
        if (auto == true) {
            iterations = Math.floor(10*Math.log(mouse.zoom)+30);
            $('#iter').val(iterations);
        }
        else {
            iterations = $('#iter').val();
        }
    }
    
    function doMouseOut(event) {
        mouse.down = false;
        c.clearRect(0,0,cwidth, cheight);
        drawFractal(c,fractalMap, colorMap,cwidth,cheight);
    }
    function doMouseDown(event) {
        mouse.down = true;
        mouse.x0 = event.pageX-canvas.offsetLeft;
        mouse.y0 = event.pageY-canvas.offsetTop;
//        alert([mouse.x0,mouse.y0]);
    }
    function doMouseUp(event) {
        var tmp;
        mouse.x = event.pageX-canvas.offsetLeft;
        mouse.y = event.pageY-canvas.offsetTop;
        if (mouse.x0 > mouse.x) {
            tmp = mouse.x0;
            mouse.x0 = mouse.x;
            mouse.x = tmp;
        }
        if (mouse.y0 > mouse.y) {
            tmp = mouse.y0;
            mouse.y0 = mouse.y;
            mouse.y = tmp;
        }
        if (mouse.down == true) {
            var dx = mouse.x - mouse.x0;
            var dy = mouse.y - mouse.y0;
            var tdx=dx, tdy=dy;
//            alert([dx,dy])
            if (dy/dx < cheight/cwidth) {
                dy = dx * cheight/cwidth;
                mouse.y0 -= Math.abs(dy - tdy)/2;
                mouse.y += Math.abs(dy - tdy)/2;
            }
            else {
                dx = dy * cwidth/cheight;
                mouse.x0 -= Math.abs(dx - tdx)/2;
                mouse.x += Math.abs(dx - tdx)/2;
            }
//            alert([mouse.x, mouse.y]);
            mouse.dx = Math.abs(mouse.x - mouse.x0);
            mouse.dy = Math.abs(mouse.y - mouse.y0);
            if (mouse.dx > 0 && mouse.dy > 0) {
//                history[counter] = {rl:rl,ru:ru,il:il,iu:iu,iter:iterations};
 //               alert([counter,history[counter].rl,history[counter].ru,history[counter].iter]);
                counter++;
                trl = rl;
                tru = ru;
                til = il;
                tiu = iu;

                rl += (tru-trl)*(mouse.x0/cwidth);
                ru -= (tru-trl)*(1-mouse.x/cwidth);
                il += (tiu-til)*(mouse.y0/cheight);
                iu -= (tiu-til)*(1-mouse.y/cheight);
                mouse.zoom = mouse.origSize / ((ru-rl)*(iu-il));
                readIterations();
                c.clearRect(0,0,cwidth, cheight);
                fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
                colorMap = setColorMap(iterations);
                drawFractal(c,fractalMap, colorMap,cwidth,cheight);
            }
        }
        mouse.down = false;
    }
    function doMouseMove(event) {
        mouse.x = event.pageX-canvas.offsetLeft;
        mouse.y = event.pageY-canvas.offsetTop;
        mouse.dx = (mouse.x-mouse.x0);
        mouse.dy = (mouse.y-mouse.y0);
        if (mouse.down == true) {
            canvas.style.cursor="crosshair";
            c.clearRect(0,0,cwidth, cheight);
            drawFractal(c,fractalMap, colorMap,cwidth,cheight);
            c.beginPath();
            c.rect(mouse.x0, mouse.y0, mouse.dx, mouse.dy);
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
    function nMandelbrot(ar,ai,maxcount) {
        var threshhold = Math.pow(2,2/(n-1));
        var z = [];
        z[0] = ar;
        z[1] = ai;
        
        for (i = 0; i < maxcount; i++) {
            z = raise(z[0],z[1],n);
            z[0] += ar;
            z[1] += ai;
            if (z[0]*z[0] + z[1]*z[1] > threshhold) {
                break;
            }
        }
        return i;
    }
    function julia(ar,ai,maxcount) {
        var threshhold = 4;
        var zr = ar;
        var zi = ai;
        var tmpr;
        var i;
        for (i = 0; i < maxcount; i++) {
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + jr;
            zi = 2*tmpr*zi + ji;
            if (zr*zr + zi*zi > threshhold) {
                break;
            }
        }
        return i;
    }
    function nJulia(ar,ai,maxcount) {
        var threshhold = Math.pow(2,2/(n-1));
        var z = [];
        z[0] = ar;
        z[1] = ai;
        
        for (i = 0; i < maxcount; i++) {
            z = raise(z[0],z[1],n);
            z[0] += jr;
            z[1] += ji;
            if (z[0]*z[0] + z[1]*z[1] > threshhold) {
                break;
            }
        }
        return i;
    }
    function raise(zr,zi,n) {
        var r = zr*zr + zi*zi;
        var p = Math.atan2(zi,zr);

        r = Math.pow(r,n/2);
        p = (n*p);

        return [r*Math.cos(p),r*Math.sin(p)];
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
        var rdiff = Math.abs(ru - rl);
        var idiff = Math.abs(iu - il);
        var fractalMap = new Array(width*height);

        history[counter] = {rl:rl,ru:ru,il:il,iu:iu,iter:iterations,zoom:mouse.zoom};
        //alert([rl,ru,il,iu]);

        fType = $('#ftype').val();;
        if (fType == 'nMandelbrot') {
            n = 1*$('#expon').val();
        }
        if (fType == 'julia') {
            jr = 1*$('#jr').val();
            ji = 1*$('#ji').val();
        }
        if (fType == 'nJulia') {
            n = 1*$('#expon').val();
            jr = 1*$('#jr').val();
            ji = 1*$('#ji').val();
        }

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
                fractalMap[x+y*width] = functions[fType](r,i, iterations);
            }
        }
        return fractalMap;
    }
    function drawFractal(c,fractalMap,colorMap,w,h) {
        var image = c.createImageData(w,h);
        var arr = new Array(4);
        var r,g,b,a;
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
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
