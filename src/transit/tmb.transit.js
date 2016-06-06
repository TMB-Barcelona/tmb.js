/**
 * @classdesc
 *
 *
 */

'use strict';

var Transit = function(http) {
    
    function linies(codi) {

        var url = "transit/linies/".concat((codi) ? codi : '');
        return http.get(url);
    }

    return {
        linies: linies
    };
};

module.exports = Transit;
