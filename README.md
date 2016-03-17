# tmb.js

[![Build Status](https://travis-ci.org/geomatico/tmb.js.svg?branch=master)](https://travis-ci.org/geomatico/tmb.js)

TMB API Javascript library

## Dependencies

The ones defined in ``package.json``. Run ``npm install``.


## Running examples

### Browser

This will fire an http server:

```bash
npm start
```

### Node

```bash
npm run setup  # Make sure all requirements are met
node examples/node/search.js   # Run a node example
```

## Loading the library in different environments

### Vanilla browser (global var)

```html
<script type="text/javascript" src="axios.js"></script>
<script type="text/javascript" src="tmb.js"></script>
<script type="text/javascript">
    var api = tmb("<app_id>", "<app_key>");
</script>
```

### Browser with require.js (AMD module)

```javascript
require(["tmb"], function(tmb) {
    var api = tmb("<app_id>", "<app_key>");
});
```

### Node (CommonJS module)

```javascript
var api = require("tmb")("<app_id>", "<app_key>");
```

### Tests
```bash
$ npm test
```

To use Karma first, install Karma CLI
```bash
$ sudo npm install -g karma-cli
$ npm run karma
```


