/**
 * @classdesc
 *
 * Module to use TMB API Transit services
 */

'use strict';

var Transit = function(http) {

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
            return http.get("transit/linies/metro/" + linia + '/estacions/' + (estacio || ''));
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
            var parades = http.get("transit/linies/bus/" + linia + '/parades/' + (parada || ''));
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
                }
            });
            return parades;
        };

        var filtraParades = function(sentit, parades) {
            parades.features = parades.features.filter(function(feature) {
                return feature.properties.SENTIT == sentit;
            }).sort(function(f1, f2) {
                return f1.properties.ORDRE - f2.properties.ORDRE;
            });
            parades.totalFeatures = parades.features.length;
            return parades;
        };

        return {
            info: info,
            parades: parades
        }
    };

    return {
        linies: linies
    };
};

module.exports = Transit;