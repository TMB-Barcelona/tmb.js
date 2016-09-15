'use strict';

var Map = function(http, keys) {

    return  {
        BCN_BBOX: [[41.246, 1.898],
            [41.533, 2.312]],
        BCN_CENTER: [41.383333, 2.183333],
        BCN_ZOOM: 8,
        LAYERS: {
            CARTO: {
                url: "http://api.tmb.cat/v1/maps/gwc/wms",
                layers: "TMB:CARTO_SOFT",
                format: "image/png8"
            },
            BUS: {
                url: "http://api.tmb.cat/v1/maps/wms",
                layers: "TMB:XARXA_BUS",
                format: "image/png8"
            },
            METRO: {
                url: "http://api.tmb.cat/v1/maps/wms",
                layers: "TMB:XARXA_METRO",
                format: "image/png8"
            },
            PNOA: {
                url: "http://www.ign.es/wms-inspire/pnoa-ma",
                layers: 'OI.OrthoimageCoverage',
                format: 'image/png'
            }
        }
    };
};

module.exports = Map;
