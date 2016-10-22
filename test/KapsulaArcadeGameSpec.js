/* 
 * (c) pt_jr
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaArcadeGame", function() {
      
    xdescribe("when invoking step()", function() {

        var INITIAL_MILLISECONDS_TO_WAIT = 150;
        var stepGame; 
        var arcadeGame; 
        
        beforeEach( function() {
            stepGame = new TestKapsulaStepGame();
            arcadeGame = new KapsulaArcadeGame( stepGame );
        });
        
        it("will invoke StepGame.advance()", function() {
            spyOn( stepGame, "advance" );
            arcadeGame.step();
            expect( stepGame.advance ).toHaveBeenCalled();
        });
        
        it("will set howManyMillisecondsToWait to 150", function() {
            arcadeGame.step();
            expect( arcadeGame.howManyMillisecondsToWait() ).toEqual( INITIAL_MILLISECONDS_TO_WAIT );
        })
    
    });
    
    
});