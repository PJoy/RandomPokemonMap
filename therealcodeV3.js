/**
 * Created by pierreportejoie on 26/09/2016.
 */

var TILE_SIZE = 16;

/**
 * Generate Perlin noise maps
 */

function generateNoiseMap(w, h) {
    var noiseCanvas = document.getElementById('noiseCanvas');
    var ctxN = noiseCanvas.getContext('2d');

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

function drawTileFromSheet(x, y, dx, dy, px, py) {
    var img = document.getElementById('spritesheet');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img,16*x,16*y,16*dx,16*dy,px,py,16*dx,16*dy)
}

function drawTile(x,y,type) {
    var  sprite = sprites[type];

    if (sprite.dim[2] == undefined ) drawTileFromSheet (sprite.start[0],sprite.start[1],1,1,x*TILE_SIZE,y*TILE_SIZE);
    else {
        drawTileFromSheet (sprite.bg[0],sprite.bg[1],1,1,x*TILE_SIZE,y*TILE_SIZE);
        drawTileFromSheet (sprite.start[0],sprite.start[1],1,1,x*TILE_SIZE,y*TILE_SIZE)
    }
}

function parseJsonFiles() {
    var backgrounds = [];
    var sprites = [];

     $.getJSON('sprites.json',null, function(json){
         for (var tileName in json){
             sprites[tileName] = json[tileName];
             backgrounds.push(tileName);
         }
     });

    setTimeout(function() {

        $.getJSON('borderSprites.json', null, function (json) {
            for (var type in json.type) {
                if (!type.includes('*')) {
                    for (var coords in json.coords) {
                        sprites[type + coords] = {
                            dim: [1, 1],
                            start: [json.type[type][0] + json.coords[coords][0], json.type[type][1] + json.coords[coords][1]]
                        }
                    }
                } else {
                    backgrounds.forEach(function (bgName) {
                        if (type.replace('*', bgName) != 'grass-rock'
                            && type.replace('*', bgName) != 'grass-sand'
                            && type.replace('*', bgName) != 'rock-snow') {
                            for (var coords in json.coords) {
                                sprites[type.replace('*', bgName) + coords] = {
                                    dim: [1, 1, 2],
                                    bg: sprites[bgName].start,
                                    start: [json.type[type][0] + json.coords[coords][0], json.type[type][1] + json.coords[coords][1]]
                                }
                            }

                        }
                    })
                }
            }
        });
    }, 500);

    return sprites;
}

function setTile(x,y,z,type) {
    var img = document.getElementById('spritesheet');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img,16*x,16*y,16*dx,16*dy,px,py,16*dx,16*dy)
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
            tileMap.push({x: i, y: j, type: seedToType(noiseMap[Math.floor(i/2)*w+Math.floor(j/2)])})
        }
    }

    return tileMap;
}

TILE_TYPES = [
    'sea3',
    'sea2',
    'sea1',
    'sand',
    'grass',
    'rock',
    'snow',
];

function drawTiles(tilesArray) {
    tilesArray.forEach(function(tile){
        drawTile(tile.x,tile.y,tile.type)
    })
}

function getTile(x, y) {
    if (x >= 0 && x < numberOfTilesX && y >= 0 && y < numberOfTilesY) return {x: x, y: y, type: tileMap[y + x * numberOfTilesX].type}
}

function drawEdges(x, y) {
    var tile = getTile(x,y);
    var edges = '';
    var edgeType;

    if (getTile(tile.x, tile.y - 1) != undefined && tile.type != getTile(tile.x, tile.y - 1).type) {
        edges+='N';
        edgeType = getTile(tile.x, tile.y - 1).type;
    }
    if (getTile(tile.x, tile.y + 1) != undefined && tile.type != getTile(tile.x, tile.y + 1).type) {
        edges+='S';
        edgeType = getTile(tile.x, tile.y + 1).type;
    }
    if (getTile(tile.x + 1, tile.y) != undefined && tile.type != getTile(tile.x + 1, tile.y).type) {
        edges+='E';
        edgeType = getTile(tile.x + 1, tile.y).type;
    }
    if (getTile(tile.x - 1, tile.y) != undefined && tile.type != getTile(tile.x - 1, tile.y).type) {
        edges+='W';
        edgeType = getTile(tile.x - 1, tile.y).type;
    }

    if (edges == ''){
        if (getTile(tile.x - 1, tile.y - 1) != undefined && tile.type != getTile(tile.x - 1, tile.y - 1).type) {
            edges = 'N+W';
            edgeType = getTile(tile.x - 1, tile.y - 1).type;
        }
        if (getTile(tile.x + 1, tile.y - 1) != undefined && tile.type != getTile(tile.x + 1, tile.y - 1).type) {
            edges = 'N+E';
            edgeType = getTile(tile.x + 1, tile.y - 1).type;
        }
        if (getTile(tile.x + 1, tile.y + 1) != undefined && tile.type != getTile(tile.x + 1, tile.y + 1).type) {
            edges = 'S+E';
            edgeType = getTile(tile.x + 1, tile.y + 1).type;
        }
        if (getTile(tile.x - 1, tile.y + 1) != undefined && tile.type != getTile(tile.x - 1, tile.y + 1).type) {
            edges = 'S+W';
            edgeType = getTile(tile.x - 1, tile.y + 1).type;
        }
    }

    if ( edges != ''){
        if (sprites[tile.type+'-'+edgeType+edges] != undefined) drawTile(x,y,tile.type+'-'+edgeType+edges);
    }
}


canvas = document.getElementById('C');
numberOfTilesX = canvas.width/TILE_SIZE;
numberOfTilesY = canvas.height/TILE_SIZE;


$(document).ready(function() {

    sprites = parseJsonFiles();

    setTimeout(function(){
        tileMap = generateTileMap(numberOfTilesX, numberOfTilesY);
        drawTiles(tileMap);

        for(var i=0; i<numberOfTilesX-0; i++){
            for(var j=0; j<numberOfTilesY-0; j++){
                drawEdges(i,j);
            }
        }
    }, 1500);

});