/* 
 * (c) 2016 pt_jr  
 */


"use strict";

require( "../public_html/js/gengine");


describe("GameRunner", function() {
  
    describe("when invoked startLoop()", function() {
        
        var arcadeGame; 
        var timeouter;
        var gameRunner;

        beforeEach( function() {
           arcadeGame = createTestArcadeGame();
           timeouter = Object.create( TestTimeouter );
           gameRunner = Object.create( GameRunner );
        });

        it("invokes ArcadeGame's step() function", function() {
            spyOn( arcadeGame, "step" );
            gameRunner.startLoop(arcadeGame, timeouter.setTimeout );
            expect( arcadeGame.step ).toHaveBeenCalled();
        });

        it("invokes setTimeout() function", function() {
            spyOn( timeouter, "setTimeout" );
            gameRunner.startLoop(arcadeGame, timeouter.setTimeout );
            expect( timeouter.setTimeout ).toHaveBeenCalledWith(jasmine.anything(), 1111);
        });
        
        it("will set the next timeout to 2222 milliseconds", function() {
            spyOn( arcadeGame, "setNextTimeoutTime" );
            gameRunner.startLoop(arcadeGame, timeouter.setTimeout );
            expect( arcadeGame.setNextTimeoutTime ).toHaveBeenCalledWith( 2222 );
        });
        
        it("invokes timeout with the value given by previous call to ArcadeGame's step() function", function() {
            spyOn( timeouter, "setTimeout" ).and.callThrough();
            gameRunner.startLoop(arcadeGame, timeouter.setTimeout );
            expect( timeouter.setTimeout ).toHaveBeenCalledTimes(5);            
        });
        
    });
    
});
       
////////////////////////////////////
// spies
////////////////////////////////////

var TestTimeouter = {
            
    setTimeout: function( f, t ){
        if( t > 0 ){
            f();
        }
    }
        
};

function createTestArcadeGame() {
    var testArcadeGame = Object.create( ArcadeGame );
    
    testArcadeGame.LAST_TIMEOUT_USED = 55;
    
    testArcadeGame.values = [1111, 2222, 3333, 4444, 5555];
    
    testArcadeGame.step = function() {
        return testArcadeGame.values.shift();
    };
    
    return testArcadeGame; 
};
