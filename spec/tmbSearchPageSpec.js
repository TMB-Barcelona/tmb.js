describe("tmb.search.page.js spec:", function() {

    var Page = require('../src/search/tmb.search.page');

    describe("API search paged results", function() {
        var pagedResults;

        beforeEach(function() {
            var request = {
                text: "catalunya"
            };

            var response = readJSON('spec/fixtures/search.catalunya.json').response;

            // This is a mock
            var query = function(text, options) {
                var page = options.hasOwnProperty('page') ? (options.page-1) : 0;
                var records = options.hasOwnProperty('resultsPerPage') ? options.resultsPerPage : 20;
                var newResponse = {
                    "numFound": response.numFound,
                    "start": page * records,
                    "docs": response.docs
                };

                if (page == 2) { // Last one
                    newResponse.docs = response.docs.slice(0, 14); // Return only 14 results
                }

                return Promise.resolve(Page({
                    text: text,
                    options: options
                }, newResponse, query));
            };

            pagedResults = Page(request, response, query);
        });

        it("should return an 'items' property which is an array of objects", function() {
            expect(pagedResults.items).toEqual(jasmine.any(Array));
            expect(pagedResults.items.length).toEqual(20);
        });

        it("should return the original request parameters", function () {
            expect(pagedResults.request.text).toEqual("catalunya");
            expect(pagedResults.request.options.resultsPerPage).toEqual(20);
        });

        it("should return the page number, the total pages, and the first and last record indexes in actual page", function () {
            expect(pagedResults.page.number).toEqual(1);
            expect(pagedResults.page.totalPages).toEqual(3);
            expect(pagedResults.page.from).toEqual(1);
            expect(pagedResults.page.to).toEqual(20);
            expect(pagedResults.page.totalRecords).toEqual(54);
        });

        it("should indicate if it's the first page, the last page, and if it has a previous or a next page", function() {
            expect(pagedResults.page.isFirst).toBe(true);
            expect(pagedResults.page.isLast).toBe(false);
            expect(pagedResults.page.hasPrev).toBe(false);
            expect(pagedResults.page.hasNext).toBe(true);
        });

        it("should have methods to go to previous, next, first and last pages", function(done) {
            var promises = [];
            promises.push(
                pagedResults.page.first().then(function(firstPage) {
                    expect(firstPage.request.text).toEqual("catalunya");
                    expect(firstPage.request.options.resultsPerPage).toEqual(20);
                    expect(firstPage.page.isFirst).toBe(true);
                    expect(firstPage.page.hasPrev).toBe(false);
                    expect(firstPage.page.hasNext).toBe(true);
                    expect(firstPage.page.isLast).toBe(false);
                    expect(firstPage.page.number).toEqual(1);
                    expect(firstPage.page.totalPages).toEqual(3);
                    expect(firstPage.page.from).toEqual(1);
                    expect(firstPage.page.to).toEqual(20);
                    expect(firstPage.page.totalRecords).toEqual(54);
                    expect(firstPage.items).toEqual(jasmine.any(Array));
                    expect(firstPage.items.length).toEqual(20);
                })
            );

            promises.push(
                pagedResults.page.prev().then(function(prevPage) {
                    expect(prevPage.request.text).toEqual("catalunya");
                    expect(prevPage.request.options.resultsPerPage).toEqual(20);
                    expect(prevPage.page.isFirst).toBe(true);
                    expect(prevPage.page.hasPrev).toBe(false);
                    expect(prevPage.page.hasNext).toBe(true);
                    expect(prevPage.page.isLast).toBe(false);
                    expect(prevPage.page.number).toEqual(1);
                    expect(prevPage.page.totalPages).toEqual(3);
                    expect(prevPage.page.from).toEqual(1);
                    expect(prevPage.page.to).toEqual(20);
                    expect(prevPage.page.totalRecords).toEqual(54);
                    expect(prevPage.items).toEqual(jasmine.any(Array));
                    expect(prevPage.items.length).toEqual(20);
                })
            );

            promises.push(
                pagedResults.page.next().then(function(nextPage) {
                    expect(nextPage.request.text).toEqual("catalunya");
                    expect(nextPage.request.options.resultsPerPage).toEqual(20);
                    expect(nextPage.page.isFirst).toBe(false);
                    expect(nextPage.page.hasPrev).toBe(true);
                    expect(nextPage.page.hasNext).toBe(true);
                    expect(nextPage.page.isLast).toBe(false);
                    expect(nextPage.page.number).toEqual(2);
                    expect(nextPage.page.totalPages).toEqual(3);
                    expect(nextPage.page.from).toEqual(21);
                    expect(nextPage.page.to).toEqual(40);
                    expect(nextPage.page.totalRecords).toEqual(54);
                    expect(nextPage.items).toEqual(jasmine.any(Array));
                    expect(nextPage.items.length).toEqual(20);
                })
            );

            promises.push(
                pagedResults.page.last().then(function(lastPage){
                    expect(lastPage.request.text).toEqual("catalunya");
                    expect(lastPage.request.options.resultsPerPage).toEqual(20);
                    expect(lastPage.page.isFirst).toBe(false);
                    expect(lastPage.page.hasPrev).toBe(true);
                    expect(lastPage.page.hasNext).toBe(false);
                    expect(lastPage.page.isLast).toBe(true);
                    expect(lastPage.page.number).toEqual(3);
                    expect(lastPage.page.totalPages).toEqual(3);
                    expect(lastPage.page.from).toEqual(41);
                    expect(lastPage.page.to).toEqual(54);
                    expect(lastPage.page.totalRecords).toEqual(54);
                    expect(lastPage.items).toEqual(jasmine.any(Array));
                    expect(lastPage.items.length).toEqual(14);
                })
            );

            // Test finishes when all promises are tested
            Promise.all(promises).then(done, fail);

        });

    });

});
