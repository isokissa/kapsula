/* 
 * (c) 2016 isokissa
 */

"use strict";

require( "../public_html/js/kapsula");


describe("KapsulaRenderer", function() {
    
    var dummyCurrentKapsulaElement;
    var dummyScoreElement; 
    var renderer; 
    var ROW = 14; 
    var COLUMN = 9;
    
    beforeEach( function() {
        dummyCurrentKapsulaElement = {
            setAttribute: function() {}
        };
        dummyScoreElement = {};
        renderer = createKapsulaRenderer( dummyCurrentKapsulaElement );
    });

    
    
    describe("when ShowKapsula is invoked", function() {
                
        it("will set the row and column to the given element", function() {
            spyOn( dummyCurrentKapsulaElement, "setAttribute" );
            renderer.showKapsula( ROW, COLUMN );
            expect( dummyCurrentKapsulaElement.setAttribute ).toHaveBeenCalledWith( "x", ROW * 8 ); 
            expect( dummyCurrentKapsulaElement.setAttribute ).toHaveBeenCalledWith( "y", COLUMN * 8 );
        });
        
    });
    
    describe("when showScore is invoked", function() {
        
        it("will set the text in given score element", function(){
            
        })
    })
    
    
});
