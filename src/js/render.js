module.exports = {

//    kapsulaTemplate: '<polygon points="1,7 1,2 6,2 6,1 2,1 2,4 6,4 6,2 7,2 7,7 6,7 6,5 2,5 2,7"' + 
//                     ' style="fill:rgb(0,0,10);stroke-width:0;" class="kapsula"/>',

    clean: function() {
        $("#screen .kapsula").remove();
        this.crashHide();
        this.nextHide();
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
    
    level: function(level) {
        $("#result #level").text(level);
    },
    
    result: function(score, remaining) {
        $("#result #score").text(score);
        $("#result #remaining").text(remaining);        
    },
    
    highScore: function(highScore) {
        $("#result #highScore").text("HI: " + highScore);
    },
    
    crashShow: function() {
        $("#crash").show();
    }, 
    
    crashHide: function() {
        $("#crash").hide();
    }, 
    
    nextShow: function() {
        $("#next").show();
    }, 

    nextHide: function() {
        $("#next").hide();
    }, 
    
    instructionsShow: function() {
        $("#instructions").show();        
    },

    instructionsHide: function() {
        $("#instructions").hide();        
    },

};


