import 'webvr-polyfill'
const THREE = require('three')

var scene, camera, renderer, globe, active
var win = window

var loader = new THREE.TextureLoader()
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 75, win.innerWidth / win.innerHeight, 0.1, 1000 )
camera.position.z = 200

var renderer = new THREE.WebGLRenderer()
renderer.setSize( win.innerWidth, win.innerHeight )
document.body.appendChild( renderer.domElement )

loader.load('src/assets/img/earth.jpg', function (texture) {
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

var lastLoc = [0, 0]

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
	if (!active) return

	const moveX = (e.clientX - lastLoc[0])
	const moveY = (e.clientY - lastLoc[1])

	globe.rotation.y += (moveX * .005)
	globe.rotation.x += (moveY * .005)

	lastLoc[0] = e.clientX
	lastLoc[1] = e.clientY
}

function rotate(x, y) {
	if (!active) return

	const moveX = (x - lastLoc[0])
	const moveY = (y - lastLoc[1])

	globe.rotation.y += (moveX * .005)
	globe.rotation.x += (moveY * .005)

	lastLoc[0] = x
	lastLoc[1] = y
}

function onmousedown(e) {
	active = true
	lastLoc[0] = e.clientX
	lastLoc[1] = e.clientY
}

function onmousemove(e) {
	rotate(e.clientX, e.clientY)
}

function ontouchstart(e) {
	active = true
	lastLoc[0] = e.touches[0].pageX
	lastLoc[1] = e.touches[0].pageY
}

function ontouchmove(e) {
	rotate(e.touches[0].pageX, e.touches[0].pageY)
}

function setInactive(e) {
	active = false
}

function onResize() {
	renderer.setSize( win.innerWidth, win.innerHeight )
	camera.aspect = win.innerWidth / win.innerHeight
	camera.updateProjectionMatrix()
}

function addEvents() {
	win.addEventListener('keydown', rotateOnKeydown)
	win.addEventListener('touchstart', ontouchstart)
	win.addEventListener('touchmove', ontouchmove)
	win.addEventListener('touchend', setInactive)
	win.addEventListener('mousedown', onmousedown)
	win.addEventListener('mousemove', onmousemove)
	win.addEventListener('mouseup', setInactive)
	win.addEventListener('resize', onResize)
}