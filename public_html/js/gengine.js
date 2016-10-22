/** 
 * (c) 2016 pt_jr
 */

////////////////////////////////
// GameRunner
////////////////////////////////

GameRunner = {
    
    startLoop: function( aArcadeGame, aSetTimeoutFunction ){
        var nextTimeoutTime = aArcadeGame.step( aArcadeGame );
        aArcadeGame.setNextTimeoutTime( nextTimeoutTime );
        
        var iteration = function iteration() {
            var howMuchToWaitForNext = aArcadeGame.step( aArcadeGame );
            aArcadeGame.setNextTimeoutTime( howMuchToWaitForNext );
            if( howMuchToWaitForNext > 0 ){
                aSetTimeoutFunction( iteration, aArcadeGame.getNextTimeoutTime() );
            }
        };
        
        aSetTimeoutFunction( iteration, aArcadeGame.getNextTimeoutTime() );
    }
};


ArcadeGame = {
    
    nextTimeoutTime: 123,
        
    setNextTimeoutTime: function( aNextTimeoutTime ) {
        this.nextTimeoutTime = aNextTimeoutTime; 
    },
    
    getNextTimeoutTime: function() {
        return this.nextTimeoutTime; 
    }
};

