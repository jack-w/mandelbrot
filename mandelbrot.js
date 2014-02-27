$(document).ready(function(){
var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d'),
    cwidth,
    cheight,
    id = c.createImageData(100,100),
    d = id.data;

cwidth = canvas.width;
cheight = canvas.height;
d[0] = 0;
d[1] = 0;
d[2] = 0;
d[3] = 0;

c.putImageData(id, 5,5);
})
