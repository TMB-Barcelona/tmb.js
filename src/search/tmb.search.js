/**
 * @classdesc
 * 
 * 
 * @param http
 * @returns {{search: search}}
 */

'use strict';

var Search = function(http) {
    var ENTITATS = {
        LINIES: 'Línies',
        INTERCANVIADORS: 'Intercanviadors',
        PARADES: 'Parades',
        ESTACIONS: 'Estacions',
        ACCESSOS: 'Accessos'
    };

    var config = {
        resultsPerPage: 20
    };

    /**
     * Search function. Receives a term to search and returns the promise will be resolved with the response.
     * Use then(handleResponse, handleError) to get the response
     *
     * @param query term to search
     * @returns {axios.Promise}
     */
    function query(text, options) {
        options = options || {};

        var params = {
            q: text,
            rows: options.hasOwnProperty('resultsPerPage') ? options.resultsPerPage : config.resultsPerPage
        };

        if (options.hasOwnProperty('entitats')) {
            params.entitats = [].concat(options.entitats).join();
        }

        if (options.hasOwnProperty('detail') && options.detail == true) {
            params.fl = "*";
        }

        return http.get("search", {
            params: params
        });
    }

    return {
        ENTITATS: ENTITATS,
        config: config,
        query: query
    };
};

module.exports = Search;
