/**
 * Created by pierreportejoie on 07/10/2016.
 */

/**
 * X = 0 --> left
 * Y = 0 --> top
 * Z = 0 --> background
 */

function setTile(x, y, z, val, w = WIDTH/TILE_SIZE, h = HEIGHT/TILE_SIZE, arr = GRID) {
    arr[x + w * y + w * h * z] = val;
}

function getTile(x, y, z, w = WIDTH/TILE_SIZE, h = HEIGHT/TILE_SIZE, arr = GRID) {
    return arr[x + w * y + w * h * z]
}