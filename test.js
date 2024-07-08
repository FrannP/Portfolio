import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

 // Scene setup
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
 const renderer = new THREE.WebGLRenderer();
 renderer.setSize(window.innerWidth, window.innerHeight);
 renderer.setClearColor(0x141414, 1);
 document.body.appendChild(renderer.domElement);

 const controls = new OrbitControls(camera, renderer.domElement);

 // Enable shadows
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = THREE.PCFSoftShadowMap;

 // Sphere
 const geometry = new THREE.SphereGeometry(2, 32, 32);
 const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
 const sphere = new THREE.Mesh(geometry, material);
 sphere.castShadow = true; // Sphere casts shadow
 scene.add(sphere);

 // Plane
 const planeGeometry = new THREE.PlaneGeometry(50, 50);
 const planeColor = new THREE.MeshStandardMaterial({ color: 0x141414});
 const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.25 });
 
 const plane = new THREE.Mesh(planeGeometry, planeColor, planeMaterial, );
 plane.receiveShadow = true;
 plane.rotation.x = -Math.PI / 2;
 plane.position.y = -1.5; // Slightly above the shadow plane to avoid z-fighting
 scene.add(plane);

 // Light
 const light = new THREE.DirectionalLight(0xa2eff9, 1);
 light.intensity = 10;
 light.position.set(10, 10, 5);
 light.castShadow = true; // Light casts shadow
 light.shadow.mapSize.width = 1024; // Shadow map resolution
 light.shadow.mapSize.height = 1024;
 //scene.add(light);

 const lightHelper = new THREE.PointLightHelper(light, 1);
 scene.add(lightHelper);

 // Camera position
 camera.position.z = 5;

 let startTime = Date.now();

 // Animation loop
 function animate() {
     requestAnimationFrame(animate);

     const elapsedTime = (Date.now() - startTime) / 1000; // Calculate the elapsed time in seconds
     const sineValue = Math.sin(elapsedTime * Math.PI);

     sphere.position.y += sineValue * 0.05; // Rotate sphere for effect
     light.position.x = sineValue * 1
     renderer.render(scene, camera);



     console.log(startTime)
 }
 animate();

 // Handle window resize
 window.addEventListener('resize', () => {
     const width = window.innerWidth;
     const height = window.innerHeight;
     renderer.setSize(width, height);
     camera.aspect = width / height;
     camera.updateProjectionMatrix();
 });