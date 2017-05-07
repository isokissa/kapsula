module.exports = {
    
    init: function() {
        var pressed = this.pressed; 
        $("body").keypress(function(e) {
            if (e.keyCode === 32) {
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

