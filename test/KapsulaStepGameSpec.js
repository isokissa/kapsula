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
    });
    
    describe("invoking advance", function() {
        var game; 
        var randomizer; 
        
        beforeEach(function() {
            randomizer = new TestRandomizer();
            game = new KapsulaStepGame(randomizer);
        });

        it("complains if no user input is given", function() {
            var testBlock = function(){
                game.advance();
            };
            expect( testBlock ).toThrowError( InvalidParameterError, "missing user input" );            
        });

        it("first time also invokes the randomizer to get the starting position of first kapsula", function() {
            spyOn( randomizer, "getRandomNumber" );
            game.advance(0);
            expect( randomizer.getRandomNumber ).toHaveBeenCalledTimes(1);
        });
      
        it("first time returns the FLYING object at position (0,15)", function() {
            var ROW = 15;
            randomizer.setNextNumber(ROW);
            randomizer.getRandomNumber(22);
            var stateChanges = game.advance(0);
            expect( stateChanges ).toEqual( {state:"FLYING", row:ROW, column:0} );
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
    this.nextNumber = 15; 
};

TestRandomizer.prototype = Object.create( Randomizer.prototype );
TestRandomizer.prototype.constructor = TestRandomizer;

TestRandomizer.prototype.getRandomNumber = function(dummy) {
    return this.nextNumber;
};

TestRandomizer.prototype.setNextNumber = function(aNextNumber) {
    this.nextNumber = aNextNumber; 
};
