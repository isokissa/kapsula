/* 
 * (c) pt_jr
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaArcadeGame", function() {

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
    });

    describe("when created", function(){
     
        it("is in START state", function() {
            expect( arcadeGame.state ).toEqual( arcadeGame.STATE.START );
        }); 
        
        it("has score equal to zero", function() {
            expect( arcadeGame.score ).toEqual( 0 );
        }); 
        
        it("has level equal to 1", function() {
            expect( arcadeGame.level ).toEqual( 1 );
        })
        
    });
    
    describe("when executing step()", function() {
        
        describe("in START state", function() {

            beforeEach( function() {
                arcadeGame.state = arcadeGame.STATE.START; 
            });

            it("will return 1 millisecond", function() {
                expect( arcadeGame.step() ).toEqual( 1 );
            });
            
            it("will go into START_LEVEL state", function() {
                arcadeGame.step();
                expect( arcadeGame.state ).toEqual( arcadeGame.STATE.START_LEVEL );
            });
            
        });
        
        describe("in START_LEVEL state", function() {
            
            beforeEach( function() {
                arcadeGame.state = arcadeGame.STATE.START_LEVEL; 
            });
            
            it("will execute start() method of turnBasedGame", function(){
                spyOn( turnBasedGame, "start" );
                arcadeGame.step();
                expect( turnBasedGame.start ).toHaveBeenCalled(); 
            });
            
            it("will go into FLYING state", function() {
                arcadeGame.step();
                expect( arcadeGame.state ).toEqual( arcadeGame.STATE.FLYING ); 
            }); 
            
            it("will return 1 millisecond as the time till next step", function(){
                expect( arcadeGame.step() ).toEqual( 1 );
            });
            
        });
        
        describe("in FLYING state", function() {
            
            beforeEach( function() {
                arcadeGame.state = arcadeGame.STATE.FLYING; 
            });
            
            var direction; 

            function flyingTests(){

                function dir(){
                    return direction?turnBasedGame.STATE.FLYING_FROM_LEFT:turnBasedGame.STATE.FLYING_FROM_RIGHT;
                }
                
                it("will invoke turnBasedGame takeTurn()", function() {
                    spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                        s( dir(), 14, 0 )
                    );
                    arcadeGame.step();
                    expect( turnBasedGame.takeTurn ).toHaveBeenCalledTimes( 1 ); 
                }); 

                it("will return initial delay", function(){
                    spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                        s( dir(), 14, 0 )
                    );
                    expect( arcadeGame.INITIAL_FLYING_DELAY > 0 ).toEqual( true );
                    expect( arcadeGame.step() ).toEqual( arcadeGame.INITIAL_FLYING_DELAY );
                });

                it("will stay in FLYING state if no input is given", function(){
                    spyOn( turnBasedGame, "takeTurn" ).and.returnValues(
                        s( dir(), 14, 5 )
                    );
                    arcadeGame.step();
                    expect( arcadeGame.state ).toEqual( arcadeGame.STATE.FLYING );                
                });

                it("will invoke renderer showKapsula()", function() {
                    spyOn( turnBasedGame, "takeTurn" ).and.returnValues( 
                        s( dir(), 15, 0 ) 
                    );
                    spyOn( renderer, "showKapsula" );
                    arcadeGame.step();
                    expect( turnBasedGame.takeTurn ).toHaveBeenCalled();
                    expect( renderer.showKapsula ).toHaveBeenCalledWith( 15, 0 );
                });

                it("will invoke renderer showKapsula() twice if turnBasedGame returns FLYING_* twice", function() {
                    spyOn( turnBasedGame, "takeTurn" ).and.returnValues( 
                        s( dir, 15, 31), 
                        s( dir, 15, 30) 
                    );
                    spyOn( renderer, "showKapsula" );
                    arcadeGame.step();
                    expect( turnBasedGame.takeTurn ).toHaveBeenCalled();
                    expect( renderer.showKapsula ).toHaveBeenCalledWith( 15, 31 );
                    arcadeGame.step();
                    expect( renderer.showKapsula ).toHaveBeenCalledWith( 15, 30 );
                });
                                
            };
                        
            direction = true; 
            
            describe("from left", flyingTests);
            
            direction = false; 
            
            describe("from right", flyingTests);

            describe("when turnBasedGame returns the LANDED state", function() {

                beforeEach( function() {
                    spyOn( turnBasedGame, "takeTurn" ).and.returnValues( 
                        s( turnBasedGame.STATE.LANDED, 15, 5) 
                    );                    
                });

                it("will enter the LANDING state", function(){
                    arcadeGame.step();
                    expect( arcadeGame.state ).toEqual( arcadeGame.STATE.LANDING );
                })

                it("will increase and render the score", function() {
                    spyOn( renderer, "showScore" );
                    var oldScore = arcadeGame.score; 
                    arcadeGame.step();
                    expect( arcadeGame.score ).toEqual( oldScore + 1 ); 
                    expect( renderer.showScore ).toHaveBeenCalledWith( oldScore + 1 );
                });                
                
                it("will set the current position as starting position for landing", function(){
                    arcadeGame.step();
                    expect( arcadeGame.current.row ).toEqual( 15 );
                    expect( arcadeGame.current.column ).toEqual( 5 );
                });

            });            
            
        });
        
        describe("in LANDING state", function() {
            
            beforeEach( function() {
                arcadeGame.state = arcadeGame.STATE.LANDING;
                arcadeGame.current.row = 15; 
                arcadeGame.current.column = 5;
            });
            
            it("reduces the height of a kapsula", function(){
                arcadeGame.step();
                expect( arcadeGame.current.row ).toEqual( 16 );
            }); 
            
            it("returns half of FLYING milliseconds", function() {
                expect( arcadeGame.step() - arcadeGame.INITIAL_FLYING_DELAY/2 < 0.001 ).toEqual( true );
            }); 
            
            it("goes into FLYING state after platform is reached", function(){
                arcadeGame.current.row = 23; 
                arcadeGame.step(); 
                expect( arcadeGame.state ).toEqual( arcadeGame.STATE.FLYING );
            });
            
        });

    });
        
});