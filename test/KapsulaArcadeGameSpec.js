/* 
 * (c) pt_jr
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaArcadeGame", function() {
  
    describe("when constructed", function() {
                
        it("accepts step game, timer function and renderer function", function() {
            var kapsulaStepGame = new KapsulaStepGame( new Randomizer() );
            var timeoutFunction = function() {};
            var renderer = function() {};
            var dummy = new KapsulaArcadeGame( kapsulaStepGame, timeoutFunction, renderer );
        });
        
        it("throws exception if step game is not given or is of wrong type", function() {
            var testBlock = function() {
                var dummy = new KapsulaArcadeGame( 2 );
            }
            expect( testBlock ).toThrowError( InvalidParameterError, "StepGame is not given" );
        });

        it("throws exception if timeout function is not given or is of wrong type", function() {
            var testBlock = function() {
                var kapsulaStepGame = new TestKapsulaStepGame();
                var dummy = new KapsulaArcadeGame( kapsulaStepGame, 3 );
            }
            expect( testBlock ).toThrowError( InvalidParameterError, "Timeout function is not given" );
        });

        it("throws exception if renderer function is not given or is of wrong type", function() {
            var testBlock = function() {
                var kapsulaStepGame = new TestKapsulaStepGame();
                var timeoutFunction = function() {};
                var dummy = new KapsulaArcadeGame( kapsulaStepGame, timeoutFunction, 3 );
            }
            expect( testBlock ).toThrowError( InvalidParameterError, "Renderer function is not given" );
        });
        
        
    });
    
    describe("when invoking loop", function() {
        var stepGame;
        var testTimeout; 
        var testRenderer; 
        var arcadeGame;
        
        beforeEach(function() {
            stepGame = new TestKapsulaStepGame();
            testTimeout = new TestTimeout();
            testRenderer = function() {};
            arcadeGame = new KapsulaArcadeGame( stepGame, testTimeout.setTimeout, testRenderer );
        });        
        
        it("invokes timeout with step method", function() {
            spyOn( arcadeGame, "timeoutFunction" );
            arcadeGame.startLoop();
            expect( arcadeGame.timeoutFunction ).toHaveBeenCalledWith( arcadeGame.step, 100 );
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



var TestKapsulaStepGame = function(){
};

TestKapsulaStepGame.prototype = Object.create( KapsulaStepGame.prototype );
TestKapsulaStepGame.prototype.constructor = TestKapsulaStepGame;

TestKapsulaStepGame.prototype.getRandomNumber = function(aLimit) {
    return 0;
};

