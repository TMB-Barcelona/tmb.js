/**
 * @classdesc
 *
 * Module to use TMB API Transit services
 */

'use strict';

var Transit = function(http) {

    /**
     * Get linies from all transport types (bus, subway and others) from Transit API.
     *
     * @param {Number} [codi] - The line code
     * @returns {Promise} - A promise to manage response from server
     */
    function linies(codi) {

        var url = "transit/linies/".concat((codi) ? codi.toString() : '');
        return http.get(url);
    }

    return {
        linies: linies
    };
};

module.exports = Transit;
