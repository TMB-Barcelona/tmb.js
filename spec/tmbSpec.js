describe("tmb.js spec:", function() {
    var tmb = require('../src/tmb');

    beforeEach(function() {
        // Auth0 authorization process can be slow.
        // Increase default timeout for jasmine async calls to 60 seconds.
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

    it("API v2 should use app_id and app_key credentials", function(done) {
        var keys = readJSON('api_v2_keys.json');
        var api_v1 = tmb(keys.app_id, keys.app_key);

        api_v1.search.query("catalunya").then(function(response) {
            expect(response.page.totalRecords).toBeGreaterThan(0);
            done();
        }, fail);
    });

    it("API v3 should use an auth0 token requested by delegation", function(done) {
        var axios = require('axios');
        var test_user = readJSON('api_v3_user.json');

        var getAppToken = axios.post('https://tmb.eu.auth0.com/oauth/ro', {
            connection: "Username-Password-Authentication",
            grant_type: "password",
            client_id: test_user.client_id,
            username: test_user.username,
            password: test_user.password,
            scope: "openid email api version"
        });

        getAppToken.then(getApi).then(search).then(parse).catch(showError);

        function getApi(response) {
            var id_token = response.data.id_token;
            if(!id_token) fail(response.data);
            return tmb.v3(test_user.client_id, id_token);
        }

        function search(api_v3) {
            return api_v3.search.query("catalunya").catch(showError);
        }

        function parse(response) {
            expect(response.page.totalRecords).toBeGreaterThan(0);
            done();
        }

        function showError(response) {
            fail(JSON.stringify(response,null,2));
        }

    });

    it("API v4 should use a valid auth0 access_token to access api", function(done) {
        var axios = require('axios');
        var client = readJSON('api_v4_client.json');

        var getAppToken = axios.post('https://tmb.eu.auth0.com/oauth/token', {
            grant_type: "client_credentials",
            client_id: client.client_id,
            client_secret: client.client_secret,
            audience: "https://api.tmb.cat",
            scope: "api:v3 read:maps read:transit read:search"
        });

        getAppToken.then(getApi).then(search).then(parse).catch(showError);

        function getApi(response) {
            var access_token = response.data.access_token;
            if(!access_token) fail(response.data);
            return tmb.v4(access_token);
        }

        function search(api_v4) {
            return api_v4.transit.linies.bus(22).parades().catch(showError);
        }

        function parse(response) {
            expect(response.totalFeatures).toBeGreaterThan(0);
            done();
        }

        function showError(response) {
            fail(JSON.stringify(response,null,2));
        }

    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});
