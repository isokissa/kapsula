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
        var NO_INPUT = 0; 
        
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
        }

        it("first time also invokes the randomizer twice to get the starting position and direction of first kapsula", function() {
            spyOn( randomizer, "getRandomNumber" );
            game.advance(NO_INPUT);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledTimes(2);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledWith(23);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledWith(2);
        });
      
        it("first time returns the FLYING object at position (0,14) if generated numbers are 14 and 0", function() {
            expect( advanceManyTimesWithNoInput(1, true) ).toEqual( {state:"FLYING", row:ROW, column:0} );
        })

        it("first time returns the FLYING object coming from the right side (column 31)", function() {
            expect( advanceManyTimesWithNoInput(1, false) ).toEqual( {state:"FLYING", row:ROW, column:31} );
        })

        
        it("second time returns the FLYING object at position (1,14)", function() {
            expect( advanceManyTimesWithNoInput(2, true) ).toEqual( {state:"FLYING", row:ROW, column:1} );
        })

        it("second time returns the FLYING object at position (30,14), if started from the right side", function() {
            expect( advanceManyTimesWithNoInput(2, false) ).toEqual( {state:"FLYING", row:ROW, column:30} );
        })
        
        it("returns status LOST if advance is done 33 times from left, without user input", function(){
            expect( advanceManyTimesWithNoInput( game.MAX_COLUMNS + 1, true ) ).toEqual( {state: "LOST", row: undefined, column: undefined } );
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
})


var TestRandomizer = function TestRandomizer(){
    Randomizer.apply(this, arguments);
    this.nextNumberSequence = [1,1,1,1]; 
};

TestRandomizer.prototype = Object.create( Randomizer.prototype );
TestRandomizer.prototype.constructor = TestRandomizer;

TestRandomizer.prototype.getRandomNumber = function(aLimit) {
    var nextNumber = this.nextNumberSequence.shift();
    return nextNumber % aLimit;
};

TestRandomizer.prototype.setNextNumberSequence = function(aNextNumberSequence) {
    this.nextNumberSequence = aNextNumberSequence; 
};
