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
            
        })
                
        describe("when first time advance", function() {
            it("invokes the randomizer to get the starting position of first kapsula", function() {
                spyOn( randomizer, "getNextRandomNumber" );
                game.advance();
                expect( randomizer.getNextRandomNumber ).toHaveBeenCalledTimes(1);
            });
        });
    });
      
});


var TestRandomizer = function(){
    
}

TestRandomizer.prototype = Object.create( Randomizer.prototype );
TestRandomizer.prototype.constructor = TestRandomizer;
