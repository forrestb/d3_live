(function() {

  var mainCounter = 0;

  d3.svgProjection = {};

  d3.svgProjection.stateManager = {
    socket: null, 
    room: null
  }

  d3.svgProjection.init = function(serial, options) {

    this.stateManager.socket = io.connect('http://localhost');
    this.stateManager.room = serial;

    this.stateManager.socket.emit('subscribe', {
      domain: document.domain,
      room: serial
    });

    this.stateManager.socket.on('recConn', function(statusOptions) {
      if ( !statusOptions || !statusOptions.status || statusOptions.status == 0 ) {
        return;
      }
    });

  }

  d3.selection.prototype.project = d3.selection.enter.prototype.project = function(options) {

    setTimeout(function() {
      mainCounter++;

      console.log("Main Counter");
      console.log(mainCounter);

      if (mainCounter % 100 == 0) {
        console.log( d3.select(this).attr('data-project') );
      }
    }, 300);

    var selectedElements = this[0];

    // Find a way to propagate all of the attributes
    var selectionLocations = [];
    for ( var i = 0; i < this[0].length; ++i ) {
      var elementSelected = this[0][i];
  
       selectionLocations.push([ elementSelected.offsetLeft, elementSelected.offsetTop ]);
    }

    d3.svgProjection.stateManager.socket.emit('transformationUpdate', {
      room: d3.svgProjection.stateManager.room, 
      selLocs: selectionLocations 
    });

  }

})();
