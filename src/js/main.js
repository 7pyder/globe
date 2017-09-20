import 'webvr-polyfill'
const THREE = require('three')

var scene, camera, renderer, globe
var win = window

var loader = new THREE.TextureLoader()
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 75, win.innerWidth / win.innerHeight, 0.1, 1000 )
camera.position.z = 200

var renderer = new THREE.WebGLRenderer()
renderer.setSize( win.innerWidth, win.innerHeight )
document.body.appendChild( renderer.domElement )

loader.load('assets/img/earth.jpg', function (texture) {
	var geometry = new THREE.SphereGeometry(100, 32, 32)
	var material = new THREE.MeshBasicMaterial({ map: texture })
	globe = new THREE.Mesh(geometry, material)
	scene.add(globe)
	animate()
	addEvents()
})

function animate() {
	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}

var lastMove = [window.innerWidth/2, window.innerHeight/2]

function rotateOnKeydown(e) {
	switch (e.keyCode) {
		case 38:
			globe.rotation.x -= 0.05
			break
		case 40:
			globe.rotation.x += 0.05
			break
		case 37:
			globe.rotation.y -= 0.05
			break
		case 39:
			globe.rotation.y += 0.05
			break
		default:
			break
	}
}

function rotateOnMouseMove(e) {
	const moveX = (e.clientX - lastMove[0])
	const moveY = (e.clientY - lastMove[1])

	globe.rotation.y += (moveX * .005)
	globe.rotation.x += (moveY * .005)

	lastMove[0] = e.clientX
	lastMove[1] = e.clientY
}

function onMouseover(e) {
	lastMove[0] = e.clientX
	lastMove[1] = e.clientY
}

function onResize() {
	renderer.setSize( win.innerWidth, win.innerHeight )
	camera.aspect = win.innerWidth / win.innerHeight
	camera.updateProjectionMatrix()
}

function addEvents() {
	win.addEventListener('keydown', rotateOnKeydown)
	win.addEventListener('mousemove', rotateOnMouseMove)
	win.addEventListener('mouseover', onMouseover)
	win.addEventListener('resize', onResize)
}