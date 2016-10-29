/* 
 * (c) 2016 isokissa
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaTurnBasedGame", function() {
    
    describe("when construct", function() {
        it("trows an exception if the randomizer is not given", function() {
            var testBlock = function(){
                var dummy = createKapsulaTurnBasedGame();
            };
            expect( testBlock ).toThrowError( InvalidParameterError, "missing randomizer" );
        });
                
        it("sets the score to zero", function() {
            var kapsulaTurnBasedGame = createKapsulaTurnBasedGame( createTestRandomizer() ); 
            expect( kapsulaTurnBasedGame.getScore() ).toEqual( 0 );
        })
    });
    
    describe("invoking takeTurn", function() {
        var game; 
        var randomizer; 
        var ROW = 14;
        var NO_INPUT = false;
        var YES_INPUT = true;
        
        beforeEach(function() {
            randomizer = createTestRandomizer();
            game = createKapsulaTurnBasedGame(randomizer);
        });

        it("throws exception if no user input is given", function() {
            var testBlock = function(){
                game.takeTurn();
            };
            expect( testBlock ).toThrowError( InvalidParameterError, "missing user input" );            
        });
        
        var takeTurnManyTimesWithNoInput = function( howManyTimes, fromLeft ) {
            randomizer.setNextNumberSequence( [ROW, (fromLeft? 0: 1)] );
            var lastResult; 
            for( var i = 0; i < howManyTimes; i++ ){
                lastResult = game.takeTurn(NO_INPUT);
            }
            return lastResult;
        };

        it("first time also invokes the randomizer twice to get the starting position and direction of first kapsula", function() {
            spyOn( randomizer, "getRandomNumber" );
            game.takeTurn(NO_INPUT);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledTimes(2);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledWith(23);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledWith(2);
        });
      
        it("first time returns the FLYING_FROM_LEFT object at position (0,14) if generated numbers are 14 and 0", function() {
            expect( takeTurnManyTimesWithNoInput(1, true) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:0} );
        })

        it("first time returns the FLYING_FROM_RIGHT object coming from the right side (column 31)", function() {
            expect( takeTurnManyTimesWithNoInput(1, false) ).toEqual( {state:game.STATE.FLYING_FROM_RIGHT, row:ROW, column:31} );
        })

        it("second time returns the FLYING object at position (1,14)", function() {
            expect( takeTurnManyTimesWithNoInput(2, true) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:1} );
        })

        it("second time returns the FLYING object at position (30,14), if started from the right side", function() {
            expect( takeTurnManyTimesWithNoInput(2, false) ).toEqual( {state:game.STATE.FLYING_FROM_RIGHT, row:ROW, column:30} );
        })
        
        it("moves the object 15 steps when takeTurnd 15 times", function() {
            expect( takeTurnManyTimesWithNoInput( 15, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:14 } );
        });
        
        it("moves the object 32 steps when takeTurnd 32 times and it still flies", function() {
            expect( takeTurnManyTimesWithNoInput( game.MAX_COLUMNS, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:game.MAX_COLUMNS-1} );
        })

        describe("if kapsula leaves the screen", function() {
            
            it("returns status LOST if takeTurn is done 33 times from left, without user input", function(){
                expect( takeTurnManyTimesWithNoInput( game.MAX_COLUMNS + 1, true ) ).toEqual( {state: game.STATE.LOST, row: undefined, column: undefined } );
            });

            it("returns status LOST if takeTurn is done 33 times from right, without user input", function(){
                expect( takeTurnManyTimesWithNoInput( game.MAX_COLUMNS + 1, false ) ).toEqual( {state: game.STATE.LOST, row: undefined, column: undefined } );
            });        

            it("creates new kapsula after the previous one is lost", function() {
                takeTurnManyTimesWithNoInput( game.MAX_COLUMNS + 1, true );
                expect( takeTurnManyTimesWithNoInput( 1, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:0} );
            });

            it("may create new kapsula on the other side after the previous one is lost", function() {
                takeTurnManyTimesWithNoInput( game.MAX_COLUMNS + 1, true );
                expect( takeTurnManyTimesWithNoInput( 1, false ) ).toEqual( {state:game.STATE.FLYING_FROM_RIGHT, row:ROW, column:31} );
            });
            
            it("keeps the score at zero", function() {
                takeTurnManyTimesWithNoInput( game.MAX_COLUMNS + 1, true );
                expect( takeTurnManyTimesWithNoInput( 1, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:0} );
                expect( game.getScore() ).toEqual( 0 );
            })
            
        });
        
        describe("if kapsula just entered the screen and the input is given", function() {

            it("returns status CRASHED when coming from left", function() {
                takeTurnManyTimesWithNoInput( 1, true );
                var result = game.takeTurn( YES_INPUT );
                expect( result ).toEqual( {state:game.STATE.CRASHED, row:ROW, column:0 } );
            });
            
            it("returns status CRASHED when coming from right", function() {
                takeTurnManyTimesWithNoInput( 1, false );
                var result = game.takeTurn( YES_INPUT );
                expect( result ).toEqual( {state:game.STATE.CRASHED, row:ROW, column:31 } );
            });
            
            it("does not increases the score", function() {
                takeTurnManyTimesWithNoInput( 1, true );
                game.takeTurn( YES_INPUT );
                expect( game.getScore() ).toEqual( 0 );
            })
            
        });

        describe("if kapsula just passed the edge", function(){
            
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

        });

        describe("if kapsula made 3 steps before user input on free spot", function(){
            
            it("returns status LANDED when coming from the left", function() {
                takeTurnManyTimesWithNoInput( 3, true );
                var result = game.takeTurn( YES_INPUT );
                expect( result ).toEqual( {state:game.STATE.LANDED, row:ROW, column: 2 } );
            });

            it("returns status LANDED when coming from the right", function() {
                takeTurnManyTimesWithNoInput( 3, false );
                var result = game.takeTurn( YES_INPUT );
                expect( result ).toEqual( {state:game.STATE.LANDED, row:ROW, column: 29 } );
            });

            it("goes into crashed state if you try to land twice to the same position", function() {
                takeTurnManyTimesWithNoInput( 2, true );
                var shouldBeLanded = game.takeTurn( YES_INPUT );
                takeTurnManyTimesWithNoInput( 2, true );
                var shouldBeCrashed = game.takeTurn( YES_INPUT );
                expect( shouldBeCrashed ).toEqual( {state:game.STATE.CRASHED, row:ROW, column:1} );                
            });

            it("goes into flying state after landing once", function() {
                takeTurnManyTimesWithNoInput( 3, false );
                var result = game.takeTurn( YES_INPUT );
                expect( takeTurnManyTimesWithNoInput( 1, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:0} );
            });

            it("does increase the score", function() {
                takeTurnManyTimesWithNoInput( 3, true );
                expect( game.getScore() ).toEqual( 0 );
                game.takeTurn( YES_INPUT );
                expect( game.getScore() ).toEqual( 1 );
            })
                
        });
        
        describe("decreasing the number of available kapsulas", function() {
            
            it("initially has 40 kapsulas", function() {
                expect( game.getNumberOfKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS );
            });
            
            it("after first time will decrease by 1", function() {
                takeTurnManyTimesWithNoInput( 6, true );
                expect( game.getNumberOfKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS - 1 );
            });
            
            it("after first kapsula is lost, and new kapsula started, will decrease by 2", function() {
               takeTurnManyTimesWithNoInput( game.MAX_COLUMNS, false );
               takeTurnManyTimesWithNoInput( 6, true );
               expect( game.getNumberOfKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS - 2 );
            });
            
            it("will enter the END state when all kapsulas are consumed", function() {
               for( var i = 0; i < game.INITIAL_NUMBER_OF_KAPSULAS; i++ ){
                   takeTurnManyTimesWithNoInput( game.MAX_COLUMNS + 1, false );               
               } 
               expect( game.takeTurn(NO_INPUT) ).toEqual( {state:game.STATE.END, row:undefined, column:undefined } );
            });
            
        });
        
        describe("when successfully landed 30 kapsulas", function(){
           
            it("enters the COMPLETED state and 8 are remaining", function(){
                for( var i = 0; i < 30; i++ ){
                    takeTurnManyTimesWithNoInput( i + 2, true );
                    expect( game.takeTurn( YES_INPUT) ).toEqual( {state:game.STATE.LANDED, row:ROW, column:i+1 } );
                }
                expect( takeTurnManyTimesWithNoInput( 1, true ) ).toEqual( {state:game.STATE.COMPLETED, row:undefined, column:undefined } );
                expect( game.getNumberOfKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS - 30 );
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
