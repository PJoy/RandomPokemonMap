/**
 * Created by pierreportejoie on 30/09/2016.
 */

function generateNoiseMap(seed, width, height, xOffset = 0, yOffset = 0) {
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
            var value = Math.abs((noise.perlin2((x + xOffset) / 10, (y + yOffset) / 10)+1)/2);
            value *= 256;
            var cell = (x + y * canvas.width) * 4;
            data[cell] = data[cell + 1] = data[cell + 2] = value;
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


function generateBackground() {
    var double = true;
    var noiseMap = generateNoiseMap(Math.random(), WIDTH/TILE_SIZE, HEIGHT/TILE_SIZE);
    var levels = TILE_TYPES.length;
    var grid = [];

    for ( var i = 0; i < WIDTH/TILE_SIZE; i++ ){
        for ( var j = 0; j < HEIGHT/TILE_SIZE; j++ ){
            if (!double){
                grid.push(Math.floor(noiseMap[i + WIDTH/TILE_SIZE * j]*levels))
            } else {
                grid.push(Math.floor(noiseMap[Math.floor(i/2) + WIDTH/TILE_SIZE * Math.floor(j/2)]*levels))
            }
        }
    }

    return grid;
}

function generateBorders(grid) {

}

function generateXLDetails(grid) {

}

function generateXSDetails(grid) {

}

function generateDetails(grid) {
    generateXLDetails();
    generateXSDetails();
}

function generateMap() {
    var bg = generateBackground();
    generateBorders(bg);
    generateDetails(bg);

    return bg;
}

function drawMap(map) {
    for ( var i = 0; i < WIDTH/TILE_SIZE; i++){
        for ( var j = 0; j < HEIGHT/TILE_SIZE; j++){
            // FAKKAF M8
            //for ( var k = 0; k < Math.floor(map.length()/WIDTH/TILE_SIZE*); k++){
                drawTile(i, j, TILE_TYPES[map[i + WIDTH/TILE_SIZE * j]])
            //}
        }
    }
}

//CONF CONSTS
TILE_SIZE = 16;
TILE_TYPES = [
    'water',
    'water',
    'grass',
    'grass',
    'rock',
    'rock',
    'rock',
    'snow'
];
WIDTH = 800;
HEIGHT = 800;
GRID = [];

$(document).ready(function() {
    var map = generateMap();
    drawMap(map);
});