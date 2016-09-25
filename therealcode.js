/**
 * PARAMS
 */

var TILE_SIZE = 16;
var TILE_TYPES = [
    'deeper-water',
    'deep-water',
    'water',
    'sand',
    'grass',
    'rock',
    'snow',
];

/**
 * UTILS
 */

function getLast(array) {
    return array[array.length - 1];
}

function getRandomFromSeed(seed) {
    return parseFloat('0.'+Math.sin(seed).toString().substr(6));
}

var count = 0;
function getRandomTileType(seed) {
    seed += count;
    count++;

    var rand = getRandomFromSeed(seed);

    return TILE_TYPES[Math.floor(rand*TILE_TYPES.length)];
}

/**
 * CREATE !
 */

function getNextStep(path, destination, seed) {

    var p = getLast(path);
    var possibilities = [];

    if ( Math.abs(p.x + 1 - destination.x) < Math.abs(p.x - 1 - destination.x) ) possibilities.push({x: p.x+1, y: p.y});
    if ( Math.abs(p.x - 1 - destination.x) < Math.abs(p.x + 1 - destination.x) ) possibilities.push({x: p.x-1, y: p.y});
    if ( Math.abs(p.y + 1 - destination.y) < Math.abs(p.y - 1 - destination.y) ) possibilities.push({x: p.x, y: p.y+1});
    if ( Math.abs(p.y - 1 - destination.y) < Math.abs(p.y + 1 - destination.y) ) possibilities.push({x: p.x, y: p.y-1});

    return possibilities[Math.floor(Math.random()*possibilities.length)];
}

function generatePath(p1, p2, seed) {
    var path = [];

    path.push(p1);

    while(getLast(path).x != p2.x && getLast(path).y != p2.y){
        path.push(getNextStep(path,p2, seed));
    }

    return path;
}

/**
 * GENERATE !
 */

function createGrid(canvas) {
    var
        nX = Math.ceil(canvas.width/TILE_SIZE),
        nY = Math.ceil(canvas.height/TILE_SIZE);

    return {nX: nX, nY: nY}
}

function randomTilesEverywhere(seed, grid, anarchy=false) {
    var array = [];

    var index;

    for ( var i = 0; i < grid.nX; i++) {
        for ( var j = 0; j < grid.nY; j++){
            if (!anarchy) array.push(TILE_TYPES[Math.floor(Math.random()*TILE_TYPES.length)]);
            else array.push('random');
        }
    }

    console.log(array);

    return array;
}

function createTileArrayUnique (type, grid) {
    var array = [];

    for ( var i = 0; i < grid.nX; i++) {
        for ( var j = 0; j < grid.nY; j++){
            array.push(type);
        }
    }

    return array;
}

function createTileArrayWithPath(seed,grid) {
    var array = [];

    p1 = {x: 0, y: 0};
    p2 = {x: grid.nX, y: grid.nY};
    var path = generatePath(p1, p2, seed);

    var coords = [];

    path.forEach(function(a){
        for (var i = -1; i < 2; i ++ ){
            for (var j = -1; j < 2; j++){
                coords.push({x: a.x+i, y: a.y + j});
            }
        }
    });


    return array;
}

function createWorld(canvas, seed) {
    var grid = createGrid(canvas);
    var tileArray1 = randomTilesEverywhere(seed, grid);


    return {grid: grid, tilesLayers: [tileArray1]}
}

/**
 * CONVERT !
 */

function tileTypeToTexture(tileType) {
    switch (tileType){
        case 'deeper-water' :
            return [8,26];
            break;
        case 'deep-water' :
            return [11,26];
            break;
        case 'water' :
            return [6,28];
            break;
        case 'sand' :
            return [2,26];
            break;
        case 'grass' :
            return [1,20];
            break;
        case 'rock' :
            return [8,33];
            break;
        case 'snow' :
            return [29,16];
            break;
        case 'empty' :
            return [5,3];
            break;
        case 'random' :
            return [Math.floor(Math.random()*122),Math.floor(Math.random()*50)];
            break;
    }
}

/**
 * DRAW !
 */

function drawTileFromSheet(x, y, dx, dy, px, py) {
    var img = document.getElementById('spritesheet');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img,16*x,16*y,16*dx,16*dy,px,py,16*dx,16*dy)
}

function drawTile(x,y,tile) {
    var coordsOnSheet = tileTypeToTexture(tile);

    drawTileFromSheet(coordsOnSheet[0],coordsOnSheet[1],1,1,x*TILE_SIZE,y*TILE_SIZE)
}

function drawWorld(world) {
    var k = 0;
    var nLayers = world.tilesLayers.length;

    for ( var i = 0; i < world.grid.nX; i++) {
        for ( var j = 0; j < world.grid.nY; j++){
            for ( var l = 0; l < nLayers; l++ ){
                if (world.tilesLayers[l][k] != undefined) drawTile(i,j,world.tilesLayers[l][k]);
                else drawTile(i,j,'nothing')
            }
            k++;
        }
    }
}

/**
 * EXECUTE !
 */

// 0 < seed < 1
function getTileFromSeed(seed) {
    if (seed >= 1) return TILE_TYPES[TILE_TYPES.length-1];
    if (seed <= 0) return TILE_TYPES[0];
    return TILE_TYPES[Math.floor(seed * TILE_TYPES.length)];
}


var canvas = document.getElementById('C');

$(document).ready(function() {
//    var world = createWorld(canvas, 1);

    //  drawWorld(world);
    /*
     var ctx = canvas.getContext('2d');
     img2 = document.getElementById('noise');
     ctx.drawImage(img2,0,10,img2.width, img2.height-20,0,0,50,50);

     for ( var i = 0; i < canvas.width/TILE_SIZE; i++){
     for ( var j = 0; j < canvas.height/TILE_SIZE; j++){

     }
     }*/

     noiseCanvas = document.getElementById('noiseCanvas');
    noiseCanvas.width = canvas.width / TILE_SIZE;
    noiseCanvas.height = canvas.height / TILE_SIZE;

     ctxN = noiseCanvas.getContext('2d');
     img2 = document.getElementById('noise');

    ctxN.drawImage(img2, 0, 0, img2.width, img2.height, 0, 0, noiseCanvas.width, noiseCanvas.height);

     noiseValues = [];

    for (var i = 0; i < noiseCanvas.width; i++) {
        for (var j = 0; j < noiseCanvas.height; j++) {
            var seed = (ctxN.getImageData(i,j,1,1).data[0] + ctxN.getImageData(i,j,1,1).data[1] + ctxN.getImageData(i,j,1,1).data[2]);
            noiseValues.push(seed);
        }
    }

    var max = Math.max.apply(null, noiseValues);
    var min = Math.min.apply(null, noiseValues);

    for (var i = 0; i < noiseCanvas.width; i++) {
        for (var j = 0; j < noiseCanvas.height; j++) {
            var seed = noiseValues[i*canvas.width/TILE_SIZE+j];
            drawTile(i,j,getTileFromSeed((seed-min)/(max-min)));
        }
    }
});

/*function recalibrate(a) {

    for (var i = 0; i < noiseCanvas.width; i++) {
        for (var j = 0; j < noiseCanvas.height; j++) {
            var seed = (ctxN.getImageData(i,j,1,1).data[0] + ctxN.getImageData(i,j,1,1).data[1] + ctxN.getImageData(i,j,1,1).data[2])/a;
            drawTile(i,j,getTileFromSeed(seed));
        }
    }

}*/