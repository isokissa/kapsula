module.exports = {
    
    init: function() {
        var pressed = this.pressed; 
        $("body,div").keypress(function(e) {
            var code = e.which || e.keyCode;
            if (code === 32) {
                pressed.state = true; 
            }
        });  
        $("#screen").on("click", function() {
            pressed.state = true; 
        });
    },
    
    pressed: { state: false },
    
    consume: function() {
        var pressed = this.pressed.state; 
        this.pressed.state = false;
        return pressed; 
    }

};

