var renderer, scene, camera, controls;

// list of geometries
var geometries = [];

function init(){
  scene = new THREE.Scene();

  // camera
  var fov = 60;
  var aspect = window.innerWidth / window.innerHeight;
  var near = 1;
  var far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 50);

  // controls
  controls = new THREE.TrackballControls(camera);

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // light
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  var ambient = new THREE.AmbientLight(0x333333);
  scene.add(ambient);
}

function render(){
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}

// add a sphere to the scene
function addSphere(x, y, z, radius){
  var sphere = new THREE.SphereGeometry(radius, 32, 16);
  var material = new THREE.MeshLambertMaterial({
    color: 0xffffff, ambient: 0xffffff,
      specular: 0xcccccc, shininess: 50, metal: true,
  });
  var mesh = new THREE.Mesh(sphere, material);
  mesh.position.set(x, y, z);

  geometries.push(mesh);
  scene.add(mesh);

  return mesh;
}

// add a line to the scene
function addLine(begin, end){
  var geometry = new THREE.Geometry();
  geometry.vertices.push(begin);
  geometry.vertices.push(end);

  var material = new THREE.LineBasicMaterial({
    color: 0xffffff
  });

  var line = new THREE.Line(geometry, material);
  geometries.push(line);
  scene.add(line);
}

function removeAllGeometry(){
  for(var i=geometries.length; i>0; i--){
    scene.remove(geometries[i-1]);
  }
}
