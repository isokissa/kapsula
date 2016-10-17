/* 
 * (c) 2016 isokissa
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaStepGame", function() {
    
    describe("when construct", function() {
        it("trows an exception if the randomizer is not given", function() {
            var testBlock = function(){
                var dummy = new KapsulaStepGame();
            };
            expect( testBlock ).toThrowError( InvalidParameterError, "missing randomizer" );
        });
        
        it("throws an exception if the randomizer is not of type randomizer", function() {
            var testBlock = function(){
                var dummy = new KapsulaStepGame(2);
            };
            expect( testBlock ).toThrowError( InvalidParameterError, "invalid randomizer" );
        })
        
        it("succeeds if given randomizer inherits from Randomizer", function() {
            var randomizer = new TestRandomizer();
            var dummy = new KapsulaStepGame( randomizer );
        })
        
        it("sets the score to zero", function() {
            var kapsulaStepGame = new KapsulaStepGame( new TestRandomizer ); 
            expect( kapsulaStepGame.getScore() ).toEqual( 0 );
        })
    });
    
    describe("invoking advance", function() {
        var game; 
        var randomizer; 
        var ROW = 14;
        var NO_INPUT = false;
        var YES_INPUT = true;
        
        beforeEach(function() {
            randomizer = new TestRandomizer();
            game = new KapsulaStepGame(randomizer);
        });

        it("throws exception if no user input is given", function() {
            var testBlock = function(){
                game.advance();
            };
            expect( testBlock ).toThrowError( InvalidParameterError, "missing user input" );            
        });
        
        var advanceManyTimesWithNoInput = function( howManyTimes, fromLeft ) {
            randomizer.setNextNumberSequence( [ROW, (fromLeft? 0: 1)] );
            var lastResult; 
            for( var i = 0; i < howManyTimes; i++ ){
                lastResult = game.advance(NO_INPUT);
            }
            return lastResult;
        };

        it("first time also invokes the randomizer twice to get the starting position and direction of first kapsula", function() {
            spyOn( randomizer, "getRandomNumber" );
            game.advance(NO_INPUT);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledTimes(2);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledWith(23);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledWith(2);
        });
      
        it("first time returns the FLYING_FROM_LEFT object at position (0,14) if generated numbers are 14 and 0", function() {
            expect( advanceManyTimesWithNoInput(1, true) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:0} );
        })

        it("first time returns the FLYING_FROM_RIGHT object coming from the right side (column 31)", function() {
            expect( advanceManyTimesWithNoInput(1, false) ).toEqual( {state:game.STATE.FLYING_FROM_RIGHT, row:ROW, column:31} );
        })

        it("second time returns the FLYING object at position (1,14)", function() {
            expect( advanceManyTimesWithNoInput(2, true) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:1} );
        })

        it("second time returns the FLYING object at position (30,14), if started from the right side", function() {
            expect( advanceManyTimesWithNoInput(2, false) ).toEqual( {state:game.STATE.FLYING_FROM_RIGHT, row:ROW, column:30} );
        })
        
        it("moves the object 15 steps when advanced 15 times", function() {
            expect( advanceManyTimesWithNoInput( 15, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:14 } );
        });
        
        it("moves the object 32 steps when advanced 32 times and it still flies", function() {
            expect( advanceManyTimesWithNoInput( game.MAX_COLUMNS, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:game.MAX_COLUMNS-1} );
        })

        describe("if kapsula leaves the screen", function() {
            
            it("returns status LOST if advance is done 33 times from left, without user input", function(){
                expect( advanceManyTimesWithNoInput( game.MAX_COLUMNS + 1, true ) ).toEqual( {state: game.STATE.LOST, row: undefined, column: undefined } );
            });

            it("returns status LOST if advance is done 33 times from right, without user input", function(){
                expect( advanceManyTimesWithNoInput( game.MAX_COLUMNS + 1, false ) ).toEqual( {state: game.STATE.LOST, row: undefined, column: undefined } );
            });        

            it("creates new kapsula after the previous one is lost", function() {
                advanceManyTimesWithNoInput( game.MAX_COLUMNS + 1, true );
                expect( advanceManyTimesWithNoInput( 1, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:0} );
            });

            it("may create new kapsula on the other side after the previous one is lost", function() {
                advanceManyTimesWithNoInput( game.MAX_COLUMNS + 1, true );
                expect( advanceManyTimesWithNoInput( 1, false ) ).toEqual( {state:game.STATE.FLYING_FROM_RIGHT, row:ROW, column:31} );
            });
            
            it("keeps the score at zero", function() {
                advanceManyTimesWithNoInput( game.MAX_COLUMNS + 1, true );
                expect( advanceManyTimesWithNoInput( 1, true ) ).toEqual( {state:game.STATE.FLYING_FROM_LEFT, row:ROW, column:0} );
                expect( game.getScore() ).toEqual( 0 );
            })
            
        });
        
        describe("if kapsula just entered the screen and the input is given", function() {

            it("returns status CRASHED when coming from left", function() {
                advanceManyTimesWithNoInput( 1, true );
                var result = game.advance( YES_INPUT );
                expect( result ).toEqual( {state:game.STATE.CRASHED, row:ROW, column:0 } );
            });
            
            it("returns status CRASHED when coming from right", function() {
                advanceManyTimesWithNoInput( 1, false );
                var result = game.advance( YES_INPUT );
                expect( result ).toEqual( {state:game.STATE.CRASHED, row:ROW, column:31 } );
            });
            
            it("does not increases the score", function() {
                advanceManyTimesWithNoInput( 1, true );
                game.advance( YES_INPUT );
                expect( game.getScore() ).toEqual( 0 );
            })
            
        });
        
        describe("if kapsula made 3 steps before user input on free spot", function(){
            
            it("returns status LANDED when coming from the left", function() {
                advanceManyTimesWithNoInput( 3, true );
                var result = game.advance( YES_INPUT );
                expect( result ).toEqual( {state:game.STATE.LANDED, row:ROW, column: 2 } );
            });

            it("returns status LANDED when coming from the right", function() {
                advanceManyTimesWithNoInput( 3, false );
                var result = game.advance( YES_INPUT );
                expect( result ).toEqual( {state:game.STATE.LANDED, row:ROW, column: 29 } );
            });

            it("does increase the score", function() {
                advanceManyTimesWithNoInput( 3, true );
                expect( game.getScore() ).toEqual( 0 );
                game.advance( YES_INPUT );
                expect( game.getScore() ).toEqual( 1 );
            })
                
        });
        
        describe("decreasing the number of available kapsulas", function() {
            
            it("initially has 40 kapsulas", function() {
                expect( game.getNumberOfKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS );
            });
            
            it("after first time will decrease by 1", function() {
                advanceManyTimesWithNoInput( 6, true );
                expect( game.getNumberOfKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS - 1 );
            });
            
            it("after first kapsula is lost, and new kapsula started, will decrease by 2", function() {
               advanceManyTimesWithNoInput( game.MAX_COLUMNS, false );
               advanceManyTimesWithNoInput( 6, true );
               expect( game.getNumberOfKapsulas() ).toEqual( game.INITIAL_NUMBER_OF_KAPSULAS - 2 );
            });
            
            it("will enter the END state when all kapsulas are consumed", function() {
               for( var i = 0; i < game.INITIAL_NUMBER_OF_KAPSULAS; i++ ){
                   advanceManyTimesWithNoInput( game.MAX_COLUMNS + 1, false );               
               } 
               expect( game.advance(NO_INPUT) ).toEqual( {state:game.STATE.END, row:undefined, column:undefined } );
            });
            
        })
        
    });
      
});

describe("Randomizer", function() {
    
    it("throws exception if no upper limit is given in getRandomNumber", function() {
        var randomizer = new Randomizer();
        var testBlock = function(){
            var a = randomizer.getRandomNumber();
        };
        expect( testBlock ).toThrowError( InvalidParameterError, "no upper limit given to Randomizer" );
    })
    
    it("throws exception if upper limit is less than 2", function() {
        var randomizer = new Randomizer();
        var testBlock = function(){
            var a = randomizer.getRandomNumber( 1 );
        };
        expect( testBlock ).toThrowError( InvalidParameterError, "upper limit must be bigger than 1" );
    })
})

///////////////////////

var TestRandomizer = function TestRandomizer(){
    Randomizer.apply(this, arguments);
    this.nextNumberSequence = [1,1,1,1]; 
};

TestRandomizer.prototype = Object.create( Randomizer.prototype );
TestRandomizer.prototype.constructor = TestRandomizer;

TestRandomizer.prototype.getRandomNumber = function(aLimit) {
    var nextNumber = this.nextNumberSequence.shift();
    if( nextNumber === undefined ){
        throw new Error( "ran out of predefined random numbers" );
    }
    return nextNumber % aLimit;
};

TestRandomizer.prototype.setNextNumberSequence = function(aNextNumberSequence) {
    this.nextNumberSequence = aNextNumberSequence; 
};
