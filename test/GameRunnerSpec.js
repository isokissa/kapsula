/* 
 * (c) 2016 pt_jr  
 */


"use strict";

require( "../public_html/js/gengine");


describe("GameRunner", function() {
  
    describe("when constructed", function() {
                
        it("accepts arcade game object, timer function and renderer function", function() {
            var arcadeGame = new ArcadeGame();
            var timeoutFunction = function() {};
            var renderer = function() {};
            var dummy = new GameRunner( arcadeGame, timeoutFunction, renderer );
        });
        
        it("throws exception if arcade game is not given or is of wrong type", function() {
            var testBlock = function() {
                var dummy = new GameRunner( 2 );
            }
            expect( testBlock ).toThrowError( InvalidParameterError, "ArcadeGame is not given" );
        });

        it("throws exception if timeout function is not given or is of wrong type", function() {
            var testBlock = function() {
                var arcadeGame = new ArcadeGame();
                var dummy = new GameRunner( arcadeGame, 3 );
            }
            expect( testBlock ).toThrowError( InvalidParameterError, "Timeout function is not given" );
        });

        it("throws exception if renderer function is not given or is of wrong type", function() {
            var testBlock = function() {
                var arcadeGame = new ArcadeGame();
                var timeoutFunction = function() {};
                var dummy = new GameRunner( arcadeGame, timeoutFunction, 3 );
            }
            expect( testBlock ).toThrowError( InvalidParameterError, "Renderer function is not given" );
        });
        
        
    });
    
    describe("when invoking loop", function() {
        var arcadeGame;
        var testTimeout; 
        var testRenderer; 
        var gameRunner;
        
        beforeEach(function() {
            arcadeGame = new TestArcadeGame();
            testTimeout = new TestTimeout();
            testRenderer = function() {};
            gameRunner = new GameRunner( arcadeGame, testTimeout.setTimeout, testRenderer );
        });        
        
        it("invokes timeout with step method", function() {
            spyOn( gameRunner, "timeoutFunction" );
            gameRunner.startLoop();
            expect( gameRunner.timeoutFunction ).toHaveBeenCalledWith( gameRunner.step, 100 );
        });
    });
    
    
});
    
////////////////////////////////////
// spies
////////////////////////////////////

var TestTimeout = function(){
};

TestTimeout.prototype.setTimeout = function( f, t ) {
    console.log("pozvao ga je");
};



var TestArcadeGame = function(){
};

TestArcadeGame.prototype = Object.create( ArcadeGame.prototype );
TestArcadeGame.prototype.constructor = TestArcadeGame;

TestArcadeGame.prototype.getRandomNumber = function(aLimit) {
    return 0;
};


