var axios = require("axios");
/**
 * @classdesc
 * Creates an API instance to use
 * Get app_id and app_key from
 *      https://developer.tmb.cat/
 *      
 *
 * @param app_id
 * @param app_key
 * @param {object} options:
 *      rows: indicates the number of records wo be returned (default 20)
 *
 * @api experimental
 */
var api = function(app_id, app_key, options) {
    var http = axios.create({
        baseURL: "https://api.tmb.cat/v" + encodeURIComponent((options && options.version || 1).toString()) + "/",
        params: {
            app_id: app_id,
            app_key: app_key
        }
    });

    http.interceptors.response.use(function(response) {
        return response.data
    });

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
                rows: (options && options.rows) ? options.rows : rows
                /*, fl: "*" */
            }
        });
    }

    return {
        helloWorld: "Hello World! Your API keys are " + JSON.stringify(http.defaults.params),
        http: http,
        search: search
    }
};

module.exports = api;
