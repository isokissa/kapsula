/* 
 * (c) pt_jr
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaArcadeGame", function() {
      
    describe("when invoking step()", function() {

        var turnBasedGame;
        var renderer;
        var arcadeGame; 
        
        function s(aState, aRow, aColumn){
            return {state: aState, row: aRow, column: aColumn};
        };
        
        beforeEach( function() {
            var dummyRandomizer = {
                getRandomNumber: function() {}
            };
            turnBasedGame = createKapsulaTurnBasedGame( dummyRandomizer );
            renderer = {
                showKapsula: function( x, y ) {},
                showScore: function( s ) {}
            };
            arcadeGame = createKapsulaArcadeGame( turnBasedGame, renderer );
            arcadeGame.state = arcadeGame.STATE.ACTIVE;
        });

        describe("in first level (beginning of game)", function(){

            it("will invoke TurnBasedGame.takeTurn()", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                    s(0, 0, 0)
                );
                arcadeGame.step();
                expect( turnBasedGame.takeTurn ).toHaveBeenCalled();
            });
            
            it("will return initial delay when flying", function(){
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                    s( turnBasedGame.STATE.FLYING_FROM_LEFT, 14, 0 )
                );
                expect( arcadeGame.INITIAL_FLYING_DELAY > 0 ).toEqual( true );
                expect( arcadeGame.step() ).toEqual( arcadeGame.INITIAL_FLYING_DELAY );
            });
            
        });
        
        describe( "if the returned state says that kapsula is flying", function() {
            
            beforeEach( function() {
                spyOn( renderer, "showKapsula" );
            });
            
            it("will be in state FLYING if flying from left", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues( 
                    s(turnBasedGame.STATE.FLYING_FROM_LEFT, 15, 0) 
                );
                arcadeGame.step();
                expect( arcadeGame.state ).toEqual( arcadeGame.STATE.ACTIVE );                
            });

            it("will be in state FLYING if flying from right", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues( 
                    s(turnBasedGame.STATE.FLYING_FROM_RIGHT, 15, 0) 
                );
                arcadeGame.step();
                expect( arcadeGame.state ).toEqual( arcadeGame.STATE.ACTIVE );                
            });

            it("will invoke renderer if turnBasedGame returns FLYING_FROM_LEFT state", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues( 
                    s(turnBasedGame.STATE.FLYING_FROM_LEFT, 15, 0) 
                );
                arcadeGame.step();
                expect( turnBasedGame.takeTurn ).toHaveBeenCalled();
                expect( renderer.showKapsula ).toHaveBeenCalledWith( 15, 0 );
            });

            it("will invoke renderer twice if turnBasedGame returns FLYING_FROM_RIGHT state twice", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues( 
                    s(turnBasedGame.STATE.FLYING_FROM_RIGHT, 15, 31), 
                    s(turnBasedGame.STATE.FLYING_FROM_RIGHT, 15, 30) 
                );
                arcadeGame.step();
                expect( turnBasedGame.takeTurn ).toHaveBeenCalled();
                expect( renderer.showKapsula ).toHaveBeenCalledWith( 15, 31 );
                arcadeGame.step();
                expect( renderer.showKapsula ).toHaveBeenCalledWith( 15, 30 );
            });

        });

        describe("if the returned state says that kapsula is going down", function() {

            beforeEach( function() {
                spyOn( renderer, "showKapsula" );
            });

            it("will be in state LANDING if LANDED", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues( 
                    s(turnBasedGame.STATE.LANDED, 15, 0) 
                );
                arcadeGame.step();
                expect( arcadeGame.state ).toEqual( arcadeGame.STATE.LANDING );                
            });

            it("will invoke renderer in LANDED state", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                    s(turnBasedGame.STATE.LANDED, 15, 5 )
                );
                arcadeGame.step();
                expect( renderer.showKapsula ).toHaveBeenCalledWith( 15, 5 );
            });
            
            it("will return half of flying delay when in LANDING state", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                    s(turnBasedGame.STATE.LANDED, 15, 5 )
                );
                expect( arcadeGame.step() - arcadeGame.INITIAL_FLYING_DELAY / 2 < 1 ).toEqual( true );
            });
            
            it("will perform the LANDING animation once TurnBasedGame return LANDED state", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues( 
                    s(turnBasedGame.STATE.LANDED, 15, 5)
                );
                arcadeGame.step();
                expect( arcadeGame.state ).toEqual( arcadeGame.STATE.LANDING );
                expect( renderer.showKapsula ).toHaveBeenCalledWith( 15, 5 );
                for( var i = 15; i < 23; i++ ){
                    arcadeGame.step();
                    expect( renderer.showKapsula ).toHaveBeenCalledWith( i, 5 );
                }
            });

            it("will invoke renderer in CRASHED state", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                    s(turnBasedGame.STATE.CRASHED, 15, 5 )
                );
                arcadeGame.step();
                expect( renderer.showKapsula ).toHaveBeenCalledWith( 15, 5 );
            });

        });
        
        describe("if returned state requires that the score has to change", function() {

            beforeEach( function() {
                spyOn( renderer, "showScore" );
            });

            it("will increase the score when TurnBasedGame is LANDED", function() {
                spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                    s(turnBasedGame.STATE.LANDED, 15, 5) 
                );
                arcadeGame.step();
                expect( renderer.showScore ).toHaveBeenCalledWith( 1 );
            });
            
        });
        
        

        
    });
    
    
});