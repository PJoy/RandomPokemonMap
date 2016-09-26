/**
 * Created by pierreportejoie on 26/09/2016.
 */

var TILE_SIZE = 16;

function Perlin(seed,px,py) {
    noise.seed(seed);
    var canvas = document.getElementById('noiseCanvas');
    canvas.width = 25;
    canvas.height = 25;
    var ctx = canvas.getContext('2d');
    var image = ctx.createImageData(canvas.width, canvas.height);
    var data = image.data;
    for (var x = 0; x < canvas.width; x++) {
        //if (x % 100 == 0) {
        //  noise.seed(Math.random());
        //}
        for (var y = 0; y < canvas.height; y++) {
            var value = Math.abs((noise.perlin2((x + px) / 10, (y + py) / 10)+1)/2);
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
}


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
    max = 720;

    var noiseValuesNormalized = [];

    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            noiseValuesNormalized.push((noiseValues[i*w+j]-min)/(max-min))
        }
    }

    MAX.push(max);

    return noiseValuesNormalized;
}

MAX = [];

function drawTileFromSheet(x, y, dx, dy, px, py) {
    var img = document.getElementById('spritesheet');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img,16*x,16*y,16*dx,16*dy,px-OFFSET*TILE_SIZE*2,py,16*dx,16*dy)
}

function drawTile(x,y,type) {
    var  sprite = sprites[type];

    if (sprite == undefined) console.log ("sprite undefined for type "+type+" (coords : "+x+", "+y+")");

    if (sprite.dim[2] == undefined ) {
        for (var i = 0; i < sprite.dim[0]; i++){
            for (var j = 0; j < sprite.dim[1]; j++){
                drawTileFromSheet (sprite.start[0]+i,sprite.start[1]+j,1,1,(x+i)*TILE_SIZE,(y+j)*TILE_SIZE);
            }
        }
    }
    else {
        drawTileFromSheet (sprite.bg[0],sprite.bg[1],1,1,x*TILE_SIZE,y*TILE_SIZE);
        drawTileFromSheet (sprite.start[0],sprite.start[1],1,1,x*TILE_SIZE,y*TILE_SIZE)
    }
}
backgrounds = [];

function parseJsonFiles() {
    backgrounds = [];
    var sprites = [];

    $.getJSON('sprites.json',null, function(json){
        for (var tileName in json){
            sprites[tileName] = json[tileName];
            backgrounds.push(tileName);
        }
    });

    $.getJSON('trees.json', null, function(json){
        var treeNumber = 1;
        for (var range in json){
            var i = 0;
            while (json[range].isTree[i] != undefined){
                if (json[range].isTree[i] == 1){
                    sprites['tree'+treeNumber] = {
                        dim: json[range].dim,
                        start: [json[range].start[0] + i*json[range].dim[0], json[range].start[1]]
                    };
                    treeNumber++;
                }
                i++;
            }
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
                            && type.replace('*', bgName) != 'sea1-grass'
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
    if (x >= 0 && x < numberOfTilesX && y >= 0 && y < numberOfTilesY) return {x: x, y: y, type: tileMap[y + x * numberOfTilesX].type};
    //else return {x: x, y: y, type: 'water4'};
}

undrawable = [];
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
    } else {
        undrawable.push([tile.x, tile.y]);
    }

    if ( edges != ''){
        if (sprites[tile.type+'-'+edgeType+edges] != undefined) drawTile(x,y,tile.type+'-'+edgeType+edges);
    }
}


canvas = document.getElementById('C');
numberOfTilesX = canvas.width/TILE_SIZE;
numberOfTilesY = canvas.height/TILE_SIZE;

function getTrunkBase(tree) {
    var sprite = sprites[tree];
    var base = {};

    base.xMin = (Math.floor(sprite.dim[0]/2-0.01));
    base.xMax = (Math.floor(sprite.dim[0]/2+0.01));
    //base.xMax = (Math.ceil(sprite.dim[0]/2));
    base.yMin = (Math.floor(sprite.dim[1]*3/4-0.01));
    base.yMax = (Math.floor(sprite.dim[1]*3/4+0.01));

    return base
}

function isGrowable(x, y, tree) {
    //if (x > numberOfTilesX*2/3 || y > numberOfTilesY) return false;
    var base = getTrunkBase(tree);

    if (getTile(x+base.xMin,y+base.yMin) != undefined && getTile(x+base.xMin,y+base.yMin).type != 'grass') return false;
    if (getTile(x+base.xMin,y+base.yMax) != undefined && getTile(x+base.xMin,y+base.yMax).type != 'grass') return false;
    if (getTile(x+base.xMax,y+base.yMin) != undefined && getTile(x+base.xMax,y+base.yMin).type != 'grass') return false;
    if (getTile(x+base.xMax,y+base.yMax) != undefined && getTile(x+base.xMax,y+base.yMax).type != 'grass') return false;


    for (var i = base.xMin-2; i<=base.xMax+2; i++){
        for (var j = base.yMin-2; j<=base.yMax+2; j++){
            undrawable.push([x+i,y+j])
        }
    }
    undrawable.push([x+base.xMin,y+base.yMin]);
    undrawable.push([x+base.xMin,y+base.yMax]);
    undrawable.push([x+base.xMax,y+base.yMin]);
    undrawable.push([x+base.xMax,y+base.yMax]);

    return true;
}

function drawTree(x, y, tree) {
    if (isGrowable(x,y,tree)) drawTile(x,y,tree);
}

function randomTileTypes() {
    var types = [];
    var x = Math.floor( 2 + Math.random()*6);

    for (var i = 0; i < x; i++) types.push(backgrounds[Math.floor(Math.random()*(backgrounds.length-1))])

    return types;
}

function drawBorder() {
    var img = document.getElementById('spritesheet');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "#575757";

    var x = 10;
    
    ctx.fillRect(0,0,800,16*x);
    ctx.fillRect(0,800-16*x,800,16*x);
    ctx.fillRect(0,0,16*x,800);
    ctx.fillRect(800-16*x,0,16*x,800);
}

sprites = parseJsonFiles();

$(document).ready(function() {

    //TILE_TYPES = randomTileTypes();


    DIVISIONS = 10;
    TIME = 1000/60;

var action = function (x,y) {

    OFFSET = (x%DIVISIONS)/DIVISIONS;

        setTimeout(function () {

            Perlin(0.11,Math.ceil(x/DIVISIONS),y);

            tileMap = generateTileMap(numberOfTilesX, numberOfTilesY);
            drawTiles(tileMap);

            for(var i=0; i<numberOfTilesX-0; i++){
                for(var j=0; j<numberOfTilesY-0; j++){
                    //if (i< numberOfTilesX*3/4+numberOfTilesX/4*(noise.simplex2(j,0)+1)/2){
                    drawEdges(i,j);
                    //}
                }
            }

            for (var j=0;j<numberOfTilesY; j++){
                for (var i=numberOfTilesX-1;i>=0; i--){
                    var tree = 'tree'+Math.floor(((noise.simplex2((getTile(i,j).x+2*Math.ceil(x/DIVISIONS) +999)*999, (getTile(i,j).y+2*y+999)*999)+1)/2)*57+1);
                    if (noise.simplex2(i+2*Math.ceil(x/DIVISIONS), j+2*y)>0.6) drawTree(i,j,tree);
                }
            }

            /*for (var i = 0; i < numberOfTilesX; i++ ){
                for (var j = 0; j < numberOfTilesY; j ++){
                    drawTree(i,j,'tree1');
                }
            }*/

            drawBorder();
        }, TIME);


    x++;

    setTimeout(function(){action(x,y);}, TIME);

};

    action(13,1);

});