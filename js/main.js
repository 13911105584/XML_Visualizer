// control variables
var flag_3D = true;
var ignoreBlankNode = true;
var NODE_WIDTH = 4;
var LEVEL_HEIGHT = -8;
var MIN_TREE_DISTANCE = 1;

function main(){
  if(flag_3D){
    init();
    render();
  }
}

// get file from html input
function readInputFile(){
  var file = document.getElementById("xml_input").files[0];
  reader.readAsText(file);
  /* onload event should take place here */
}

var reader = new FileReader();
reader.onload = function(e){
  parseXML(reader.result);
  if(flag_3D){
    removeAllGeometry();
    render3D(rootNode);
  }
}
