/**
 * @classdesc
 *
 * Module to use TMB API Transit services
 */

'use strict';

var Transit = function(http) {

    var icon = require('../helpers/tmb.icon');

    var linies = function(linia) {

        var info = function() {
            return http.get("transit/linies/" + (linia || ''));
        };

        return  {
            info: info
        }
    };

    linies.metro = function(linia) {
        var info = function() {
            return http.get("transit/linies/metro/" + (linia || ''));
        };

        var estacions = function(estacio) {

            function sort(estacions) {
                estacions.features.sort(function(f1, f2) {
                    return f1.properties.ORDRE_ESTACIO - f2.properties.ORDRE_ESTACIO;
                });
                return estacions;
            }

            var estacions = http.get("transit/linies/metro/" + linia + '/estacions/' + (estacio || '')).then(sort).then(icon.estacions);

            Object.defineProperties(estacions, {
                corresp: {
                    get: function() {
                        return http.get("transit/linies/metro/" + linia + '/estacions/' + (estacio || '') + '/corresp');
                    }
                }
            });

            estacions.accessos = function(acces) {
                return http.get("transit/linies/metro/" + linia + '/estacions/' + (estacio || '') + '/accessos/' + (acces || ''));
            };

            return estacions;
        };

        return {
            info: info,
            estacions: estacions
        }

    };

    linies.bus = function(linia) {
        var info = function() {
            return http.get("transit/linies/bus/" + (linia || ''));
        };

        var parades = function(parada) {

            var parades = http.get("transit/linies/bus/" + linia + '/parades/' + (parada || '')).then(icon.parades);

            Object.defineProperties(parades, {
                anada: {
                    get: function() {
                        return this.then(filtraParades.bind(this, "A"));
                    }
                },
                tornada: {
                    get: function() {
                        return this.then(filtraParades.bind(this, "T"));
                    }
                },
                corresp: {
                    get: function() {
                        return http.get("transit/linies/bus/" + linia + '/parades/' + (parada || '') + '/corresp');
                    }
                }
            });
            return parades;
        };

        var filtraParades = function(sentit, parades) {
            var newParades = {
                type: parades.features.type,
                crs: parades.features.crs
            };

            newParades.features = parades.features.slice(0).filter(function(feature) {
                return feature.properties.SENTIT == sentit;
            }).sort(function(f1, f2) {
                return f1.properties.ORDRE - f2.properties.ORDRE;
            });

            newParades.totalFeatures = newParades.features.length;

            return newParades;
        };

        return {
            info: info,
            parades: parades
        }
    };

    var parades = function(parada) {
        var parades = http.get('transit/parades/' + (parada || '')).then(icon.parades);

        Object.defineProperties(parades, {
            corresp: {
                get: function() {
                    return http.get("transit/parades/" + (parada || '') + '/corresp');
                }
            }
        });
        return parades;

    };

    return {
        linies: linies,
        parades: parades
    };
};

module.exports = Transit;