const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({ antialias: true})
var geometry = new THREE.BoxGeometry( 2, 2, 2)
var material = new THREE.MeshStandardMaterial( { color: 0x00cec9, flatShading: false, metalness: 0, roughness: 5 })
var cube = new THREE.Mesh ( geometry, material )
var controls;

renderer.setSize( window.innerWidth, window.innerHeight )

renderer.setClearColor("#00b894")
// renderer.setClearColor("#000000")
document.body.appendChild( renderer.domElement )
camera.position.z = 6
// drag controls
controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 5;
controls.zoomSpeed = 10;
controls.panSpeed = 10;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = false;
controls.dynamicDampingFactor = 1;

window.addEventListener( 'resize', () => {
	let width = window.innerWidth
	let height = window.innerHeight
	renderer.setSize( width, height )
	camera.aspect = width / height
	camera.updateProjectionMatrix()
})

// basic cube

scene.add( cube )

// ambient light
 var ambientLight = new THREE.AmbientLight ( 0xffffff, 1)
 ambientLight.position.set(20,20,20)
 scene.add( ambientLight )

// point light
var pointLight = new THREE.PointLight( 0xffffff, 2 );
pointLight.position.set( 50, 50, 50 );
scene.add( pointLight );


let peepee = 0;

function animate() {
	pointLight.position.z = peepee;
	if(peepee >= 500) { peepee = 0 }
	else { peepee += 1 }
	renderer.render( scene, camera )
	controls.update();
	requestAnimationFrame( animate )
}
animate()