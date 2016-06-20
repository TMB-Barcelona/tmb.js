/**
 * @classdesc
 *
 * Module to use TMB API Transit services
 */

'use strict';

var Transit = function(http) {

    return {
        linies: function(codi) {
            return http.get("transit/linies/" + (codi || ''));
        },
        parades: function(codi) {
            return http.get("transit/parades/" + (codi || ''));
        },
        estacions: function(codi) {
            return http.get("transit/estacions/" + (codi || ''));
        }
    };
};

module.exports = Transit;
