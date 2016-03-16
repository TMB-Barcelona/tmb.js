(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([/*'dependency'*/], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node
        module.exports = factory(/*require('dependency')*/);
    } else {
        // Browser globals
        root.tmb = factory(/*root.dependency*/);
    }
}(this, function (/*dependency*/) {
    return function(app_id, app_key) {
        return {
            helloWorld: "Hello World! Your API keys are app_id=" + app_id + "&app_key=" + app_key
        }
    };
}));
