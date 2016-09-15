/**
 * Created by michogarcia on 9/09/16.
 */
var giveMeLayer = function(map, name) {
    var theLayer = undefined;
    map.eachLayer(function(layer) {
        if (layer.wmsParams.layers === name) {
            theLayer = layer;
        }
    });

    return theLayer;
};

describe("tmb.js Map spec:", function() {
    var tmb = require('../src/tmb');
    var keys = readJSON('api_keys.json');
    var api = tmb(keys.app_id, keys.app_key);

    var div = document.createElement("div");
    div.setAttribute('id', 'map');
    document.body.appendChild(div);

    var map = api.map(document.getElementById("map"));

    it("should have a map with default layer", function() {
        var layer = giveMeLayer(map, "TMB:CARTO_SOFT");
        expect(layer).not.toBe(undefined);
    });

    it("should have a metro layer after api calls metro()", function(){

    });

    it("should have a bus layer after api calls bus()", function(){

    });
});