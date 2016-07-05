/**
 * @classdesc
 *
 * Module to use TMB API Transit services
 */

'use strict';

var Transit = function(http) {
    var estacions = function(linia, estacio) {
        return http.get("transit/linies/metro/" + linia + '/estacions/' + (estacio || ''));
    };

    var parades = function(linia, parada) {
        return http.get("transit/linies/bus/" + linia + '/parades/' + (parada || ''));
    };

    var linies = function(codi) {
        return  {
            info: function() {
                return http.get("transit/linies/" + (codi || ''));
            },
            parades: function(parada) {
                if(!codi) {
                    throw 'Something wrong happens, codi it is necessary!!';
                }
                return parades(codi, parada);
            },
            estacions: function(estacio) {
                if(!codi) {
                    throw 'Something wrong happens, codi it is necessary!!';
                }
                return estacions(codi, estacio);
            }
        }
    };

    return {
        linies: linies
    };
};

module.exports = Transit;