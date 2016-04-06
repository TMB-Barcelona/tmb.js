var axios = require("axios");

var api = function(app_id, app_key, version) {
    var http = axios.create({
        baseURL: "https://api.tmb.cat/v" + encodeURIComponent((version || 1).toString()) + "/",
        params: {
            app_id: app_id,
            app_key: app_key
        }
    });

    http.interceptors.response.use(function(response) {
        return response.data
    });

    function search(query) {
        return http.get("search", {
            params: {
                q: query /*, fl: "*" */
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
