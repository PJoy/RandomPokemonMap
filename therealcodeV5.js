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

var size = 200;
TILE_SIZE = 16;
WIDTH = TILE_SIZE * size;
HEIGHT = TILE_SIZE * size;

$(document).ready(function() {
    var random = true;
    bgMap = [];

    if (random){
        map = generateNoiseMap(Math.random(), size, size, 2);
        map2 = generateNoiseMap(Math.random(), size, size, 5);
    } else {
        map = generateNoiseMap(0.1, size, size, 2);
        map2 = generateNoiseMap(0.2, size, size, 5);
    }

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var type = '';
            var level = 0;
            // set tile type according to height
            // height = 0 ==> below sea level
            // height = 1 ==> "normal" level
            // height = 2 ==> mountain level
            var pointHeight = map[i + j * size];
            if ( pointHeight < 0.3 ){
                level = -1;
                pointHeight *= 1/0.3;
                if ( pointHeight < 0.35 ){
                    type = 'sea3';
                } else if ( pointHeight < 0.6 ){
                    type = 'sea2';
                } else if ( pointHeight < 0.75 ){
                    type = 'sea1';
                } else {
                    type = 'sand';
                }
            } else if (pointHeight < 0.7 ) {
                // another map is used here to create variations in "normal" level
                level = 0;
                if (map2[i + j * size] < 0.25) {
                    type = 'desert1';
                } else if (map2[i + j * size] < 0.5) {
                    type = 'savanah';
                } else if (map2[i + j * size] < 0.9) {
                    type = 'grass';
                } else {
                    type = 'swamp';
                }
            } else {
                pointHeight -= 0.7;
                pointHeight *= 1/0.3;
                level = 1 + Math.floor(pointHeight*2);
                if ( pointHeight < 0.7 ){
                    type = 'rock';
                } else {
                    type = 'snow';
                }
            }

            setTile(2*i,2*j,0,bgMap,{type: type, level: level});
            setTile(2*i+1,2*j+1,0,bgMap,{type: type, level: level});
            setTile(2*i,2*j+1,0,bgMap,{type: type, level: level});
            setTile(2*i+1,2*j,0,bgMap,{type: type, level: level});

            /*drawTile(2 * i, 2 * j, type);
            drawTile(2 * i + 1, 2 * j + 1, type);
            drawTile(2 * i, 2 * j + 1, type);
            drawTile(2 * i + 1, 2 * j, type)*/
        }
    }

    generateBorders(bgMap);

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            drawTile(i,j,bgMap[i+j*size].type);
            //var tileObject = bgMap[i+j*size+size*size];
            //var tile = tileObject.tile + '-' + tileObject.differentTile + tileObject.dir;

            var bn = getBorderName(getTile(i,j,1,bgMap));
            if ( bn != undefined ) drawTile(i, j, bn);

            drawTile(i,j,bn);
        }
    }

});

function getBorderName(bTile){
    var z1 = bTile.tile;
    var z2 = bTile.differentTile;
    var dir = bTile.dir;

    //console.log(z1, z2, dir);
    if (z1 == undefined || z2 == undefined || dir == undefined) return;

    //particular cases
    /*if (z1+'-'+z2 == 'sea1-sea2') return;
    if (z1+'-'+z2 == 'sea2-sea3') return;
    if (z1+'-'+z2 == 'grass-sand') return;
    if (z1+'-'+z2 == 'sea2-sea1') return z1+'-'+z2+dir;
    if (z1+'-'+z2 == 'sea3-sea2') return z1+'-'+z2+dir;
    if (z1+'-'+z2 == 'sand-grass') return z1+'-'+z2+dir;*/
    //if (z2 > z1) return;

    //particular cases UPDATED
    //if (z2] == 'water') return z2]+'-'+z1]+dir;

    //console.log(z1);
    return z1+'-'+z2+dir;
}
