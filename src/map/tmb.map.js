'use strict';
var Transit = require('../transit/tmb.transit');

var Map = function(http, keys) {

    var transit = Transit(http);

    var BCN_BBOX = [
        [41.246, 1.898],
        [41.533, 2.312]
    ];

    var gwcLayer = function(name) {
        return L.tileLayer.wms("http://api.tmb.cat/v1/maps/gwc/wms", {
            layers: name,
            format: 'image/png8',
            transparent: true,
            app_key: keys.app_key,
            app_id: keys.app_id
        });
    };

    var wmsLayer = function(name) {
        return L.tileLayer.wms("http://api.tmb.cat/v1/maps/wms", {
            layers: name,
            format: 'image/png8',
            transparent: true,
            app_key: keys.app_key,
            app_id: keys.app_id
        });
    };

    var map = function(div) {
        var map = new L.Map(div).fitBounds(BCN_BBOX);

        var baseLayer = gwcLayer('TMB:CARTO_SOFT').addTo(map);
        var overlay;

        var busLayer = wmsLayer('TMB:XARXA_BUS');
        var metroLayer = wmsLayer('TMB:XARXA_METRO');

        var setOverlay = function(layer) {
            if (overlay) {
                map.removeLayer(overlay);
                overlay = null;
            }
            if (layer) {
                overlay = layer.addTo(map);
                // TODO reset filters, if needed.
            }
        };

        var metro = function(linia) {
            setOverlay(metroLayer);

            if (linia) {
                transit.linies.metro(linia).info().then(function(response) {
                    metroLayer.setParams({
                        CQL_FILTER: 'CODI_LINIA=' + linia
                    });
                    map.fitBounds(L.geoJson(response).getBounds(), {animate:false});
                });
            } else {
                delete(metroLayer.wmsParams.CQL_FILTER);
                map.fitBounds(BCN_BBOX);
                metroLayer.redraw();
            }

            return {
                estacio: function(estacio) {
                    transit.linies.metro(linia || '').estacions(estacio).then(function(response) {
                        map.fitBounds(L.geoJson(response).getBounds(), {animate:false});
                    });
                }
            }
        };

        var bus = function(linia) {
            setOverlay(busLayer);

            if (linia) {
                transit.linies.bus(linia).info().then(function(response) {
                    busLayer.setParams({
                        CQL_FILTER: 'CODI_LINIA=' + linia
                    });
                    map.fitBounds(L.geoJson(response).getBounds(), {animate:false});
                });
            } else {
                delete(busLayer.wmsParams.CQL_FILTER);
                map.fitBounds(BCN_BBOX);
                busLayer.redraw();
            }

            return {
                parada: function(parada) {
                    transit.linies.bus(linia || '').parades(parada).then(function(response) {
                        map.fitBounds(L.geoJson(response).getBounds(), {animate:false});
                    });
                }
            }
        };

        return {
            metro: metro,
            bus: bus
        };
    };

    return map;
};

module.exports = Map;
