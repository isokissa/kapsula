$(document).ready( function() {

    var myRect = document.getElementById("myRect");
    
    var x = 0;
    
    setInterval( () => {
        myRect.setAttribute("x", x);
        x += 8;
        if( x >= 256 ){
            x = 0;
        }        
    }, 200 );
    
});


