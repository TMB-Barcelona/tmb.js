/**
 * Created by michogarcia on 9/09/16.
 */
describe("tmb.js Map spec:", function() {
    var tmb = require('../src/tmb');
    var keys = readJSON('api_keys.json');
    var api = tmb(keys.app_id, keys.app_key);

    var div = document.createElement("div");
    div.setAttribute('id', 'map');
    document.body.appendChild(div);

    var map = api.map(document.getElementById("map"));

    var giveMeLayer = function(name) {
        map.eachLayer(function(layer) {
            if (layer.wmsParams.layers === name) {
                return layer;
            }
            return null;
        })
    };

    it("should have a map with default layer", function() {
        var layer = giveMeLayer("TMB:CARTO_SOFT");
        expect(layer).not.toBe(null);
    });

    it("should have a metro layer after api calls metro()", function(){
        map.metro();
        var layer = giveMeLayer('TMB:XARXA_METRO');
        expect(layer).not.toBe(null);
    });

    it("should have a bus layer after api calls bus()", function(){
        map.metro();
        var layer = giveMeLayer('TMB:XARXA_BUS');
        expect(layer).not.toBe(null);
    });

    it("should make real HTTP calls and get something in response", function(done) {
        api.search.query("catalunya").then(function(response) {
            expect(response.page.totalRecords).toBeGreaterThan(0);
            done();
        }, fail)
    });
});