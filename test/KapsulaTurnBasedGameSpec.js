/* 
 * (c) 2016 isokissa
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaTurnBasedGame", function() {

    var game; 
    var randomizer; 
    var ROW = 14;
    var NO_INPUT = false;
    var YES_INPUT = true;

    beforeEach(function() {
        randomizer = createTestRandomizer();
        game = createKapsulaTurnBasedGame(randomizer);
    });
    
    describe("when constructed", function() {

        it("trows an exception if the randomizer is not given", function() {
            var testBlock = function(){
                var dummy = createKapsulaTurnBasedGame();
            };
            expect( testBlock ).toThrowError( InvalidParameterError, "missing randomizer" );
        });
        
        describe("successfully", function() {
             
            it("is in undefined state", function() {
                expect( game.state ).toEqual( undefined );
            });

            it("has undefined score", function() {
                expect( game.score ).toEqual( undefined );
            }); 
            
            it("has undefined number of remaining kapsulas", function() {
                expect( game.getNumberOfRemainingKapsulas() ).toEqual( undefined );
            });
           
        }); 
 
    });
    
    describe("when start() is invoked", function(){
            
        beforeEach( function() {
            game.start();
        });
        
        it("sets the score to zero", function(){
            expect( game.getScore() ).toEqual( 0 );
        });
        
        it("sets the number of remaining kapsulas to 40", function() {
            expect( game.getNumberOfRemainingKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS ); 
        });
        
        it("gets into NEW_KAPSULA state", function() {
            expect( game.state ).toEqual( game.STATE.NEW_KAPSULA );
        });
        
    });
    
    describe("invoke takeTurn()", function(){
        
        beforeEach( function() {
            game.start();
        });

        var takeTurnManyTimesWithNoInput = function( howManyTimes, fromLeft ) {
            randomizer.setNextNumberSequence( [ROW, (fromLeft? 0: 1)] );
            var lastResult; 
            for( var i = 0; i < howManyTimes; i++ ){
                lastResult = game.takeTurn(NO_INPUT);
            }
            return lastResult;
        };

        it("throws exception if no user input is given", function() {
            var testBlock = function(){
                game.takeTurn();
            };
            expect( testBlock ).toThrowError( InvalidParameterError, "missing user input" );            
        });

        describe("while in NEW_KAPSULA state", function() {

            it("is in NEW_KAPSULA state before takeTurn() is invoked", function() {
                expect( game.state ).toEqual( game.STATE.NEW_KAPSULA );
            });
            
            it("invokes the randomizer twice to get the starting position and direction of new kapsula", function() {
                spyOn( randomizer, "getRandomNumber" );
                game.takeTurn(NO_INPUT);
                expect( randomizer.getRandomNumber ).toHaveBeenCalledTimes(2);
                expect( randomizer.getRandomNumber ).toHaveBeenCalledWith(23);
                expect( randomizer.getRandomNumber ).toHaveBeenCalledWith(2);
            });
            
            it("decreases the number of remaining kapsulas", function() {
                game.takeTurn(NO_INPUT);
                expect( game.getNumberOfRemainingKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS - 1 );
            })
            
            it("returns FLYING_FROM_LEFT object at position (0,ROW) if generated numbers are ROW and 0", function() {
                expect( takeTurnManyTimesWithNoInput(1, true) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:0} );
                expect( game.state ).toEqual( game.STATE.FLYING_FROM_LEFT );
            });

            it("returns the FLYING_FROM_RIGHT object coming from the right side (column 31), if generated numbers are ROW and 1", function() {
                expect( takeTurnManyTimesWithNoInput(1, false) ).toEqual( {state:game.STATE.FLYING_FROM_RIGHT, row:ROW, column:31} );
                expect( game.state ).toEqual( game.STATE.FLYING_FROM_RIGHT );
            });
                                    
        });
        
        describe("while in FLYING_FROM_* state, with no user input", function() {

            describe("when flying from left", function() {
                
                it("is still FLYING also in second turn, but at next position (1,14)", function() {
                    expect( takeTurnManyTimesWithNoInput(2, true) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:1} );
                })

                it("moves the object 15 steps when takeTurn() invoked 15 times", function() {
                    expect( takeTurnManyTimesWithNoInput( 15, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:14 } );
                });

                it("moves the object 32 steps when takeTurnd 32 times and it still flies", function() {
                    expect( takeTurnManyTimesWithNoInput( game.MAX_COLUMNS, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:game.MAX_COLUMNS-1} );
                })
                
                it("gets into LOST state after 32 steps with no user input", function (){
                    expect( takeTurnManyTimesWithNoInput( game.MAX_COLUMNS + 1, true ) ).toEqual( {state: game.STATE.LOST, row: undefined, column: undefined } );
                    expect( game.state ).toEqual( game.STATE.LOST );
                });
                
            });
            
            describe("when flying from right", function() {

                it("is still FLYING also in second turn, at next position (30,14)", function() {
                    expect( takeTurnManyTimesWithNoInput(2, false) ).toEqual( {state:game.STATE.FLYING_FROM_RIGHT, row:ROW, column:30} );
                });

                it("moves the object 32 steps when takeTurnd 32 times and it still flies", function() {
                    expect( takeTurnManyTimesWithNoInput( game.MAX_COLUMNS, false ) ).toEqual( {state:game.STATE.FLYING_FROM_RIGHT, row:ROW, column:0} );
                });
                
                it("returns status LOST if takeTurn is done 33 times from right, without user input", function(){
                    expect( takeTurnManyTimesWithNoInput( game.MAX_COLUMNS + 1, false ) ).toEqual( {state: game.STATE.LOST, row: undefined, column: undefined } );
                    expect( game.state ).toEqual( game.STATE.LOST );
                });        
                
            });
            
        });
        
        describe("while in LOST state", function(){
            
            beforeEach( function() {
                game.state = game.STATE.LOST; 
            });
            
            it("will go to NEW_KAPSULA state", function() {
                game.takeTurn(NO_INPUT);
                expect( game.state ).toEqual( game.STATE.NEW_KAPSULA );
            });
            
            it("will go to END_FAIL if this was the last kapsula", function() {
                game.remainingKapsulas = 0; 
                game.takeTurn(NO_INPUT);
                expect( game.state ).toEqual( game.STATE.END_FAIL ); 
            });
            
            it("will keep the same score", function() {
                var oldScore = game.getScore(); 
                game.takeTurn(NO_INPUT);
                expect( game.getScore() ).toEqual( oldScore );
            });
            
        });

        describe("while in FLYING_FROM_* state with user input", function() {
            
            describe("if user tries landing over the edge", function() {
                
                it("returns CRASHED state when coming from left", function() {
                    takeTurnManyTimesWithNoInput( 1, true );
                    var result = game.takeTurn( YES_INPUT );
                    expect( result ).toEqual( {state:game.STATE.CRASHED, row:ROW, column:0 } );
                });

                it("returns CRASHED state when coming from right", function() {
                    takeTurnManyTimesWithNoInput( 1, false );
                    var result = game.takeTurn( YES_INPUT );
                    expect( result ).toEqual( {state:game.STATE.CRASHED, row:ROW, column:31 } );
                });
                
            }); 
            
            describe("if user tries landing on free spot", function() {
                
                it("returns status LANDED when coming from the left", function() {
                    takeTurnManyTimesWithNoInput( 2, true );
                    var result = game.takeTurn( YES_INPUT );
                    expect( result ).toEqual( {state:game.STATE.LANDED, row:ROW, column: 1 } );
                });

                it("returns status LANDED when coming from the right", function() {
                    takeTurnManyTimesWithNoInput( 2, false );
                    var result = game.takeTurn( YES_INPUT );
                    expect( result ).toEqual( {state:game.STATE.LANDED, row:ROW, column: 30 } );
                });                

                it("returns status LANDED when coming from the left and flying for some time", function() {
                    takeTurnManyTimesWithNoInput( 3, true );
                    var result = game.takeTurn( YES_INPUT );
                    expect( result ).toEqual( {state:game.STATE.LANDED, row:ROW, column: 2 } );
                });

                it("returns status LANDED when coming from the right and flying for some time", function() {
                    takeTurnManyTimesWithNoInput( 3, false );
                    var result = game.takeTurn( YES_INPUT );
                    expect( result ).toEqual( {state:game.STATE.LANDED, row:ROW, column: 29 } );
                });
                
            });
            
            describe("if tries landing on occupied spot", function() {
               
                it("goes into CRASHED state if you try to land twice to the same position", function() {
                    takeTurnManyTimesWithNoInput( 3, true );
                    var shouldBeLanded = game.takeTurn( YES_INPUT );
                    game.state = game.STATE.NEW_KAPSULA; 
                    takeTurnManyTimesWithNoInput( 3, true );
                    var shouldBeCrashed = game.takeTurn( YES_INPUT );
                    expect( shouldBeCrashed ).toEqual( {state:game.STATE.CRASHED, row:ROW, column:2} );
                });

            });
                       
        });
        
        describe("when in LANDED state", function() {
            
            it("increases the score", function(){
                game.state = game.STATE.LANDED;
                var oldScore = game.getScore();
                takeTurnManyTimesWithNoInput(2, true);
                expect( game.getScore() ).toEqual( oldScore + 1 ); 
            }); 
            
            it("gets into NEW_KAPSULA state if there is still space in landing platform", function() {
                game.state = game.STATE.LANDED; 
                takeTurnManyTimesWithNoInput( 1, true );
                expect( game.state ).toEqual( game.STATE.NEW_KAPSULA );
            });
            
            xit("gets into END_WIN state if there is no more space in landing platform, the level is completed", function() {
                
            });
            
        }); 
        
        describe("when in CHRASHED state", function(){

            beforeEach( function() {
                game.state = game.STATE.CRASHED;                     
            });

            it("decreases the number of lives", function(){
                var oldLives = game.getRemainingLives();
                game.takeTurn( NO_INPUT );
                expect( game.getRemainingLives() ).toEqual( oldLives - 1 );
            });

            it("moves into NEW_KAPSULA state if lives > 0", function() {
                game.remainingLives = 3; 
                game.takeTurn( NO_INPUT );
                expect( game.state ).toEqual( game.STATE.NEW_KAPSULA );
            });

            it("moves into END_FAIL state if lives == 0", function() {
                game.remainingLives = 1; 
                game.takeTurn( NO_INPUT );
                expect( game.state ).toEqual( game.STATE.END_FAIL );
            });

        });
        
        describe("when in END_FAIL state", function() {
            
            it("stays in END_FAIL state", function() {
                game.state = game.STATE.END_FAIL; 
                game.takeTurn( NO_INPUT );
                expect( game.state ).toEqual( game.STATE.END_FAIL );
            });
            
        });
        
        describe("when in END_WIN state", function() {
            
            it("stays in END_WIN state", function() {
                game.state = game.STATE.END_WIN; 
                game.takeTurn( NO_INPUT );
                expect( game.state ).toEqual( game.STATE.END_WIN );
            });
            
        });

        describe("when successfully landed 30 kapsulas", function(){

            it("enters the END_WIN state and 10 are remaining", function(){
                for( var i = 0; i < 30; i++ ){
                    game.state = game.STATE.NEW_KAPSULA; 
                    takeTurnManyTimesWithNoInput( i+2, true );
                    expect( game.takeTurn( YES_INPUT) ).toEqual( {state:game.STATE.LANDED, row:ROW, column:i+1 } );
                }
                game.takeTurn( NO_INPUT );
                expect( game.state ).toEqual( game.STATE.END_WIN );
                expect( game.getNumberOfRemainingKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS - 30 );
            });
            
        });

    });

});

describe("Randomizer", function() {
    
    it("throws exception if no upper limit is given in getRandomNumber", function() {
        var randomizer = createRandomizer();
        var testBlock = function(){
            var a = randomizer.getRandomNumber();
        };
        expect( testBlock ).toThrowError( InvalidParameterError, "no upper limit given to Randomizer" );
    })
    
    it("throws exception if upper limit is less than 2", function() {
        var randomizer = Object.create( Randomizer );
        var testBlock = function(){
            var a = randomizer.getRandomNumber( 1 );
        };
        expect( testBlock ).toThrowError( InvalidParameterError, "upper limit must be bigger than 1" );
    })
})

///////////////////////

function createTestRandomizer(){
    var testRandomizer = Object.create( Randomizer );

    testRandomizer.nextNumberSequence = [1,1,1,1]; 

    testRandomizer.getRandomNumber = function( aLimit ) {
        var nextNumber = this.nextNumberSequence.shift();
        if( nextNumber === undefined ){
            throw new Error( "ran out of predefined random numbers" );
        }
        return nextNumber % aLimit;
    };
    
    testRandomizer.setNextNumberSequence = function(aNextNumberSequence) {
        this.nextNumberSequence = aNextNumberSequence; 
    };

    return testRandomizer; 
};
