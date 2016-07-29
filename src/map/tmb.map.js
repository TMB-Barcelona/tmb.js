'use strict';
var Transit = require('../transit/tmb.transit');

var Map = function(http, keys) {

    // Tiny little class to execute a sequence of async actions in the same order they had been enqueued.
    function PromiseQueue() {
        var last = Promise.resolve();
        return {
            push: function(action) {
                var coming = new Promise(function(resolve) {
                    last.then(function() {
                        action(resolve); // Action callback should call resolve() to allow the next enqueued action to be fired up.
                    });
                });
                last = coming;
            }
        }
    }

    // Used in map actions, so the last view will match the last command issued by the user.
    var mapActions = new PromiseQueue();

    var transit = Transit(http);

    var BCN_BBOX = [
        [41.246, 1.898],
        [41.533, 2.312]
    ];

    var gwcLayer = function(name) {
        return L.tileLayer.wms("http://api.tmb.cat/v1/maps/gwc/wms", {
            layers: name,
            format: 'image/png8',
            transparent: false,
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

    return function(div) {
        var baseLayer = gwcLayer('TMB:CARTO_SOFT');
        var overlay;

        var busLayer = wmsLayer('TMB:XARXA_BUS');
        var metroLayer = wmsLayer('TMB:XARXA_METRO');

        var map = new L.Map(div).fitBounds(BCN_BBOX);
        baseLayer.addTo(map);

        var setOverlay = function(layer) {
            mapActions.push(function(next) {
                if (overlay) {
                    map.removeLayer(overlay);
                    overlay = null;
                }
                if (layer) {
                    overlay = layer.addTo(map);
                    // TODO reset filters, if needed.
                }
                next();
            });
        };

        map.metro = function(linia) {
            setOverlay(metroLayer);

            if (linia) {
                mapActions.push(function(next) {
                    transit.linies.metro(linia).info().then(function(response) {
                        metroLayer.setParams({CQL_FILTER: 'CODI_LINIA=' + linia});
                        map.fitBounds(L.geoJson(response).getBounds(), {animate: false});
                        next();
                    }, next);
                });
            } else {
                mapActions.push(function(next) {
                    delete(metroLayer.wmsParams.CQL_FILTER);
                    map.fitBounds(BCN_BBOX);
                    metroLayer.redraw();
                    next();
                });
            }

            return {
                estacio: function(estacio) {
                    mapActions.push(function(next) {
                        transit.linies.metro(linia || '').estacions(estacio).then(function (response) {
                            map.fitBounds(L.geoJson(response).getBounds(), {animate: false});
                            next();
                        }, next);
                    });
                }
            }
        };

        map.bus = function(linia) {
            setOverlay(busLayer);

            if (linia) {
                mapActions.push(function(next) {
                    transit.linies.bus(linia).info().then(function (response) {
                        busLayer.setParams({CQL_FILTER: 'CODI_LINIA=' + linia});
                        map.fitBounds(L.geoJson(response).getBounds(), {animate: false});
                        next();
                    }, next);
                })
            } else {
                mapActions.push(function(next) {
                    delete(busLayer.wmsParams.CQL_FILTER);
                    map.fitBounds(BCN_BBOX);
                    busLayer.redraw();
                    next();
                });
            }

            return {
                parada: function(parada) {
                    mapActions.push(function(next) {
                        transit.linies.bus(linia || '').parades(parada).then(function(response) {
                            map.fitBounds(L.geoJson(response).getBounds(), {animate: false});
                            next();
                        }, next);
                    });
                }
            }
        };

        return map;
    };
};

module.exports = Map;
