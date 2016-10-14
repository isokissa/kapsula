/* 
 * (c) pt_jr
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaArcadeGame", function() {
  
    describe("when constructed", function() {
                
        it("accepts step game", function() {
            var kapsulaStepGame = new KapsulaStepGame( new Randomizer() );
            var dummy = new KapsulaArcadeGame( kapsulaStepGame );
        });
        
        it("throws exception if step game is not given or is of wrong type", function() {
            var testBlock = function() {
                var dummy = new KapsulaArcadeGame( 2 );
            }
            expect( testBlock ).toThrowError( InvalidParameterError, "StepGame is not given" );
        });
                
    });
    
    describe("when invoking step()", function() {

    
    });
    
    
});
    
////////////////////////////////////
// spies
////////////////////////////////////

var TestKapsulaStepGame = function(){
};

TestKapsulaStepGame.prototype = Object.create( KapsulaStepGame.prototype );
TestKapsulaStepGame.prototype.constructor = TestKapsulaStepGame;

TestKapsulaStepGame.prototype.getRandomNumber = function(aLimit) {
    return 0;
};

