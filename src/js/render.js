module.exports = {

//    kapsulaTemplate: '<polygon points="1,7 1,2 6,2 6,1 2,1 2,4 6,4 6,2 7,2 7,7 6,7 6,5 2,5 2,7"' + 
//                     ' style="fill:rgb(0,0,10);stroke-width:0;" class="kapsula"/>',

    clean: function() {
        $("#screen .kapsula").remove();
    },
    
    createKapsula: function(id) {        
        var kapsula = $(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
        kapsula.attr("points", "1,7 1,2 6,2 6,1 2,1 2,4 6,4 6,2 7,2 7,7 6,7 6,5 2,5 2,7");
        kapsula.attr("style", "fill:rgb(0,0,10);stroke-width:0;");
        kapsula.attr("class", "kapsula");
        kapsula.attr("id", "i" + id);
        kapsula.hide();
        $("#screen").append(kapsula);
    },
    
    plot: function(id, x, y) {
        $("#screen #i" + id).css({"transform": "translate(" + x * 8 + "px," + y * 8 + "px)"}).show();
    },
    
    unplot: function(id) {
        $("#screen #i" + id).hide();        
    },
    
    result: function(score, remaining) {
        $("#result #score").text(score);
        $("#result #remaining").text(remaining);        
    },
    
    crash: function() {
        $("#crash").show();
    }
    
};


