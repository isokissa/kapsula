/* 
 * (c) 2016 pt_jr  
 */


"use strict";

require( "../public_html/js/gengine");


describe("GameRunner", function() {
  
    describe("when invoked startLoop()", function() {
        
        var arcadeGame; 
        var timeouter;
        var gameRunner;

        beforeEach( function() {
            arcadeGame = Object.create( ArcadeGame );
            arcadeGame.step = function() {};
            spyOn( arcadeGame, "step" ).and.returnValues( 1111, 2222, 3333, 4444, 5555 );
            
            timeouter = {
                setTimeout: function( f, t ){
                    if( t > 0 ){
                        f();
                    }
                }
           };
           
            gameRunner = Object.create( GameRunner );
        });

        it("invokes ArcadeGame's step() function", function() {
            gameRunner.startLoop(arcadeGame, timeouter.setTimeout );
            expect( arcadeGame.step ).toHaveBeenCalled();
        });

        it("invokes setTimeout() function", function() {
            spyOn( timeouter, "setTimeout" );
            gameRunner.startLoop(arcadeGame, timeouter.setTimeout );
            expect( timeouter.setTimeout ).toHaveBeenCalledWith(jasmine.anything(), 1111);
        });
        
        it("will set the next timeout to 2222 milliseconds", function() {
            spyOn( arcadeGame, "setNextTimeoutTime" );
            gameRunner.startLoop(arcadeGame, timeouter.setTimeout );
            expect( arcadeGame.setNextTimeoutTime ).toHaveBeenCalledWith( 2222 );
        });
        
        it("invokes timeout with the value given by previous call to ArcadeGame's step() function", function() {
            spyOn( timeouter, "setTimeout" ).and.callThrough();
            gameRunner.startLoop(arcadeGame, timeouter.setTimeout );
            expect( timeouter.setTimeout ).toHaveBeenCalledTimes(5);            
        });
        
    });
    
});
