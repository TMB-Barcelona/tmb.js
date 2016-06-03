/**
 * @classdesc
 * 
 * 
 * @param http
 * @returns {{search: search}}
 */

'use strict';

var Search = function(http) {

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
        return http.get("search", {
            params: {
                q: text,
                rows: options && options.resultsPerPage ? options.resultsPerPage : config.resultsPerPage
                /*, fl: "*" */
            }
        });
    }

    return {
        config: config,
        query: query
    };
};

module.exports = Search;
