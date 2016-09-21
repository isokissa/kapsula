$(document).ready( function() {

    var windowWidth = $(document).width();
    var windowHeight = $(document).height();

    var myLine = document.getElementById("myLine");
    myLine.setAttribute( "x2", windowWidth );
    myLine.setAttribute( "y2", windowHeight );

});


