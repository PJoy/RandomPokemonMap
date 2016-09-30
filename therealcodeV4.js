/**
 * Created by pierreportejoie on 30/09/2016.
 */

function generateNoiseMap(seed, width, height, xOffset, yOffset) {

}


function generateBackground() {
    var noiseMap = generateNoiseMap();
    var bg = [];

    return newLayer
}
function generateBorders() {

}
function generateDetails() {

}
function generateMap() {
    var bg = generateBackground();
    generateBorders(bg);
    generateDetails(bg);
}
function drawMap(map) {

}

//CONF CONSTS


$(document).ready(function() {
    var map = generateMap();
    drawMap(map);
});