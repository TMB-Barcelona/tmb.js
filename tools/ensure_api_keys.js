var fileExists = require('file-exists');
var FILE = 'api_keys.json';

if (!fileExists(FILE)) {
    console.info("No '" + FILE + "' file found. Please provide your TMB API keys:");

    // Inspired in https://github.com/geomatico/password-simple-manager/blob/develop/bin/create.js
    var prompt = require('prompt');
    prompt.start();
    prompt.message = "Please write your";
    prompt.delimiter = " ";
    prompt.get(['app_id', 'app_key'], function (err, config) {
        if (config.app_id && config.app_key) {
            var jsonfile = require('jsonfile');
            jsonfile.writeFile(FILE, config, function(err) {
                if (err) {
                    console.error(err);
                    process.exit(2);
                } else {
                    console.info("OK, file '" + FILE + "' created.");
                }
            });
        } else {
            console.error("========================================================");
            console.error("Both keys are mandatory!!                               ");
            console.error("Please get your API keys from https://developer.tmb.cat/");
            console.error("========================================================");
            process.exit(1);
        }
    });
} else {
    console.info("OK, file '" + FILE + "' exists.");
}
