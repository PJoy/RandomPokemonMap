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
        "*-grass": [4,15],
        "*-grass2": [7,15],
        "*-bgrass2": [10,15],
        "ground2-bgrass2": [13,15],
        "dground-grass": [16,15],
        "snow1-*": [19,15],
        "rock4-rock6": [22,15],
        "rock5-rock6": [25,15],
        "snow2-*": [28,15],
        "snow3-*": [31,15],
        "tile1-tile2": [34,15],
        "tile3-tile4": [37,15],
        "sand-sea2": [1,25],
        "sand-sea1": [4,25],
        "sea3-sea2": [7,25],
        "sea2-sea1": [10,25],
        "sand2-sea5": [13,25],
        "sand2-sea4": [16,25],
        "sea5-sea4": [19,25],
        "water2-*": [39,25],
        "water-grass": [45,25],
        "water3-*": [62,25],
        "water4-*": [66,25],
        "water5-*": [70,25],
        "sand3-*": [1,32],
        "snow-*": [4,32],
        "rock-*": [7,32],
        "*-*": [10,32],
        "grass-*": [13,32],
        "sand4-*": [16,32],
        "rock2-*": [19,32],
        "rock3-*": [22,32]
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