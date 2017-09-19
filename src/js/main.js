var scene, camera, renderer;
var vrControls, vrEffect, vrDisplay, rayInput, skybox, elem;
var loader = new THREE.TextureLoader(),
nodeGroup = new THREE.Object3D(),
currentNode = new THREE.Object3D();

// vrDisplay = controls.getVRDisplay()
if (navigator.getVRDisplays) {
	navigator.getVRDisplays().then(function (displays){
		if ( displays.length > 0 ) {
			vrDisplay = displays[0];
		} else {
			console.warn( 'VR Display not found' )
		}
	}).catch(function (){
		console.warn( 'THREE.VRControls: Unable to get VR Displays' )
	});
} else {
	console.warn('WebVR API not available')
}

var container = document.getElementById('container')
init(container)

function init(container) {
	elem = container || window

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, elem.clientWidth / elem.clientHeight, 0.1, 1000);
	scene.add(camera);
	
	// Apply VR headset positional data to camera.
	vrControls = new THREE.VRControls(camera)
	vrControls.standing = true
	camera.position.y = vrControls.userHeight

	renderer = new THREE.WebGLRenderer({antialias: false});
	renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
	renderer.setSize(elem.clientWidth, elem.clientHeight);
	elem.appendChild(renderer.domElement);

	// Apply VR stereo rendering to renderer.
	vrEffect = new THREE.VREffect(renderer);
	vrEffect.setSize(elem.clientWidth, elem.clientHeight);

	// Initialize RayInput
	rayInput = new RayInput.default(camera, renderer.domElement)
	rayInput.setSize(renderer.getSize())
	scene.add(rayInput.getMesh())	
	renderObjects();
	animate();
	addEventHandlers();
}

loader.load('assets/img/01.jpg', onTextureLoaded);
function onTextureLoaded(texture) {
	var geometry = new THREE.SphereGeometry(800, 32, 32);
	geometry.scale(-1, 1, 1);
	var material = new THREE.MeshBasicMaterial({ map: texture });
	skybox = new THREE.Mesh(geometry, material);
	scene.add(skybox);
}

function renderObjects() {
	fetch('assets/nodes.json').then(function(response) {
		return response.json();
	}).then(function(response) {
		scene.add(nodeGroup);
		var geometry, material, cube;
		response.nodes.forEach(function(node, index) {
			var group = new THREE.Object3D();
			group.name = node.name;
			node.markers.forEach(function(marker) {
				geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
				material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
				cube = new THREE.Mesh(geometry, material);
				geometry.translate(10 * marker.loc.x, 10 * marker.loc.y, 10 * marker.loc.z);
				cube.link = marker.link;
				group.add(cube);
				if(index === 0) {
					rayInput.add(cube);
				}
			});
			nodeGroup.add(group);
			if(index === 0) {
				currentNode = group;
			}
			else {
				group.visible = false;
			}
		});
	});
}

function animate() {
	vrControls.update();
	rayInput.update();
	vrEffect.render(scene, camera);
	;(vrDisplay?vrDisplay: window).requestAnimationFrame(animate);
}

function addEventHandlers() {
	rayInput.on('rayover', function (obj) {
		obj.material.color.setHex( 0x0000ff )
	});
	rayInput.on('rayout', function (obj) {
		obj.material.color.setHex( 0x00ff00 )
	});
	rayInput.on('raydown', function (obj) {
		if (obj && obj.link) {
			obj.material.color.setHex( 0x00ff00 )
			updateCanvas(obj.link)
		}
	});

	function onResize() {
		var width, height
		setTimeout(function() {
			if (screenfull.isFullscreen) {
				width = window.innerWidth
				height = window.innerHeight
			} else {
				width = elem.clientWidth
				height = elem.clientHeight
			}
			renderer.setSize(width, height)
			vrEffect.setSize(width, height)
			rayInput.setSize(renderer.getSize())
			camera.aspect = width / height
			camera.updateProjectionMatrix()
		}, 10);
	}

	window.addEventListener('resize', onResize);
	window.addEventListener('vrdisplaypresentchange', onResize);
	document.getElementById('vr').addEventListener('click', function() {
		vrDisplay.requestPresent([{source: renderer.domElement}]);
	});
	document.getElementById('fullscreen').addEventListener('click', function() {
		screenfull.request(container);
	});
}

function updateCanvas(src) {
	if (currentNode) {
		currentNode.visible = false
		currentNode.children.forEach(mesh => {
			rayInput.remove(mesh)
		})
	}
	loader.load('assets/img/' + src, function (texture) {
		skybox.material.map = texture
		skybox.material.map.needsUpdate = true
		vrDisplay.resetPose();
		
		currentNode = scene.getObjectByName(src)
		if (currentNode) {
			currentNode.visible = true
			currentNode.children.forEach(mesh => {
				rayInput.add(mesh)
			})
		}
	})
}