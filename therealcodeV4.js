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

function getBorderDirections(x,y,grid) {
    var center = getTile(x,y,0,grid);
    var dir = '';
    var differentTile;

    if (center > getTile(x,y-1,0,grid) && getTile(x,y-1,0,grid) != undefined){
        differentTile = getTile(x,y-1,0,grid);
        dir += 'N';
        if (center > getTile(x-1,y,0,grid) && getTile(x-1,y,0,grid) != undefined){
            dir += '+W';
        }
        if (center > getTile(x+1,y,0,grid) && getTile(x+1,y,0,grid) != undefined){
            dir += '+E'
        }
    } else if (center > getTile(x,y+1,0,grid) && getTile(x,y+1,0,grid) != undefined){
        differentTile = getTile(x,y+1,0,grid);
        dir += 'S';
        if (center > getTile(x-1,y,0,grid) && getTile(x-1,y,0,grid) != undefined){
            dir += '+W';
        }
        if (center > getTile(x+1,y,0,grid) && getTile(x+1,y,0,grid) != undefined){
            dir += '+E'
        }
    } else if (center > getTile(x-1,y,0,grid) && getTile(x-1,y,0,grid) != undefined){
        differentTile = getTile(x-1,y,0,grid);
        dir += 'W'
    } else if (center > getTile(x+1,y,0,grid) && getTile(x+1,y,0,grid) != undefined){
        differentTile = getTile(x+1,y,0,grid);
        dir += 'E'
    } else if (center > getTile(x-1,y-1,0,grid) && getTile(x-1,y-1,0,grid) != undefined){
        differentTile = getTile(x-1,y-1,0,grid);
        dir = 'NW';
    } else if (center > getTile(x+1,y-1,0,grid) && getTile(x+1,y-1,0,grid) != undefined){
        differentTile = getTile(x+1,y-1,0,grid);
        dir = 'NE';
    } else if (center > getTile(x-1,y+1,0,grid) && getTile(x-1,y+1,0,grid) != undefined){
        differentTile = getTile(x-1,y+1,0,grid);
        dir = 'SW';
    } else if (center > getTile(x+1,y+1,0,grid) && getTile(x+1,y+1,0,grid) != undefined) {
        differentTile = getTile(x+1,y+1,0,grid);
        dir = 'SE';
    }

    return {dir:dir, tile:getTile(x,y,0,grid), differentTile:differentTile};
}

function generateBorders(grid) {
    
    for ( var i = 0; i < WIDTH / TILE_SIZE; i++ ) {
        for ( var j = 0; j < HEIGHT / TILE_SIZE; j++ ) {
            setTile(i, j, 1, grid, getBorderDirections(i,j,grid));
        }
    }
    
    return grid;
}

function generateXLDetails(grid) {

}

function generateXSDetails(grid) {

}

function generateDetails(grid) {
    generateXLDetails();
    generateXSDetails();

    return grid;
}

function generateMap() {
    var bg = generateBackground();
    var bgBd = generateBorders(bg);
    var bgBdDe = generateDetails(bgBd);

    console.log(bgBdDe);
    return bgBdDe;
}

function getBorderName(bTile){
    var z1 = bTile.tile;
    var z2 = bTile.differentTile;
    var dir = bTile.dir;

    //console.log(z1, z2, dir);
    if (z1 == undefined || z2 == undefined || dir == undefined) return undefined;

    return TILE_TYPES[z1]+'-'+TILE_TYPES[z2]+dir;
}

function drawMap(map) {
    var zMax = Math.ceil(map.length/WIDTH/TILE_SIZE/HEIGHT/TILE_SIZE);

    for ( var i = 0; i < WIDTH/TILE_SIZE; i++){
        for ( var j = 0; j < HEIGHT/TILE_SIZE; j++){
            drawTile(i, j, TILE_TYPES[map[i + WIDTH/TILE_SIZE * j]]);
            var bn = getBorderName(getTile(i,j,1,map));
            if ( bn != undefined ) drawTile(i, j, bn);
        }
    }
}

//CONF CONSTS
TILE_SIZE = 16;
TILE_TYPES = [
    backgrounds[Math.floor(Math.random()*backgrounds.length)],
    backgrounds[Math.floor(Math.random()*backgrounds.length)]
];
WIDTH = 800;
HEIGHT = 800;
GRID = [];

$(document).ready(function() {
    var map = generateMap();
    drawMap(map);
});