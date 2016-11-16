/**
 * Created by pierreportejoie on 30/09/2016.
 */

//TODO : selective over for assets (for now, only 1 asset per tile)



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

    if (center != getTile(x,y-1,0,grid) && getTile(x,y-1,0,grid) != undefined){
        differentTile = getTile(x,y-1,0,grid);
        dir += 'N';
        if (center != getTile(x-1,y,0,grid) && getTile(x-1,y,0,grid) != undefined){
            dir += '+W';
        }
        if (center != getTile(x+1,y,0,grid) && getTile(x+1,y,0,grid) != undefined){
            dir += '+E'
        }
    } else if (center != getTile(x,y+1,0,grid) && getTile(x,y+1,0,grid) != undefined){
        differentTile = getTile(x,y+1,0,grid);
        dir += 'S';
        if (center != getTile(x-1,y,0,grid) && getTile(x-1,y,0,grid) != undefined){
            dir += '+W';
        }
        if (center != getTile(x+1,y,0,grid) && getTile(x+1,y,0,grid) != undefined){
            dir += '+E'
        }
    } else if (center != getTile(x-1,y,0,grid) && getTile(x-1,y,0,grid) != undefined){
        differentTile = getTile(x-1,y,0,grid);
        dir += 'W'
    } else if (center != getTile(x+1,y,0,grid) && getTile(x+1,y,0,grid) != undefined){
        differentTile = getTile(x+1,y,0,grid);
        dir += 'E'
    } else if (center != getTile(x-1,y-1,0,grid) && getTile(x-1,y-1,0,grid) != undefined){
        differentTile = getTile(x-1,y-1,0,grid);
        dir = 'NW';
    } else if (center != getTile(x+1,y-1,0,grid) && getTile(x+1,y-1,0,grid) != undefined){
        differentTile = getTile(x+1,y-1,0,grid);
        dir = 'NE';
    } else if (center != getTile(x-1,y+1,0,grid) && getTile(x-1,y+1,0,grid) != undefined){
        differentTile = getTile(x-1,y+1,0,grid);
        dir = 'SW';
    } else if (center != getTile(x+1,y+1,0,grid) && getTile(x+1,y+1,0,grid) != undefined) {
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

function getEnv(bg){
    if (bg == 'sea1') return 'water';
    if (bg == 'sand') return 'beach';
    if (bg == 'grass') return 'grass';
    if (bg == 'ground' || bg == 'ground2' || bg == 'dground') return 'ground';
    if (bg == 'rock') return 'rock';
    if (bg == 'snow') return 'snow';
    if (bg == 'water4') return 'swamp';
    return ;
}

function isDrawableSetTile(x,y,tile,grid){
    var orig = getTile(x,y,0,grid);


    var img = new Image();
    img.onload = function(){
        var ok = true;
        var sizeX = Math.ceil(img.width/16);
        var sizeY = Math.ceil(img.height/16);

        for ( var i = x; i < x + sizeX; i++ ) {
            for ( var j = y; j < y + sizeY; j++ ) {
                if ( getTile(i,j,0,grid) != orig || getTile(i,j,2,grid) != undefined || getTile(i,j,1,grid).dir != '') {
                    ok = false;
                }
            }
        }
        if (ok) setTile(x,y,2,grid,tile);
    };
    img.src = 'sprites/sprites/sprites_'+tile+'.png';
}

function isDrawable(img, x, y, map) {
    dimX = img.width;
    dimY = img.height;

    for ( var i = x; i < x + Math.floor((dimX+8)/TILE_SIZE); i++){
        for ( var j = y; j < y + Math.floor((dimY+8)/TILE_SIZE); j++){
            //console.log(getTile(i,j,1,map));
            if ( getTile(i,j,1,map).differentTile != undefined || getTile(i,j,2,map) != undefined ) return false;
        }
    }
    for ( var i = x; i < x + Math.ceil(dimX/TILE_SIZE); i++) {
        for (var j = y; j < y + Math.ceil(dimY / TILE_SIZE); j++) {
            setTile(i,j,2,map,'x');
        }
    }
    //console.log(1, img.src);
    setTile(x,y,2,map,img.src);
    return true
}

function checkBG(n, bg) {
    var metatype=null;

    for (var e in backgroundTypes){
        backgroundTypes[e].forEach(function(el){
            if (TILE_TYPES[bg] == el) metatype = e;
        })
    }

    for (var f in decoration){
     decoration[f].forEach(function(el){
            if (el == n && f != metatype) {
                return false
            }
        })
    }

    var bool = true;

    if (metatype == "water"){
        bool = false;
        decoration["water"].forEach(function(e){
            if (n == e) {
                bool = true;
                //console.log(e, metatype);
            }
        })
    }

    console.log(n, metatype);
    if (bool) return true;
}

function generateXLDetails(grid) {
    for ( var i = 0; i < WIDTH / TILE_SIZE; i++ ) {
        for ( var j = 0; j < HEIGHT / TILE_SIZE; j++ ) {
            if (Math.random() > 0.2 )
            {
                while (true){
                    var n = Math.floor(Math.random() * 227);
                    if (checkBG(n+2,getTile(i,j,0,grid))) break;
                }


                var img = new Image();
                img.onload = function(){
                    var ok = true;
                    /*var sizeX = Math.ceil(img.width/16);
                    var sizeY = Math.ceil(img.height/16);

                    for ( var i = x; i < x + sizeX; i++ ) {
                        for ( var j = y; j < y + sizeY; j++ ) {
                            if ( getTile(i,j,0,grid) != orig || getTile(i,j,2,grid) != undefined || getTile(i,j,1,grid).dir != '') {
                                ok = false;
                            }
                        }
                    }*/
                };
                img.src = 'sprites/sprites2/tile'+(n+2)+'.png';

                isDrawable(img,i,j,grid);
                /*if (isDrawable(img,i,j,grid)){
                    ctx.drawImage(img, 0, 0, img.width, img.height, i * TILE_SIZE, j * TILE_SIZE, img.width, img.height);
                }*/

               /* var bckg = getEnv(TILE_TYPES[getTile(i,j,0,grid)]);
                if (bckg != undefined) var tile = decoration[bckg][Math.floor(Math.random()*decoration[bckg].length)];
                isDrawableSetTile(i,j,tile,grid)
            */
            }
        }
    }
    return grid
}

function generateXSDetails(grid) {

}

function generateDetails(grid) {
    //generateXLDetails(grid);
    generateXSDetails();

    return grid;
}

function generateMap() {
    var bg = generateBackground();
    var bgBd = generateBorders(bg);
    var bgBdDe = generateDetails(bgBd);

    //console.log(bgBdDe);
    return bgBdDe;
}

function getBorderName(bTile){
    var z1 = bTile.tile;
    var z2 = bTile.differentTile;
    var dir = bTile.dir;

    //console.log(z1, z2, dir);
    if (z1 == undefined || z2 == undefined || dir == undefined) return;

    //particular cases
    if (TILE_TYPES[z1]+'-'+TILE_TYPES[z2] == 'sea1-sea2') return;
    if (TILE_TYPES[z1]+'-'+TILE_TYPES[z2] == 'sea2-sea3') return;
    if (TILE_TYPES[z1]+'-'+TILE_TYPES[z2] == 'grass-sand') return;
    if (TILE_TYPES[z1]+'-'+TILE_TYPES[z2] == 'sea2-sea1') return TILE_TYPES[z1]+'-'+TILE_TYPES[z2]+dir;
    if (TILE_TYPES[z1]+'-'+TILE_TYPES[z2] == 'sea3-sea2') return TILE_TYPES[z1]+'-'+TILE_TYPES[z2]+dir;
    if (TILE_TYPES[z1]+'-'+TILE_TYPES[z2] == 'sand-grass') return TILE_TYPES[z1]+'-'+TILE_TYPES[z2]+dir;
    if (z2 > z1) return;

    return TILE_TYPES[z1]+'-'+TILE_TYPES[z2]+dir;
}

function drawMap(map) {
    var zMax = Math.ceil(map.length/WIDTH/TILE_SIZE/HEIGHT/TILE_SIZE);

    for ( var i = 1; i < WIDTH/TILE_SIZE-1; i++){
        for ( var j = 1; j < HEIGHT/TILE_SIZE-1; j++){
            var bkg = TILE_TYPES[getTile(i,j,0,map)];
            drawTile(i, j, TILE_TYPES[map[i + WIDTH/TILE_SIZE * j]]);
            var bn = getBorderName(getTile(i,j,1,map));
            if ( bn != undefined ) drawTile(i, j, bn);
        }
    }
}

//CONF CONSTS
TILE_SIZE = 16;
/*TILE_TYPES = [
    "dground",
    "water4"
];*/
TILE_TYPES = [
    backgrounds[Math.floor(Math.random()*backgrounds.length)],
    backgrounds[Math.floor(Math.random()*backgrounds.length)],
    backgrounds[Math.floor(Math.random()*backgrounds.length)],
    backgrounds[Math.floor(Math.random()*backgrounds.length)],
    backgrounds[Math.floor(Math.random()*backgrounds.length)]
];
console.log(TILE_TYPES);
WIDTH = 800;
HEIGHT = 800;
GRID = [];

$(document).ready(function() {
     map = generateMap();
    drawMap(map);
    window.setTimeout(function(){
    //generateXLDetails(map);
    },100);

    window.setTimeout(function(){

     imgs = [];
    for ( var ii = 1; ii < WIDTH/TILE_SIZE-1; ii++){
        for ( var jj = 1; jj < HEIGHT/TILE_SIZE-1; jj++){
            var tile = getTile(ii,jj,2,map);
            if (tile != undefined && tile != 'x'){
                var img = new Image();
                img.src = tile;
                imgs.push([img, ii*16, jj*16])
            }
        }
    }
    imgs.forEach(function(e){
        ctx.drawImage(e[0],e[1],e[2]);
    });
    },100)

});