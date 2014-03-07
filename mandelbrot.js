$(document).ready(function(){
    var canvas = document.getElementById('canvas');
    var c;
    var image;
    var cwidth;
    var cheight;
    var id;
    var d;
    var iterations = 1000, it0 = 50;
    var rl=-2,ru=2, il=-2,iu=2;
    var trl,tru, til,tiu;
    var history = [];
    var counter = 0;
    var auto = true;
    var mouse = {x0:0, y0:0, x:100, y:100, dx:0, dy:0, down:false, zoom:1, origSize:(ru-rl)};
    var tmpMousePos;
    var functions = [];
    var colors = [];
    var n = 3;
    var jr = 0.4;
    var ji = 0.18;
    var fType = "mandelbrot";
    var cType = "mSetGrey"

    functions["mandelbrot"] = mandelbrot;
    functions["nMandelbrot"] = nMandelbrot;
    functions["julia"] = julia;
    functions["nJulia"] = nJulia;

    colors["mSetGrey"] = mSetGrey;
    colors["nMSetGrey"] = nMSetGrey;
    colors["jSetGrey"] = jSetGrey;
    colors["nJSetGrey"] = nJSetGrey;

    cwidth = canvas.width;
    cheight = canvas.height;
    c = canvas.getContext('2d');

    reset();

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
        drawFractal(c,fractalMap, cwidth,cheight);
    });
    $('#reset').click(function(){reset();});
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
            drawFractal(c,fractalMap, cwidth,cheight);
            
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
            drawFractal(c,fractalMap, cwidth,cheight);
            
        }
    });

    $('#auto').click(function(){
        auto = true;
    });
    $('#man').click(function(){
        auto = false;
    });
    
   
    $('#ftype').click(function(){
        fType = $('#ftype').val();
        var str = ''
        $('#frac').empty();
        counter = 0;
        if (fType == 'mandelbrot') {
            cType = 'mSetGrey';
        }
        if (fType == 'nMandelbrot') {
            cType = 'nMSetGrey';
            str += 'n: ';
            str += '<input type="number" id="expon" value="3"/>'
            $('#frac').append(str);
        }
        if (fType == 'julia') {
            cType = 'jSetGrey';
            str += 'Re(j): ';
            str += '<input type="number" id="jr" value="-0.7"/>';
            str += 'Im(j): ';
            str += '<input type="number" id="ji" value="0.2"/>';
            $('#frac').append(str);
        }
        if (fType == 'nJulia') {
            cType = 'nJSetGrey';
            str += 'n: ';
            str += '<input type="number" id="expon" value="3"/>';
            str += 'Re(j): ';
            str += '<input type="number" id="jr" value="-0.6"/>';
            str += 'Im(j): ';
            str += '<input type="number" id="ji" value="0.6"/>';
            $('#frac').append(str);
        }
        reset();
//        $('<ul><li> iuanert </li> </ul>').appendTo('#frac');
    
    });
    $('#iter').click(function(){
        $('#man').attr("checked", "checked");
        auto = false;
    });
    
   function reset(){
        mouse.zoom = 1;
        counter = 0;
        if (fType == 'mandelbrot') {
            rl = -1.5;
            ru = 0.5;
            il = -1;
            iu = 1;
        }
        if (fType == 'nMandelbrot') {
            rl = -1.5;
            ru = 1.5;
            il = -1.5;
            iu = 1.5;
        }
        if (fType == 'julia') {
            rl = -1.5;
            ru = 1.5;
            il = -1.5;
            iu = 1.5;
        }
        if (fType == 'nJulia') {
            rl = -1.5;
            ru = 1.5;
            il = -1.5;
            iu = 1.5;
        }
        adjustRatio();
        mouse = {x0:0, y0:0, x:100, y:100, dx:0, dy:0, down:false, zoom:1, origSize:(ru-rl)};
       // auto = false;
        readIterations();
        c.clearRect(0,0,cwidth, cheight);
        fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
        drawFractal(c,fractalMap, cwidth,cheight);
    }
    function mAdjustRatio() { 
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
    }
    function adjustRatio( ) {
        var Ratio = cwidth/cheight;
        var ratio = (ru-rl)/(iu-il);
        var nd, d;

        if (Ratio > ratio) {
            d = (iu-il);
            nd = (iu-il)*cwidth/cheight;
            ru += (nd-d)/2;
            rl -= (nd-d)/2;
        }
        else {
            d = (ru-rl);
            nd = (ru-rl)*cheight/cwidth;
            iu += (nd-d)/2;
            il -= (nd-d)/2;
        }
    }
    function readIterations() {
        if (auto == true) {
            iterations = Math.floor(27*Math.pow(mouse.zoom,0.34)+100);
            $('#iter').val(iterations);
            $('#zoom').text('zoom: '+mouse.zoom);
        }
        else {
            iterations = $('#iter').val();
            $('#zoom').text('zoom: '+mouse.zoom);

        }
    }
    function affineMap(x0,y0,x,y) {
        var t1,t2;
        var A11,A12,A21,A22;

        t1 = rl;
        t2 = iu;

        A11 = (ru-t1)/cwidth;
        A12 = (rl-t1)/cheight;
        A21 = (iu-t2)/cwidth;
        A22 = (il-t2)/cheight;

        return [A11*x0 + A12*y0 + t1, A21*x0 + A22*y0 + t2, A11*x + A12*y + t1, A21*x + A22*y + t2];
    }
    
    function doMouseOut(event) {
        mouse.down = false;
        c.clearRect(0,0,cwidth, cheight);
        drawFractal(c,fractalMap, cwidth,cheight);
    }
    function doMouseDown(event) {
        mouse.down = true;
        mouse.x0 = event.pageX-canvas.offsetLeft;
        mouse.y0 = event.pageY-canvas.offsetTop;
//        alert(affineMap(mouse.x0,mouse.y0,0,0));
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
//            var dx = mouse.x - mouse.x0;
//            var dy = mouse.y - mouse.y0;
//            var tdx=dx, tdy=dy;
//            alert([dx,dy])
//            if (dy/dx < cheight/cwidth) {
//                dy = dx * cheight/cwidth;
//                mouse.y0 -= Math.abs(dy - tdy)/2;
//                mouse.y += Math.abs(dy - tdy)/2;
//            }
//            else {
//                dx = dy * cwidth/cheight;
//                mouse.x0 -= Math.abs(dx - tdx)/2;
//                mouse.x += Math.abs(dx - tdx)/2;
//            }
//            alert([mouse.x, mouse.y]);
            mAdjustRatio();
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

                tmp = affineMap(mouse.x0,mouse.y0,mouse.x,mouse.y);
                rl = tmp[0];
                iu = tmp[1];
                ru = tmp[2];
                il = tmp[3];

//                alert([rl,il,ru,iu]);

//                rl += (tru-trl)*(mouse.x0/cwidth);
//                ru -= (tru-trl)*(1-mouse.x/cwidth);
//                il += (tiu-til)*(mouse.y0/cheight);
//                iu -= (tiu-til)*(1-mouse.y/cheight);
//                adjustRatio();
                mouse.zoom = mouse.origSize / Math.abs((ru-rl));
                readIterations();
                c.clearRect(0,0,cwidth, cheight);
                fractalMap = getFractal(cwidth, cheight,rl,ru,il,iu);
                drawFractal(c,fractalMap, cwidth,cheight);
            }
        }
        mouse.down = false;
    }
    function doMouseMove(event) {
        mouse.x = event.pageX-canvas.offsetLeft;
        mouse.y = event.pageY-canvas.offsetTop;
        mouse.dx = (mouse.x-mouse.x0);
        mouse.dy = (mouse.y-mouse.y0);
        tmpMousePos = affineMap(mouse.x,mouse.y,0,0);
        $('#pos').text('Re:'+tmpMousePos[0].toFixed(7)+', Im:'+tmpMousePos[1].toFixed(7));
        if (mouse.down == true) {
            canvas.style.cursor="crosshair";
            c.clearRect(0,0,cwidth, cheight);
//            drawFractal(c,fractalMap ,cwidth,cheight);
            c.putImageData(image,0,0);
            c.beginPath();
            c.rect(mouse.x0, mouse.y0, mouse.dx, mouse.dy);
            c.lineWidth = 1;
            c.strokeStyle = 'white';
            c.stroke();
        }
    }

//-------iteration functions{{{
    function mandelbrot(ar, ai, maxcount) {
        var threshhold = 4;
        var zr = ar;
        var zi = ai;
        var tmpr=0;
        var i=0;
        for (; (i < maxcount) && (tmpr < threshhold);i++) {
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + ar;
            zi = 2*tmpr*zi + ai;
            tmpr = zi*zi+zr*zr;
        }
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + ar;
            zi = 2*tmpr*zi + ai;
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + ar;
            zi = 2*tmpr*zi + ai;
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + ar;
            zi = 2*tmpr*zi + ai;
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + ar;
            zi = 2*tmpr*zi + ai;
            tmpr = zi*zi+zr*zr;
        return [i,tmpr];
    }
    function nMandelbrot(ar,ai,maxcount) {
        var threshhold = Math.pow(2,2/(n-1));
        var z = [];
        var abs=0;
        var i=0;
        z[0] = ar;
        z[1] = ai;
        
        for (; i < maxcount && abs < threshhold; i++) {
            z = raise(z[0],z[1],n);
            z[0] += ar;
            z[1] += ai;
            abs = z[0]*z[0] + z[1]*z[1];
        }
            z = raise(z[0],z[1],n);
            z[0] += ar;
            z[1] += ai;
            z = raise(z[0],z[1],n);
            z[0] += ar;
            z[1] += ai;
            z = raise(z[0],z[1],n);
            z[0] += ar;
            z[1] += ai;
            z = raise(z[0],z[1],n);
            z[0] += ar;
            z[1] += ai;
            abs = z[0]*z[0] + z[1]*z[1];
        return [i,abs];
    }
    function julia(ar,ai,maxcount) {
        var threshhold = 4;
        var zr = ar;
        var zi = ai;
        var tmpr=0;
        var i=0;
        for (; i < maxcount && tmpr < threshhold; i++) {
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + jr;
            zi = 2*tmpr*zi + ji;
            tmpr = zr*zr + zi*zi;
        }
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + jr;
            zi = 2*tmpr*zi + ji;
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + jr;
            zi = 2*tmpr*zi + ji;
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + jr;
            zi = 2*tmpr*zi + ji;
            tmpr = zr;
            zr = (zr + zi)*(zr - zi) + jr;
            zi = 2*tmpr*zi + ji;
            tmpr = zr*zr + zi*zi;
        return [i,tmpr];
    }
    function nJulia(ar,ai,maxcount) {
        var threshhold = Math.pow(2,2/(n-1));
        var z = [];
        var abs=0;
        var i=0;
        z[0] = ar;
        z[1] = ai;
        
        for (; i < maxcount && abs < threshhold; i++) {
            z = raise(z[0],z[1],n);
            z[0] += jr;
            z[1] += ji;
            abs = z[0]*z[0] + z[1]*z[1];
        }
            z = raise(z[0],z[1],n);
            z[0] += jr;
            z[1] += ji;
            z = raise(z[0],z[1],n);
            z[0] += jr;
            z[1] += ji;
            z = raise(z[0],z[1],n);
            z[0] += jr;
            z[1] += ji;
            z = raise(z[0],z[1],n);
            z[0] += jr;
            z[1] += ji;
            abs = z[0]*z[0] + z[1]*z[1];
        return [i,abs];
    }
//}}}

    function raise(zr,zi,n) {
        var r = zr*zr + zi*zi;
        var p = Math.atan2(zi,zr);

        r = Math.pow(r,n/2);
        p = (n*p);

        return [r*Math.cos(p),r*Math.sin(p)];
    }
    function setPixel(imageData, x, y, rgba) {
        index = (x + y * imageData.width) * 4;
        imageData.data[index+0] = rgba[0];
        imageData.data[index+1] = rgba[1];
        imageData.data[index+2] = rgba[2];
        imageData.data[index+3] = rgba[3];
    }

//----- greyScales and colors {{{ 
//
    function mSetGrey(it_zAbs) {
        var count = it_zAbs[0] + 4 - Math.log(Math.log(it_zAbs[1]))/Math.log(2);

        if (it_zAbs[0] == iterations) {
            return [0,0,0,255];
        }
        count = Math.floor(2.0*256*Math.pow(count/iterations,1));
        if (count>255) {
            count = 255;
        }
        return [count,count,count,255];
    }

    function jSetGrey(it_zAbs) {
        var count = it_zAbs[0] + 4 - Math.log(Math.log(it_zAbs[1]))/Math.log(2);

        if (it_zAbs[0] == iterations) {
            return [0,0,0,255];
        }
        count = Math.floor(2.0*256*Math.pow(count/iterations,0.3));
        if (count>255) {
            count = 255;
        }
        return [count,count,count,255];
    }

    function nMSetGrey(it_zAbs) {
        var count = it_zAbs[0] + 4 - Math.log(Math.log(it_zAbs[1]))/Math.log(2);

        if (it_zAbs[0] == iterations) {
            return [0,0,0,255];
        }
        count = Math.floor(2.0*256*Math.pow(count/iterations,1));
        if (count>255) {
            count = 255;
        }
        return [count,count,count,255];
    }

    function nJSetGrey(it_zAbs) {
        var count = it_zAbs[0] + 4 - Math.log(Math.log(it_zAbs[1]))/Math.log(2);

        if (it_zAbs[0] == iterations) {
            return [0,0,0,255];
        }
        count = Math.floor(2.0*256*Math.pow(count/iterations,0.3));
        if (count>255) {
            count = 255;
        }
        return [count,count,count,255];
    }

    var c1=[255,0,0],c2=[0,255,0],c3=[0,0,255];
    var p1=0.0, p2=0.1, p3=1;
    mSetColor([5,5],c1,p1,c2,p2,c3,p3);
    function mSetColor(it_zAbs, c1,p1, c2,p2, c3,p3) {
        var i,j;
        var tmp;
        var lower;
        var range;
        var cp = [[c1,p1], [c2,p2], [c3,p3]];
        var count = it_zAbs[0] + 2 - Math.log(Math.log(it_zAbs[1]))/Math.log(2);
        var l = cp.length;
        var p = count/iterations;

        if (it_zAbs[1] == iterations) {
            return [0,0,0,255];
        }
        if (Math.abs(p-1) < 0.001 || p > 1) {
            return [cp[l-1][0][0],cp[l-1][0][1],cp[l-1][0][2],255];
        }
        if (Math.abs(p) < 0.001) {
            return [cp[0][0][0],cp[0][0][1],cp[0][0][2],255];
        }

        for (i=0; i < l; i++) {
            for (j=i; j < l; j++) {
                if (cp[j][1] < cp[i][1]) {
                    tmp = cp[j];
                    cp[j] = cp[i];
                    cp[i] = tmp;
                }
            }
        }

        lower = 0;
        for (i=0; i < l; i++) {
            if (cp[i][1] > p) {
                break;
            }
        }
        alert([p,i]);
    }

    function hsv_to_rgb(h, s, v) {
        if ( v > 1.0 ) v = 1.0;
        var hp = (h%360)/60.0;
        var c = v * s;
        var x = c*(1 - Math.abs((hp % 2) - 1));
        var rgb = [0,0,0];

        if ( 0<=hp && hp<1 ) rgb = [c, x, 0];
        if ( 1<=hp && hp<2 ) rgb = [x, c, 0];
        if ( 2<=hp && hp<3 ) rgb = [0, c, x];
        if ( 3<=hp && hp<4 ) rgb = [0, x, c];
        if ( 4<=hp && hp<5 ) rgb = [x, 0, c];
        if ( 5<=hp && hp<6 ) rgb = [c, 0, x];

        var m = v - c;
        rgb[0] += m;
        rgb[1] += m;
        rgb[2] += m;

        rgb[0] *= 255;
        rgb[1] *= 255;
        rgb[2] *= 255;
        return rgb;
    }

    function interpolateColor(r1,g1,b1,a1, r2,g2,b2,a2, p) {
        var r,g,b,a;
        r = Math.floor(p*r2 + (1-p)*r1);
        g = Math.floor(p*g2 + (1-p)*g1);
        b = Math.floor(p*b2 + (1-p)*b1);
        a = Math.floor(p*a2 + (1-p)*a1);

        return [r,g,b,a];
    }
//}}}

    function getFractal(width, height, rl,ru,il,iu) {
        var r,i, x,y;
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
        for (y = 0; y < height; y++){
            $('#progress').text((100*y/height).toFixed(0)+"%");
            i = iu - (idiff*y)/height;
            for (x = 0; x < width; x++){
                r = rl + (rdiff*x)/width;
                fractalMap[x+y*width] = functions[fType](r,i, iterations);
            }
        }
        //alert([x,r,y,i]);
        return fractalMap;
    }
    function drawFractal(c,fractalMap,w,h) {
        var x,y;
        image = c.createImageData(w,h);
        var arr = new Array(4);
        var r,g,b,a;
        var rgba;
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
//                arr = colorMap[fractalMap[x+y*w]];
//                r = arr[0];
//                g = arr[1];
//                b = arr[2];
//                a = arr[3];
                arr = colors[cType](fractalMap[x+y*w]);
                setPixel(image,x,y,arr);
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
//    fractalMap = getFractal(cwidth, cheight,-1.5,-1.1,-0.1,0.1);
//    drawFractal(c,fractalMap, colorMap,cwidth,cheight);
    
//    c.putImageData(id, 0,0);
})
