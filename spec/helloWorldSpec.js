/**
 * Created by michogarcia on 17/03/16.
 */

describe("Hello World Spec:", function() {

    it("running specs", function() {
        var REAL = true;
        expect(REAL).toBeTruthy();
        expect(!REAL).not.toBeTruthy();
    })
});