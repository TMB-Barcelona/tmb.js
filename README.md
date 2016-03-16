# tmb.js

TMB javascript library

## Dependencies

None, so far.

## Usage

### Browser globals (vanilla js)

    <script type="text/javascript" src="tmb.js"></script>
    <script type="text/javascript">
        var api = tmb("<developer.app_id>", "<developer.app_key>");
    </script>

### Browser with requirejs (AMD)

    require(["tmb"], function(tmb) {
        var api = tmb("<developer.app_id>", "<developer.app_key>");
    });

### Node (CommonJS)

    var api = require("tmb")("<developer.app_id>", "<developer.app_key>");
