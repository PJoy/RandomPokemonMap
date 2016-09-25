/**
 * Created by pierreportejoie on 25/09/2016.
 */

var TILE_SIZE = 16;

/**
 * Generate Perlin noise maps
 */

function generateNoiseMap(w, h) {
    var noiseCanvas = document.getElementById('noiseCanvas');
    noiseCanvas.width = w;
    noiseCanvas.height = h;

    var ctxN = noiseCanvas.getContext('2d');
    var img2 = document.getElementById('noise');

    ctxN.drawImage(img2, 0, 0, img2.width, img2.height, 0, 0, w, h);

    var noiseValues = [];

    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            var seed = ( ctxN.getImageData(i,j,1,1).data[0] + ctxN.getImageData(i,j,1,1).data[1] + ctxN.getImageData(i,j,1,1).data[2] );
            noiseValues.push(seed);
        }
    }

    var max = Math.max.apply(null, noiseValues);
    var min = Math.min.apply(null, noiseValues);

    var noiseValuesNormalized = [];

    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            noiseValuesNormalized.push((noiseValues[i*w+j]-min)/(max-min))
        }
    }

    return noiseValuesNormalized;
}

/**
 * Convert noise maps into tile maps
 */

/*var TILE_TYPES = [
 'deeper-water',
 'deep-water',
 'water',
 'sand',
 'grass',
 'rock',
 'snow',
 ];*/
var TILE_TYPES = [
    'rock',
    'grass',
    'water-r',
];

function tileNameToSprite(type) {
    switch (type){
        case 'deeper-water' :
            return [8,26];
            break;
        case 'deep-water' :
            return [11,26];
            break;
        case 'water' :
            return [6,28];
            break;
        case 'water-r' :
            return [40,26];
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

function getEdgeSprite(boundary, orientation) {
    switch (boundary) {
        case 'water-r-grass':
            switch (orientation) {
                case 'S':
                    return [40, 25];
                    break;
                case 'SW':
                    return [41, 25];
                    break;
                case 'W':
                    return [41, 26];
                    break;
                case 'NW':
                    return [41, 27];
                    break;
                case 'N':
                    return [40, 27];
                    break;
                case 'NE':
                    return [39, 27];
                    break;
                case 'E':
                    return [39, 26];
                    break;
                case 'SE':
                    return [39, 25];
                    break;
                default:
                    break;
            }
            break;
        case 'grass-rock':
            switch (orientation) {
                case 'S':
                    return [8, 32];
                    break;
                case 'SW':
                    return [9, 32];
                    break;
                case 'W':
                    return [9, 33];
                    break;
                case 'NW':
                    return [9, 34];
                    break;
                case 'N':
                    return [8, 34];
                    break;
                case 'NE':
                    return [7, 34];
                    break;
                case 'E':
                    return [7, 33];
                    break;
                case 'SE':
                    return [7, 32];
                    break;
                default:
                    break;
            }
            break;
    }
    return[0,0]
}

function seedToType(seed) {
    var tileType;
    tileType = TILE_TYPES[Math.floor(seed * TILE_TYPES.length)];
    if (seed == 1) tileType = TILE_TYPES[TILE_TYPES.length-1];
    if (seed == 0) tileType = TILE_TYPES[0];

    return tileType;
}

function generateTileMap(w, h) {
    var noiseMap = generateNoiseMap(w, h);
    var tileMap = [];

    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            tileMap.push({x: i, y: j, type: seedToType(noiseMap[i*w+j])})
        }
    }

    return tileMap;
}

/**
 * Place edges
 */

function getGradients(tile, tileMap) {
    if (tile.x == 0 || tile.y == 0 || tile.x == canvas.width/TILE_SIZE-1 || tile.y == canvas.height/TILE_SIZE-1) return;
    var diffs = [];
    for ( var i = tile.x - 1; i < tile.x + 2; i++ ){
        for ( var j = tile.y - 1; j < tile.y + 2; j++ ){
            if (tileMap[i*canvas.width/TILE_SIZE + j].type != tile.type){
                diffs.push({x1: i, y1: j, x2: tile.x, y2: tile.y, type1: tileMap[i*canvas.width/TILE_SIZE + j].type, type2: tile.type})
            }
        }
    }

    return diffs;
}

function getEdgeTile(data) {
    var orientation = '';
    switch (data.y1-data.y2){
        case -1:
            orientation+='N';
            break;
        case 1:
            orientation+='S';
            break;
    }
    switch (data.x1-data.x2){
        case -1:
            orientation+='W';
            break;
        case 1:
            orientation+='E';
            break;
    }

    var boundary = data.type1 + '-' + data.type2;

    return {x: data.x1, y:data.y2, type:getEdgeSprite(boundary,orientation)}
}

function getEdgesMap(tileMap) {
    var edgesMap = [];
    tileMap.forEach(function(tile){
        var gradients = getGradients(tile, tileMap);
        if (gradients != undefined) {
            gradients.forEach(function(gradientData){
                edgesMap.push(getEdgeTile(gradientData));
            })
        }
    });

    return edgesMap;
}

/**
 * Place water
 * Place trees
 * Place decor
 */

/**
 * Draw
 */

function drawTileFromSheet(x, y, dx, dy, px, py) {
    var img = document.getElementById('spritesheet');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img,16*x,16*y,16*dx,16*dy,px,py,16*dx,16*dy)
}

function drawTile(tile) {
    var  spriteCoords = tileNameToSprite(tile.type);

    drawTileFromSheet(spriteCoords[0],spriteCoords[1],1,1,tile.x*TILE_SIZE,tile.y*TILE_SIZE)
}

function drawTileEdge(tile) {
    var  spriteCoords = getEdgeSprite(tile.boundary, tile.orientation);

    drawTileFromSheet(spriteCoords[0],spriteCoords[1],1,1,tile.x*TILE_SIZE,tile.y*TILE_SIZE)
}

function drawTiles(tilesArray) {
    tilesArray.forEach(function(tile){
        drawTile(tile)
    })
}

function drawEdges(x, y) {
    var tile = getTile(x,y);
    var edges = '';

    if (getTile(tile.x, tile.y - 1) != undefined && tile.type != getTile(tile.x, tile.y - 1).type) edges+='S';
    if (getTile(tile.x, tile.y + 1) != undefined && tile.type != getTile(tile.x, tile.y + 1).type) edges+='N';
    if (getTile(tile.x + 1, tile.y) != undefined && tile.type != getTile(tile.x + 1, tile.y).type) edges+='W';
    if (getTile(tile.x - 1, tile.y) != undefined && tile.type != getTile(tile.x - 1, tile.y).type) edges+='E';

    if (edges != '' && tile.type == 'water-r') {
        drawTile({x:tile.x,y:tile.y,type:'grass'});
        drawTileEdge({x:tile.x,y:tile.y,boundary:'water-r-grass',orientation:edges})
    }
    if (edges != '' && tile.type == 'rock') {
        drawTile({x:tile.x,y:tile.y,type:'grass'});
        drawTileEdge({x:tile.x,y:tile.y,boundary:'grass-rock',orientation:edges})
    }
}

function getTile(x, y) {
    if (x >= 0 && x < numberOfTilesX && y >= 0 && y < numberOfTilesY) return {x: x, y: y, type: tileMap[x*numberOfTilesY + y].type}
}

/**
 * EXECUTE
 */
canvas = document.getElementById('C');
 numberOfTilesX = canvas.width/TILE_SIZE;
numberOfTilesY = canvas.height/TILE_SIZE;

$(document).ready(function() {
    tileMap = generateTileMap(numberOfTilesX, numberOfTilesY);
    drawTiles(tileMap);
    /*edgesMap = getEdgesMap(tileMap);
    edgesMap.forEach(function(tile){
        var  spriteCoords = tile.type;
        //if (spriteCoords != undefined) drawTileFromSheet(spriteCoords[0],spriteCoords[1],1,1,tile.x*TILE_SIZE,tile.y*TILE_SIZE)
    })*/

    for(var i=0; i<numberOfTilesX; i++){
        for(var j=0; j<numberOfTilesY; j++){
            drawEdges(i,j);
        }
    }

});