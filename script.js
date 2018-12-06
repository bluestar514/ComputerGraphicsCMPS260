// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

//index 51 - left side
//index 411 - right sdie

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

var light = new THREE.AmbientLight( 0xFFFFFF, 1);
scene.add(light);

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

var headTop;
var bethLeft = -0.67147;
var bethRight = 0.746513;
var bethTop = 0.74859;
var bethFront = 0.663237;
var scaleX;
var scaleZ;
// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var texture1 = new THREE.TextureLoader().load( "models/bethhead3d.jpg" );
var texture2 = new THREE.TextureLoader().load( "models/mirekHead3d.jpg")

var materialTexture1 = new THREE.MeshPhongMaterial( { map: texture1 });
var materialTexture2 = new THREE.MeshPhongMaterial( { map: texture2} );
var materialSolid = new THREE.MeshPhongMaterial( { color: "#433F81" } );

var textureDuck = new THREE.TextureLoader().load( "models/duckhat.mtl" );
var materialDuck = new THREE.MeshPhongMaterial( { map: textureDuck });
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

	scene.add(light);

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
			size = 0.01
			object.scale.x = size
			object.scale.y = size
			object.scale.z = size

			findHatVertical(object);
			scaleDifferenceX(object);
			scaleDifferenceZ(object);
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

function loadHat(){

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('models/');
	mtlLoader.load('duckhat.mtl', function(materials) {
	  	materials.preload();
	  	var objLoader = new THREE.OBJLoader();
	  	objLoader.setMaterials(materials);
	  	objLoader.setPath('models/');
	  	objLoader.load('duckhat.obj', function(object) {

		    size = 1;
				object.scale.x = scaleX;
				object.scale.y = size
				object.scale.z = scaleZ;


				object.position.set(0, headTop, 0);
		    scene.add(object);
		  },
		  	function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened' );
			}
		)
	});
}

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

function findHatVertical(object){
	headTop = (object.children[0].geometry.getAttribute("position").array[574]) * 0.01;
	console.log(object.children[0].geometry.getAttribute("position").array);
	headTop = headTop / bethTop - 1;
}

function scaleDifferenceX(object){
	var leftSide = (object.children[0].geometry.getAttribute("position").array[51]) * 0.01;
	scaleX = bethLeft/leftSide;
}

function scaleDifferenceZ(object){
	var headFront = (object.children[0].geometry.getAttribute("position").array[845]) * 0.01;
	scaleZ = headFront / bethFront;
}
render();
