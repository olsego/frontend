define(['common', 'qwery', 'modules/footballfixtures'], function(common, qwery, FootballFixtures) {

    describe("Football fixtures component", function() {
       
        var callback;

        beforeEach(function() {
            mockReqwest = jasmine.createSpy('reqwest');
            prependTo = qwery('ul > li', '#football-fixtures')[0];
            competitions = [500, 510, 100];
            
            renderCall = sinon.spy(function(){});
            expandCall = sinon.spy(function(){});

            common.mediator.on('modules:footballfixtures:render', renderCall);
            common.mediator.on('modules:footballfixtures:expand', expandCall);
            
            runs(function() {
                var table = new FootballFixtures({
                    prependTo: prependTo,
                    expandable: true,
                    competitions: competitions
                }).init({reqwest: mockReqwest});
            });
        });

        // json test needs to be run asynchronously 
        it("should request the given competitions from the fixtures api", function(){
            waits(500);

            runs(function(){
                expect(mockReqwest.wasCalled).toBeTruthy();
                expect(mockReqwest.mostRecentCall.args[0].url.indexOf('/football/api/frontscores?&competitionId=500&competitionId=510&competitionId=100')).toEqual(0);
            });
        });

        it("should prepend fixtues to the DOM", function() {

            waits(500);

            runs(function(){
                mockReqwest.mostRecentCall.args[0].success.call(this, {html: '<p>foo</p>'});
                expect(document.getElementById('football-fixtures').innerHTML).toContain('<p>foo</p>');
                expect(renderCall).toHaveBeenCalled();
            });
        });

        it("should trigger expandable module", function() {
            waits(1000);

            runs(function(){
                mockReqwest.mostRecentCall.args[0].success.call(this, {html: '<p>foo</p>'});
                expect(expandCall).toHaveBeenCalledWith('front-competition-table');
            });
        });
    
    });
});