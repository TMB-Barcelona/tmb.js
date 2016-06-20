/**
 * @classdesc
 * 
 * 
 * @param http
 * @returns {{search: search}}
 */

'use strict';
var Page = require('./tmb.search.page');

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
        if(response && response.hasOwnProperty("response")) {
            response = response.response;
            if (response.hasOwnProperty("docs")) {
                response.docs = response.docs.map(function (item) {
                    if (item.hasOwnProperty('icona')) {
                        item.icona = icon_url(item);
                    }
                    return item;
                });
            }
        }
        return response;
    }

    // TODO change this hack to a set of normalized icons...
    function icon_url(item) {
        if (item.hasOwnProperty('icona')) {
            // Default value is a placeholder
            var size = "19";
            var bg_color = "0000FF"; // Blue
            var fg_color = "FFFFFF"; // White
            var text = item.icona;
            var url = "http://placehold.it/"+size+"/"+bg_color+"/"+fg_color+"?text="+text;

            // Some better known cases
            var base = "//dl.dropboxusercontent.com/u/2368219/tmb_pictos/";
            if (item.icona == "Bus-Parada") {
                url = base + "BUS.png";
            } else if (item.icona == "FM") {
                url = base + item.icona + ".png";
            } else if (item.icona == "Bus-Interc") {
                url = base + "INTERC.png";
            } else if (item.entitat == "Línies" && item.tipus == "Metro") {
                url = base + item.icona + ".png";
            } else if (item.entitat == "Línies" && (item.tipus == "Vertical" || item.tipus == "Horitzontal" )) {
                url = base + "NXB.png";
            }
        }
        return url;
    }

    return {
        ENTITATS: ENTITATS,
        config: config,
        query: query
    };
};

module.exports = Search;
