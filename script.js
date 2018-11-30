// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var texture = new THREE.TextureLoader().load( "models/head3d.jpg" );


var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var materialTexture = new THREE.MeshBasicMaterial( { map: texture }); 
var materialSolid = new THREE.MeshBasicMaterial( { color: "#433F81" } );
//var cube = new THREE.Mesh( geometry, material );


// Add cube to Scene
// scene.add( cube );

var objects = []

var loader = new THREE.OBJLoader();

// load a resource
loader.load(
	// resource URL
	'models/head3d.obj',
	// called when resource is loaded
	function ( object ) {
		size = .01
		object.scale.x = size
		object.scale.y = size
		object.scale.z = size

		object.children[0].material = materialTexture

		objects.push(object)
		scene.add( object );
	},
	// called when loading is in progresses
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);

loader.load(
	// resource URL
	'models/tophat.obj',
	// called when resource is loaded
	function ( object ) {


		object.children[0].material = materialSolid;

		objects.push(object);
		scene.add( object );
	},
	// called when loading is in progresses
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  // cube.rotation.x += 0.01;
  // cube.rotation.y -= 0.01;

  	for (var i = 0; i < objects.length; i++) {

	  objects[i].rotation.x += 0.01;
	  objects[i].rotation.y += 0.01;

	}

  // Render the scene
  renderer.render(scene, camera);
};

render();