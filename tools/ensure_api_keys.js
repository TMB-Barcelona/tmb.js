var fs = require('fs');
var file_formats = {
  'api_v2_keys.json': {
    "app_id": "<your_app_id>",
    "app_key": "<your_app_key>"
  },
  'api_v3_client.json': {
    "client_id": "<auth0_test_client_id>",
    "client_secret": "<auth0_test_client_secret>"
  }
};

var error = 0;

for(var filename in file_formats) {
  if (!fs.existsSync(filename)) {
    console.error("\nNo '" + filename + "' file found. Please create it with the following format:");
    console.error(JSON.stringify(file_formats[filename], null, 2));
    error++;
  } else {
    console.info("OK, file '" + filename + "' exists.");
  }
}

process.exit(error);
