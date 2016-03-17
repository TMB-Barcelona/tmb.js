var tmb = require("../../src/tmb");
var keys = require("../../api_keys.json");

// Instantiate with user keys
var api = tmb(keys.app_id, keys.app_key);

// Display a greeting message
console.log(api.helloWorld);

// Search for a term
api.search("catalunya").then(console.log, console.error);
