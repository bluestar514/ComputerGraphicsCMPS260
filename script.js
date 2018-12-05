// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

//TrackballControls
var controls = new THREE.TrackballControls(camera);

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
var texture1 = new THREE.TextureLoader().load( "models/bethhead3d.jpg" );
var texture2 = new THREE.TextureLoader().load( "models/mirekHead3d.jpg")

var materialTexture1 = new THREE.MeshBasicMaterial( { map: texture1 });
var materialTexture2 = new THREE.MeshBasicMaterial( { map: texture2} );
var materialSolid = new THREE.MeshBasicMaterial( { color: "#433F81" } );

var textureDuck = new THREE.TextureLoader().load( "models/duckhat.mtl" );
var materialDuck = new THREE.MeshBasicMaterial( { map: textureDuck });
//var cube = new THREE.Mesh( geometry, material );
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// Add cube to Scene
// scene.add( cube );

var objects = {}

var loader = new THREE.OBJLoader();

function loadHead(head, materialTexture, landmarks){

	//clear Scene
	while(scene.children.length > 0){
		scene.remove(scene.children[0]);
	}
	
	// load a resource
	loader.load(
		// resource URL
		head,
		// called when resource is loaded
		function ( object ) {
			size = .01
			object.scale.x = size
			object.scale.y = size
			object.scale.z = size

			object.children[0].material = materialTexture

			objects["head"] = object
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
		landmarks,
		// called when resource is loaded
		function ( object ) {
			size = .01
			object.scale.x = size
			object.scale.y = size
			object.scale.z = size

			object.children[0].material = materialSolid;

			objects["faceLandmarks"] = object;
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
}
// loader.load(
// 	// resource URL
// 	'models/duckhat.obj',
// 	// called when resource is loaded
// 	function ( object ) {
// 		size = 1.5
// 		object.scale.x = size
// 		object.scale.y = size
// 		object.scale.z = size

// 		object.position.y = -3

// 		object.children[0].material = materialDuck;

// 		objects["duckhat"] = object;
// 		scene.add( object );


// 	},
// 	// called when loading is in progresses
// 	function ( xhr ) {
// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// 	},
// 	// called when loading has errors
// 	function ( error ) {
// 		console.log( 'An error happened' );
// 	}
// );

// var mtlLoader = new THREE.MTLLoader();
// mtlLoader.setPath('models/');
// mtlLoader.load('duckhat.mtl', function(materials) {
//   	materials.preload();
//   	var objLoader = new THREE.OBJLoader();
//   	objLoader.setMaterials(materials);
//   	objLoader.setPath('models');
//   	objLoader.load('duckhat.obj', function(object) {
// 	    	size = 1.5
// 			object.scale.x = size
// 			object.scale.y = size
// 			object.scale.z = size
//
// 			object.position.y = -3
// 	    	scene.add(object);
// 	  	},
// 	  	function ( xhr ) {
// 			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// 		},
// 		// called when loading has errors
// 		function ( error ) {
// 			console.log( 'An error happened' );
// 		}
// 	)
// });

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  // cube.rotation.x += 0.01;
  // cube.rotation.y -= 0.01;

 //  	for (var i = 0; i < objects.length; i++) {

	//   objects[i].rotation.x += 0.01;
	//   objects[i].rotation.y += 0.01;

	// }

	controls.update();
  // Render the scene
  renderer.render(scene, camera);
};

render();
