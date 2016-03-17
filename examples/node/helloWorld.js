var tmb = require("../../src/tmb");
var keys = require("../../api_keys.json");
var api = tmb(keys.app_id, keys.app_key);
console.log(api.helloWorld);
