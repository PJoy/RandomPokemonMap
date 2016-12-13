/**
 * Created by pierreportejoie on 24/11/2016.
 */

function generateNoiseMap(seed, width, height, factor = 3) {
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
                (noise.perlin2(x/200*factor , y/200*factor )+1)
                *(noise.perlin2(x/100*factor , y/100*factor )+1)
                *(noise.perlin2(x/40*factor , y/40*factor)+1)
                /2);
            if (value < 0.1) value = 0.1;


            value *= 256;
            var cell = (x + y * canvas.width) * 4;
            data[cell ] = value;
            data[cell + 1] = value;
            data[cell + 2] = value;
            data[cell] += Math.max(0, (25 - value) * 8);
            data[cell + 3] = 255; // alpha.
        }
    }

    ctx.fillColor = 'black';
    ctx.fillRect(0, 0, 100, 100);
    ctx.putImageData(image, 0, 0);

    //var maxval = 0.5;
    //var minval = 0.5;

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var data = ctx.getImageData(x,y,1,1).data;
            var val = (data[0]+data[1]+data[2]) / 3;
            val /= 255;
            map.push(val);
            //if (val > maxval) maxval = val;
            //if (val < minval) minval = val;
        }
    }

    //console.log(minval, maxval);

    return map;
}

TILE_SIZE = 16;

$(document).ready(function() {
    var random = true;

    if (random){
        map = generateNoiseMap(Math.random(), 25, 25);
        map2 = generateNoiseMap(Math.random(), 25, 25, 1);
    } else {
        map = generateNoiseMap(0.1, 25, 25);
        map2 = generateNoiseMap(0.2, 25, 25, 10);
    }

    for (var i = 0; i < 25; i++) {
        for (var j = 0; j < 25; j++) {
            var type = 'water';
            // set tile type according to height
            // height = 0 ==> below sea level
            // height = 1 ==> "normal" level
            // height = 2 ==> mountain level
            if (map[i + j * 25] > 0.3) {
                // another map is used here to create variations in "normal" level
                if (map2[i + j * 25] < 0.25) {
                    type = 'desert1';
                } else if (map2[i + j * 25] < 0.5) {
                    type = 'savanah';
                } else if (map2[i + j * 25] < 0.9) {
                    type = 'grass';
                } else {
                    type = 'swamp';
                }
            }

            if (map[i + j * 25] > 0.8) {
                type = 'rock';
            }
            drawTile(2 * i, 2 * j, type);
            drawTile(2 * i + 1, 2 * j + 1, type);
            drawTile(2 * i, 2 * j + 1, type);
            drawTile(2 * i + 1, 2 * j, type)
        }
    }

});