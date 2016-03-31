(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['../node_modules/axios/dist/axios.min'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node
        module.exports = factory(require('axios'));
    } else {
        // Browser globals
        root.tmb = factory(root.axios);
    }
}(this, function(axios) {

    return function(app_id, app_key, version) {
        var http = axios.create({
            baseURL: "https://tmbapi.tmb.cat/v" + encodeURIComponent((version || 1).toString()) + "/",
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
            search: search
        }
    };
}));
