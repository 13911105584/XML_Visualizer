// control variables
var flag_3D = false;
var ignoreBlankNode = true;
var NODE_WIDTH = 4;
var LEVEL_HEIGHT = -8;
var MIN_TREE_DISTANCE = 1;
var SPHERE_RADIUS = 0.5;

function main(){
  init();
  render();
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
  removeAllGeometry();
  renderTree(rootNode);
};

function toggle3D(){
  removeAllGeometry();
  flag_3D = !flag_3D;
  renderTree(rootNode);
}
