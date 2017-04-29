module.exports = {
    
    plot: function(x, y) {
        $("#kapsula").css({"transform": "translate(" + x * 8 + "px," + y * 8 + "px)"});
    }
    
};


