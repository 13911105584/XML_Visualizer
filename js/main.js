var flag_3D;
function main(flag){
  flag_3D = flag;
  if(flag_3D){
    init();
    render();
  }
}

var reader = new FileReader();
reader.onload = function(e){
  parseXML(reader.result);
  if(flag_3D){
    removeAllGeometry();
    render3D(rootNode);
  }
}

// get file from html input
function readInputFile(){
  var file = document.getElementById("xml_input").files[0];
  reader.readAsText(file);
  /* onload event should take place here */
}
