/**
 * @classdesc
 * 
 * 
 * @param http
 * @param options
 * @returns {{search: search}}
 */


'use strict';

var Search = function(http, options) {
    
    /**
     * Search function. Receives a term to search and returns the promise will be resolved with the response.
     * Use then(handleResponse, handleError) to get the response
     *
     * @param query term to search
     * @returns {axios.Promise}
     */
    function search(query) {
        var rows = 20;
        return http.get("search", {
            params: {
                q: query,
                rows: (options && options.search && options.search.rows) ? options.search.rows : rows
                /*, fl: "*" */
            }
        });
    }

    return {
        search: search
    }
};

module.exports = Search;