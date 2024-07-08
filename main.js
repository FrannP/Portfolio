import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let model; // Declare a variable to hold the model
let startTime; // Variable to track the start time
let isAnimating = false; // Variable to track if animation is active

const loader = new GLTFLoader();

// ADD CAMERA AND RENDERER
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x141414, 1);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -0.5, 1.65); // x, y, z

const controls = new OrbitControls(camera, renderer.domElement);

// WALL - shadow
const wallShadowGeometry = new THREE.PlaneGeometry(50, 50);
const wallShadowMaterial = new THREE.ShadowMaterial({ color: 0xffffff, opacity: 0.25 }); // White shadow color

const wallShadow = new THREE.Mesh(wallShadowGeometry, wallShadowMaterial);
wallShadow.position.z = -0.05;
wallShadow.receiveShadow = true;
scene.add(wallShadow);
//WALL - Panel
const wallGeometry = new THREE.PlaneGeometry(50, 50);
const wallMaterial = new THREE.MeshBasicMaterial({color: 0x2E2E2E, opacity: 1});

const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.z = -0.10;
wall.receiveShadow = true;
scene.add(wall);

// CUSTOM 3D MODEL
loader.load('./scene.glb', function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.rotation.set(0.35, 0, 0);

    model.traverse(function (node) {
        if (node.isMesh)
            node.castShadow = true;
    });
}, undefined, function (error) {
    console.error(error);
});

// LIGHT
const light = new THREE.PointLight(0x00000, 1);
light.intensity = 10;
light.position.set(0, 0.95, 0.25);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light);

const lightHelper = new THREE.PointLightHelper(light, 1);
//scene.add(lightHelper);

// BUTTON TO START ANIMATION
document.getElementById('startButton').addEventListener('click', () => {
    startTime = Date.now(); // Record the start time
    isAnimating = true; // Start the animation
});

// MOUSE MOVE EVENT
//document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) ;
    const mouseY = (event.clientY / window.innerHeight) - 5;

    camera.position.x = mouseX * 0.05; // Adjust multiplier to control sensitivity

    camera.position.z = 1.65
    camera.position.y = mouseY * 0.1; // Adjust multiplier to control sensitivity
    
    camera.lookAt(camera.position);
}


// ANIMATION
function animate() {
    if (isAnimating && model) {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const dampingFactor = 1 - (elapsedTime / 10);

        if (elapsedTime <= 10) {
            const sineValue = Math.sin(elapsedTime * Math.PI);
            model.rotation.z = sineValue * 0.15 * dampingFactor;
            model.position.x = sineValue * 0.15 * dampingFactor;
        } else {
            isAnimating = false;
        }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Start the animation loop
animate();
