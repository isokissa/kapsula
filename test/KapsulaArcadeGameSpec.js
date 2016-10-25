/* 
 * (c) pt_jr
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaArcadeGame", function() {
      
    describe("when invoking step()", function() {

        var INITIAL_MILLISECONDS_TO_WAIT = 150;
        var turnBasedGame; 
        var arcadeGame; 
        
        function s(state, row, column){
            return {state: state, row: row, column: column};
        };
        
        beforeEach( function() {
            var dummyRandomizer = {
                getRandomNumber: function() {}
            };
            turnBasedGame = createKapsulaTurnBasedGame( dummyRandomizer );
            //renderer = createKapsulaRenderer();
            //spyOn( renderer, "showKapsula" );
            arcadeGame = createKapsulaArcadeGame( turnBasedGame );
        });
        
        it("will invoke TurnBasedGame.takeTurn()", function() {
            spyOn( turnBasedGame, "takeTurn" );
            arcadeGame.step();
            expect( turnBasedGame.takeTurn ).toHaveBeenCalled();
        });
        
        it("will invoke renderer if turnBasedGame retunrs FLYING state", function() {
            spyOn( turnBasedGame, "takeTurn" )
        });
        
        it("will invoke renderer for each step if flying horisontally", function() {
            spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                    s(turnBasedGame.STATE.FLYING_FROM_LEFT, 15, 0 ),
                    s(turnBasedGame.STATE.FLYING_FROM_LEFT, 15, 1 )
            );
            
        })
            
    });
    
    
});