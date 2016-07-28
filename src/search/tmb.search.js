/**
 * @classdesc
 * 
 * 
 * @param http
 * @returns {{search: search}}
 */

'use strict';
var Page = require('./tmb.search.page');

var icon = require('../helpers/tmb.icon');

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

        if (options.hasOwnProperty('page')) {
            params.start = params.rows * (options.page-1);
        }

        return http.get("search", {
            params: params
        }).then(parse).then(function(response) {
            return Page({
                text: text,
                options: options
            }, response, query);
        });
    }

    function parse(response) {
        if (response && response.hasOwnProperty("response")) {
            response = response.response;
        }
        return icon.search(response);
    }

    return {
        ENTITATS: ENTITATS,
        config: config,
        query: query
    };
};

module.exports = Search;
