/**
 * Created by pierreportejoie on 30/09/2016.
 */

var backgroundTiles =
{
    "water": {
        "dim": [1,1],
        "start": [46,26]
    },
    "sea3": {
        "dim": [1,1],
        "start": [8,26]
    },
    "sea2": {
        "dim": [1,1],
        "start": [11,26]
    },
    "sea1": {
        "dim": [1,1],
        "start": [6,28]
    },
    "sand": {
        "dim": [1,1],
        "start": [2,26]
    },
    "grass": {
        "dim": [1,1],
        "start": [1,20]
    },
    "rock": {
        "dim": [1,1],
        "start": [8,33]
    },
    "ground": {
        "dim": [1,1],
        "start": [2,16]
    },
    "ground2": {
        "dim": [1,1],
        "start": [14,16]
    },
    "dground": {
        "dim": [1,1],
        "start": [17,16]
    },
    "snow": {
        "dim": [1,1],
        "start": [5,33]
    },
    "snow1": {
        "dim": [1,1],
        "start": [20,16]
    },
    "rock4": {
        "dim": [1,1],
        "start": [23,16]
    },
    "rock5": {
        "dim": [1,1],
        "start": [26,16]
    },
    "rock6": {
        "dim": [1,1],
        "start": [23,18]
    },
    "snow2": {
        "dim": [1,1],
        "start": [20,16]
    },
    "sand2": {
        "dim": [1,1],
        "start": [17,26]
    },
    "sea4": {
        "dim": [1,1],
        "start": [20,26]
    },
    "sea5": {
        "dim": [1,1],
        "start": [20,26]
    },
    "water2": {
        "dim": [1,1],
        "start": [40,26]
    },
    "water3": {
        "dim": [1,1],
        "start": [63,26]
    },
    "water4": {
        "dim": [1,1],
        "start": [67,26]
    },
    "water5": {
        "dim": [1,1],
        "start": [71,26]
    },
    "sand4": {
        "dim": [1,1],
        "start": [17,33]
    },
    "rock2": {
        "dim": [1,1],
        "start": [20,33]
    },
    "rock3": {
        "dim": [1,1],
        "start": [23,33]
    }
};

var borderTiles =
{
    "coords":{
        "N+W": [0,0],
        "NW": [1,4],
        "N": [1,0],
        "N+E": [2,0],
        "NE": [0,4],
        "E": [2,1],
        "S+E": [2,2],
        "SE": [0,3],
        "S": [1,2],
        "S+W": [0,2],
        "SW": [1,3],
        "W": [0,1]
    },
    "type":{
        "ground-grass": [1,15],
        "ground2-bgrass2": [13,15],
        "dground-grass": [16,15],
        "rock4-rock6": [22,15],
        "rock5-rock6": [25,15],
        "tile1-tile2": [34,15],
        "tile3-tile4": [37,15],
        "sand-sea2": [1,25],
        "sand-sea1": [4,25],
        "sea3-sea2": [7,25],
        "sea2-sea1": [10,25],
        "sand2-sea5": [13,25],
        "sand2-sea4": [16,25],
        "sea5-sea4": [19,25],
        "water-grass": [45,25],
        "snow1-*": [19,15],
        "snow2-*": [28,15],
        "snow3-*": [31,15],
        "water2-*": [39,25],
        "water3-*": [62,25],
        "water4-*": [66,25],
        "water5-*": [70,25],
        "sand3-*": [1,32],
        "snow-*": [4,32],
        "rock-*": [7,32],
        "grass-*": [13,32],
        "sand4-*": [16,32],
        "rock2-*": [19,32],
        "rock3-*": [22,32],
        "*-grass": [4,15],
        "*-grass2": [7,15],
        "*-bgrass2": [10,15],
        "*-$": [10,32]
    }
};

var trees =
{
    "range1": {
        "start": [1,0],
        "dim": [3,4],
        "isTree": [1,1,1,1,2,2,1,1,1,1,2,2,1,1,1,1,2,2,1,1,1,1,2,2,1,1,1,1,2,2,1,1,1]
    },
    "range2": {
        "start": [1,4],
        "dim": [4,5],
        "isTree": [1,1,1,1,2,2,1,1,1,1,2,2,1,1,1,1,2,2,1,1,1,1,2,2]
    },
    "range3": {
        "start": [1,9],
        "dim": [3,3],
        "isTree": [1,1,1,1,2,1,1,1,1]
    },
    "range4": {
        "start": [28,9],
        "dim": [2,3],
        "isTree": [1,1]
    },
    "range5": {
        "start": [32,9],
        "dim": [3,4],
        "isTree": [1,1,1,1]
    },
    "range9": {
        "start": [71,9],
        "dim": [6,9],
        "isTree": [1,1,1,1]
    }
};


canvas = document.getElementById('C');
var ctx = canvas.getContext('2d');
tileSheet = document.getElementById('spritesheet');
sprites = [];
backgrounds = [];

for (var tileName in backgroundTiles){
    sprites[tileName] = backgroundTiles[tileName];
    backgrounds.push(tileName);
}

for (var borderType in borderTiles.type){
    if ( !borderType.includes('*') ){
        for ( var dir in borderTiles.coords){
            sprites[borderType+dir] = {
                dim: [1, 1],
                start: [borderTiles.type[borderType][0] + borderTiles.coords[dir][0],
                    borderTiles.type[borderType][1] + borderTiles.coords[dir][1]]
            }
        }
    } else if ( !borderType.includes('$') ) {
        backgrounds.forEach(function(bgName){
            newborderType = borderType.replace('*',bgName);

            for ( var dir in borderTiles.coords){
                if (sprites[newborderType+dir] == undefined){
                    sprites[newborderType+dir] = {
                        dim: [1, 1, 2],
                        bg: sprites[bgName].start,
                        start: [borderTiles.type[borderType][0] + borderTiles.coords[dir][0],
                            borderTiles.type[borderType][1] + borderTiles.coords[dir][1]]
                    }
                }
            }
        })
    } else {
        backgrounds.forEach(function(bgName){
            newborderType = borderType.replace('*',bgName);
            backgrounds.forEach(function(bgName2) {
                newborderType2 = newborderType.replace('$',bgName2);
                console.log(newborderType2);
                for ( var dir in borderTiles.coords){
                    if (sprites[newborderType2+dir] == undefined){
                        sprites[newborderType2+dir] = {
                            dim: [1, 1, 2],
                            bg: sprites[bgName].start,
                            start: [borderTiles.type[borderType][0] + borderTiles.coords[dir][0],
                                borderTiles.type[borderType][1] + borderTiles.coords[dir][1]]
                        }
                    }
                }
            })
        })
    }
}

var treeNumber = 1;
for (var range in trees){
    var i = 0;
    while (trees[range].isTree[i] != undefined){
        if (trees[range].isTree[i] == 1){
            sprites['tree'+treeNumber] = {
                dim: trees[range].dim,
                start: [trees[range].start[0] + i*trees[range].dim[0], trees[range].start[1]]
            };
            treeNumber++;
        }
        i++;
    }
}

/*for (var type in borderTiles.type) {
    if (!type.includes('*')) {
        for (var coords in borderTiles.coords) {
            sprites[type + coords] = {
                dim: [1, 1],
                start: [borderTiles.type[type][0] + borderTiles.coords[coords][0], borderTiles.type[type][1] + borderTiles.coords[coords][1]]
            }
        }
    } else {
        backgrounds.forEach(function (bgName) {
            for (var coords in borderTiles.coords) {
                sprites[type.replace('*', bgName) + coords] = {
                    dim: [1, 1, 2],
                    bg: sprites[bgName].start,
                    start: [borderTiles.type[type][0] + borderTiles.coords[coords][0], borderTiles.type[type][1] + borderTiles.coords[coords][1]]
                }
            }
        })
    }
}*/

/**
 * X = 0 --> left
 * Y = 0 --> top
 * Z = 0 --> background
 */

function setTile(x, y, z, arr, val, w = WIDTH/TILE_SIZE, h = HEIGHT/TILE_SIZE) {
    arr[x + w * y + w * h * z] = val;
}

function getTile(x, y, z, arr, w = WIDTH/TILE_SIZE, h = HEIGHT/TILE_SIZE) {
    return arr[x + w * y + w * h * z]
}

function drawTile(x, y, tile) {
    sprite = sprites[tile];
    if (sprite != undefined){
        if ( sprite.dim[2] == undefined ){
            ctx.drawImage(tileSheet, sprite.start[0] * TILE_SIZE, sprite.start[1] * TILE_SIZE,
            sprite.dim[0] * TILE_SIZE, sprite.dim[1] * TILE_SIZE,
            x * TILE_SIZE, y * TILE_SIZE,
            sprite.dim[0] * TILE_SIZE, sprite.dim[1] * TILE_SIZE );
        } else {
            ctx.drawImage(tileSheet, sprite.bg[0] * TILE_SIZE, sprite.bg[1] * TILE_SIZE,
                sprite.dim[0] * TILE_SIZE, sprite.dim[1] * TILE_SIZE,
                x * TILE_SIZE, y * TILE_SIZE,
                sprite.dim[0] * TILE_SIZE, sprite.dim[1] * TILE_SIZE );
            ctx.drawImage(tileSheet, sprite.start[0] * TILE_SIZE, sprite.start[1] * TILE_SIZE,
                sprite.dim[0] * TILE_SIZE, sprite.dim[1] * TILE_SIZE,
                x * TILE_SIZE, y * TILE_SIZE,
                sprite.dim[0] * TILE_SIZE, sprite.dim[1] * TILE_SIZE );
        }
    } else {
        console.log('tile '+ tile + ' doesn\'t exist !')
    }
}