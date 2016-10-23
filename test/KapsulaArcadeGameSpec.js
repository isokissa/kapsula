/* 
 * (c) pt_jr
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaArcadeGame", function() {
      
    describe("when invoking step()", function() {

        var INITIAL_MILLISECONDS_TO_WAIT = 150;
        var stepGame; 
        var arcadeGame; 
        
        beforeEach( function() {
            var dummyRandomizer = {
                getRandomNumber: function() {}
            };
            stepGame = createKapsulaStepGame( dummyRandomizer );
            arcadeGame = createKapsulaArcadeGame( stepGame );
        });
        
        it("will invoke StepGame.advance()", function() {
            spyOn( stepGame, "advance" );
            arcadeGame.step();
            expect( stepGame.advance ).toHaveBeenCalled();
        });
            
    });
    
    
});