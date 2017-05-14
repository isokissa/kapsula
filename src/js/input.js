module.exports = {
    
    init: function() {
        var stateRef = this.state; 
        $("body").keypress(function(e) {
            var code = e.which || e.keyCode;
            if (code === 32) {
                stateRef.land = true; 
            } else if (code === 13) {
                stateRef.next = true; 
            }
        });
        $("#next").on("click", function() {
            stateRef.next = true; 
        });
        $("#screen,#crash").on("click", function() {
            stateRef.land = true; 
        });
    },
    
    state: {},
    
    consume: function() {
        var state = {
            land: !!this.state.land,
            next: !!this.state.next
        }; 
        this.state.land = false;
        this.state.next = false; 
        return state; 
    }

};

