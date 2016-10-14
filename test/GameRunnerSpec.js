/* 
 * (c) 2016 pt_jr  
 */


"use strict";

require( "../public_html/js/gengine");


describe("GameRunner", function() {
  
    describe("when constructed", function() {
                
        it("accepts arcade game object, timer function, renderer function and current time function", function() {
            var arcadeGame = new ArcadeGame();
            var timeoutFunction = function() {};
            var rendererFunction = function() {};
            var dummy = new GameRunner( arcadeGame, timeoutFunction, rendererFunction );
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
    
    describe("when invoking startLoop", function() {
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
            expect( gameRunner.timeoutFunction ).toHaveBeenCalled();
        });
        
        it("invokes timeout second time with 150ms", function() {
            gameRunner.startLoop();
            expect( ArcadeGame.howManyMillisecondsToWait ).toEqual( 150 );
        });
        
        it("invokes GameRuner step() method", function() {
            spyOn( gameRunner, "step" );
            gameRunner.startLoop();
            expect( gameRunner.step ).toHaveBeenCalled();
        })
        
        it("invokes arcadeGame advance() method", function() {
            spyOn( gameRunner.arcadeGame, "advance" );
            gameRunner.startLoop();
            expect( gameRunner.arcadeGame.advance ).toHaveBeenCalled();
        });
        
    });
    
});
       
////////////////////////////////////
// spies
////////////////////////////////////

var TestTimeout = function(){
    this.howManyTimesBeforeEnd = 10;
};

TestTimeout.prototype.setTimeout = function( f, t ) {
    if( this.howManyTimesBeforeEnd > 0 ){
        f();
        this.howManyTimesBeforeEnd--;
    }
};

var TestArcadeGame = function(){
    ArcadeGame.call(this);
};

TestArcadeGame.prototype = Object.create( ArcadeGame.prototype );
TestArcadeGame.prototype.constructor = TestArcadeGame;

TestArcadeGame.prototype.advance = function() {
    ArcadeGame.howManyMillisecondsToWait = 150;
};