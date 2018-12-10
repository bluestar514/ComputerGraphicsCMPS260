// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

//index 51 - left side
//index 411 - right sdie

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 3;

var objects = {"faceLandmarks" : null}
var light = new THREE.PointLight( 0xfffaf0, 1, 100);
var fillLight = new THREE.AmbientLight(0xfffaf0, 0.75);
light.position.set(1, 1, 1);
light.castShadow = true;
scene.add(light);
scene.add(fillLight);
objects["light"] = light;
objects["fillLight"] = fillLight;

//TrackballControls
var controls = new THREE.TrackballControls(camera);

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, 600 );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

var headTop;
var bethLeft = -0.67147;
var bethRight = 0.746513;
var bethWide = -bethLeft + bethRight;
var bethTop = 0.74859;
var bethFront = 0.663237;
var scaleX;
var scaleZ;

var landmarkFile = null;
// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

var localPlane = new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0.5 );

renderer.localClippingEnabled = true;

var loader = new THREE.OBJLoader();

function loadHead(head, textureName, landmarks){
	// var localPlane = loadLandmark(landmarks);
	var texture = new THREE.TextureLoader().load( textureName );
	var materialTexture = new THREE.MeshPhongMaterial( { map: texture, 
														shininess: 10,
														clippingPlanes: [ localPlane ],
    													clipShadows: true });
	//clear Scene
	while(scene.children.length > 0){
		scene.remove(scene.children[0]);
	}

	scene.add(light);
	scene.add(fillLight);
	objects["light"] = light;
	objects["fillLight"] = fillLight;

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

	loadLandmark(landmarks);
}

function loadHat(objectName){
	console.log(localPlane.constant)
	console.log(headTop)
	localPlane.constant = headTop
	loadAccessory(objectName, "hat")
	
}

function loadGlasses(objectName){
	
	loadAccessory(objectName, "glasses")
	
}

function loadAccessory(objectName, accessory){ //do not include file type

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('models/');
	mtlLoader.load(objectName + '.mtl', function(materials) {
	  	materials.preload();
	  	
	  	var objLoader = new THREE.OBJLoader();
	  	objLoader.setMaterials(materials);
	  	objLoader.setPath('models/');
	  	objLoader.load(objectName+'.obj', function(object) {
			// object.children[0].renderOrder = 999;
			// object.children[0].onBeforeRender = function ( renderer ){
			// 	renderer.clearDepth();
			// }
			object.scale.x = scaleX;
			object.scale.z = scaleZ;
			object.position.set(0, headTop, 0);
			scene.remove(objects[accessory]);
			objects[accessory] = object;
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



function loadLandmark(objectName){ //do not include file type in objectName, make sure to include a / at the end of path
	landmarkFile = objectName;

	var materialSolid = new THREE.MeshPhongMaterial( { color: "#433F81" } );

	loader.load(
		// resource URL
		objectName,
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

			// var localPlane = new THREE.Plane ( new THREE.Vector3(0, headTop, 0), 1);
			objects["faceLandmarks"] = object;
			scene.add( object );
			// return localPlane;
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


// Render Loop
var render = function () {
  requestAnimationFrame( render );

	controls.update();
  // Render the scene
  renderer.render(scene, camera);
};

function findHatVertical(object){
	headTop = (object.children[0].geometry.getAttribute("position").array[574]) * 0.01;
	headTop = headTop - bethTop;
}

function scaleDifferenceX(object){
	var leftSide = (object.children[0].geometry.getAttribute("position").array[51]) * 0.01;
	var rightSide = (object.children[0].geometry.getAttribute("position").array[411]) * 0.01;
	var width = -leftSide + rightSide;
	scaleX = bethWide/width;
}

function scaleDifferenceZ(object){
	var headFront = (object.children[0].geometry.getAttribute("position").array[845]) * 0.01;
	scaleZ = headFront / bethFront;
}

function toggleLandmarks(){
	if( objects["faceLandmarks"] == null ){ //if we have not created them, make them
		loadLandmark(landmarkFile);
	}else{ //if they are already created, remove them
		scene.remove(objects["faceLandmarks"]);
		objects["faceLandmarks"] = null;
	}
}

function toggleLights(){
	if( objects["light"] == null){
		objects["light"] = light;
		scene.add(light);
	} else {
		scene.remove(objects["light"]);
		objects["light"] = null;
	}
}

loadHead('models/bethhead3d.obj', 'models/bethhead3d.jpg', 'models/bethfaceLandmarks.obj');

render();
