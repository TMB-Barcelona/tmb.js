var Map = function(keys) {

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
        var map = new L.Map(div).setView([41.3987, 2.1574], 12);

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
            // TODO: If linia, filter & center on linia.
            return {
                estacio: function(estacio) {
                    // TODO: If estacio, filter & center on estacio.
                }
            }
        };

        var bus = function(linia) {
            setOverlay(busLayer);
            // TODO: If linia, filter & center on linia.
            return {
                parada: function(parada) {
                    // TODO: If parada, filter & center on parada.
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
