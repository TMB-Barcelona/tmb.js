var fs = require('fs');
var path = require('path');

global.readJSON = function(filePath) {
  var absolutePath = path.resolve(process.cwd(), filePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
};
