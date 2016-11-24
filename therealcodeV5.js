/**
 * Created by pierreportejoie on 24/11/2016.
 */

function generateNoiseMap(seed, width, height) {
    var map = [];

    noise.seed(seed);
    var canvas = document.getElementById('noiseCanvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    var image = ctx.createImageData(width, height);
    var data = image.data;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var value = Math.abs(
                (noise.perlin2(x/200 , y/200 )+1)
                *(noise.perlin2(x/100 , y/100 )+1)
                *(noise.perlin2(x/40 , y/40)+1)
                /2);

            var valueR = Math.abs( (noise.perlin2(x/180 , y/180 )) /2);
            if (valueR < 0.005) valueR =1; else valueR=0;

            var type = '';

            if (value < 0.3) type = 'sea';
            else if (value < 0.7) type = 'ground';
            else type = 'mountain';

            if ( value < 0.1) value = 0.1;
            else if ( value < 0.2) value = 0.5;
            else if ( value < 0.3) value = 1;
            else if ( value < 0.7) value = 0.5;
            else if ( value < 0.9) value = 0.6;
            else (value = 1);


            value *= 256;
            valueR *= 256;
            var cell = (x + y * canvas.width) * 4;
            if (type == 'sea'){
                data[cell + 2] = value;
            } else if (type == 'ground') {
                data[cell] = value-valueR;
                data[cell + 1] = value-valueR;
                data[cell + 2] = valueR;

            } else {
                data[cell ] = value-valueR;
                data[cell + 1] = value-valueR;
                data[cell + 2] = value-valueR;
            }
            data[cell] += Math.max(0, (25 - value) * 8);
            data[cell + 3] = 255; // alpha.
        }
    }

    ctx.fillColor = 'black';
    ctx.fillRect(0, 0, 100, 100);
    ctx.putImageData(image, 0, 0);

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var data = ctx.getImageData(x,y,1,1).data;
            var val = (data[0]+data[1]+data[2]) / 3;
            map.push(val/255);
        }
    }

    return map;
}


$(document).ready(function() {
    generateNoiseMap(Math.random(),1000,1000);
});