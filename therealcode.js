/**
 * GAME PARAMS
 */

var TILE_SIZE = 25;
var TILE_TYPES = [
    'water',
    'trees',
    'ground'
];

// used to generate predictable seed from seed
var count = 0;

/**
 * GAME FUNCTIONS
 */


function getRandomTileType(seed) {
    seed += count;
    count++;

    // seed to 0 < float < 1
    var rand = parseFloat('0.'+Math.sin(seed).toString().substr(6));

    return TILE_TYPES[Math.floor(rand*TILE_TYPES.length)];
}

/**
 * returns number of tiles vertically/horizontally
 * @param canvas
 * @returns {{nX: number, nY: number}}
 */
function createGrid(canvas) {
    var
        nX = Math.ceil(canvas.width/TILE_SIZE),
        nY = Math.ceil(canvas.height/TILE_SIZE);

    console.log('Grid initialized : [ '+nX+' tiles in x, '+nY+' tiles in y]');
    return {nX: nX, nY: nY}
}

function createTileArray(seed, grid){
    var array = [];

    for ( var i = 0; i < grid.nX; i++) {
        for ( var j = 0; j < grid.nY; j++){
            array.push(getRandomTileType(seed))
        }
    }

    return array;
}

function createWorld(canvas, seed) {
    var grid = createGrid(canvas);
    var tileArray = createTileArray(seed, grid);

    console.log(grid);
    return {grid: grid, tiles: tileArray}
}

function tileTypeToColor(tileType) {
    switch (tileType){
        case 'water' :
            return '#3a9bdc';
            break;
        case 'trees' :
            return '#2ecc71';
            break;
        case 'ground' :
            return '#ecf0f1';
            break;
        default :
            console.log('hey, this tile type doesn\'t exist wtf');
    }
}

function drawTile(x,y,tile) {
    drawRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE, tileTypeToColor(tile))
}

function drawWorld(world) {
    var k = 0;

    for ( var i = 0; i < world.grid.nX; i++) {
        for ( var j = 0; j < world.grid.nY; j++){
            drawTile(i,j,world.tiles[k]);
            k++;
        }
    }
}

/**
 * ENGINE STUFF (canvas, draw, etc)
 */
var canvas = document.getElementById('C');

function drawRect(x,y,dx,dy,color) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x,y,dx,dy);
}

/**
 * EXECUTION
 */

$(document).ready(function(){
    var world = createWorld(canvas, 2);
    drawWorld(world);
});