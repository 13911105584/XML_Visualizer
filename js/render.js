var renderer, scene, camera, controls;

// list of spheres
var spheres = [];

function main(){
  init();
  render();

  // geometry
  addSphere(0, 0, 0, 3);
  addSphere(-10, -10, 0, 3);
  addSphere(10, -10, 0, 3);
  addSphere(10, -20, 0, 3);
  addSphere(2, -20, 0, 3);
  addSphere(18, -20, 0, 3);

  // line
  addLine(spheres[0].position, spheres[1].position);
  addLine(spheres[0].position, spheres[2].position);
  addLine(spheres[2].position, spheres[3].position);
  addLine(spheres[2].position, spheres[4].position);
  addLine(spheres[2].position, spheres[5].position);
}

function init(){
  scene = new THREE.Scene();

  // camera
  var fov = 60;
  var aspect = window.innerWidth / window.innerHeight;
  var near = 1;
  var far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(5, 5, 50);

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
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff, ambient: 0xffffff,
      specular: 0xcccccc, shininess: 50, metal: true,
  });
  var mesh = new THREE.Mesh(sphere, material);
  mesh.position.set(x, y, z);

  spheres.push(mesh);
  scene.add(mesh);
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
  scene.add(line);
}
