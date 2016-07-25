'use strict';

var axios = require("axios");
var Search = require('./search/tmb.search');
var Transit = require('./transit/tmb.transit');
var Map = require('./map/tmb.map');

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
 *      version {Number}: indicates the api version to use. Default: v1
 *
 * @api experimental
 */
var api = function(app_id_or_url, app_key) {

    var readJSON = function(url) {
        var xhr = new XMLHttpRequest();
        var json = null;

        xhr.open("GET", url, false);

        xhr.onload = function(e) {
            if (xhr.status === 200) {
                json = JSON.parse(xhr.responseText);
            } else {
                console.error('readJSON', url, xhr.statusText);
            }
        };

        xhr.onerror = function (e) {
            console.error('readJSON', url, xhr.statusText);
        };

        xhr.send(null);
        return json;
    };

    var keys = {};
    if (app_key) {
        keys.app_id = app_id_or_url;
        keys.app_key = app_key;
    } else {
        keys = readJSON(app_id_or_url);
    }

    var http = axios.create({
        baseURL: "https://api.tmb.cat/v1/",
        params: keys
    });
    
    http.interceptors.response.use(function(response) {
        return response.data
    });
    
    var search = Search(http);
    var transit = Transit(http);
    var map = Map(http, keys);

    return {
        helloWorld: "Hello World! Your API keys are " + JSON.stringify(http.defaults.params),
        http: http,
        search: search,
        transit: transit,
        map: map
    }
};

module.exports = api;
