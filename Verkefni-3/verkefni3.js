const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({ antialias: true})
var controls;

renderer.setSize( window.innerWidth, window.innerHeight )

renderer.setClearColor("#00b894")
document.body.appendChild( renderer.domElement )
camera.position.z = 6
// drag controls
controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 5;
controls.zoomSpeed = 10;
controls.panSpeed = 10;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 1;

window.addEventListener( 'resize', () => {
	let width = window.innerWidth
	let height = window.innerHeight
	renderer.setSize( width, height )
	camera.aspect = width / height
	camera.updateProjectionMatrix()
})

// basic cube
var geometry = new THREE.BoxGeometry( 1, 3, 1)
var material = new THREE.MeshStandardMaterial( { color: 0x636e72, flatShading: true, metalness: 0, roughness: 1 })
var cube = new THREE.Mesh ( geometry, material )
scene.add( cube )

// ambient light
var ambientLight = new THREE.AmbientLight ( 0xf12300ff, 2)
scene.add( ambientLight )

// point light
var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 25, 50, 25 );
scene.add( pointLight );




function animate() {
	requestAnimationFrame( animate )
	renderer.render( scene, camera )
	controls.update();
}
animate()