import './style.css'

import * as THREE from 'three';

import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D } from 'three';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);


const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);


// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 10);
// scene.add(lightHelper, gridHelper);


const controls = new OrbitControls(camera, renderer.domElement);


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(geometry, material);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );
  sphere.position.set(x, y, z);
  scene.add(sphere);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('./space.jpg');
scene.background = spaceTexture;


const loader = new GLTFLoader();
let moon;
let earth;
let sun;
let mars;

const marsLockGeo = new THREE.SphereGeometry(0.5, 10, 10);
const marsLockMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const marsLock = new THREE.Mesh(marsLockGeo, marsLockMat);
scene.add(marsLock);

const earthLockGeo = new THREE.SphereGeometry(0.5, 15, 15);
const earthLockMatr = new THREE.MeshStandardMaterial({ color: 0xffff11 });
const earthLock = new THREE.Mesh(earthLockGeo, earthLockMatr);
scene.add(earthLock);

const moonLockGeo = new THREE.SphereGeometry(0.5, 10, 10);
const moonLockMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const moonLock = new THREE.Mesh(moonLockGeo, moonLockMat);
scene.add(moonLock);

loader.load ('./objects/mars.glb', function (gltf) {
  mars = gltf.scene;
  mars.position.setX(25);
  marsLock.add(mars);
}, undefined, function ( error ) {
  console.error( error );
});

loader.load ('./objects/moon.glb', function (gltf) {
  moon = gltf.scene;
  moonLock.add(moon);
}, undefined, function ( error ) {
  console.error( error );
});

loader.load ('./objects/earth.glb', function (gltf) {
  earth = gltf.scene;
  earth.add(moonLock);
  earthLock.add(earth)
  earth.position.setX(20);
}, undefined, function ( error ) {
  console.error( error );
});

loader.load ('./objects/sun.glb', function (gltf) {
  sun = gltf.scene;
  scene.add(sun);
  // sun.add(earthLock);
}, undefined, function ( error ) {
  console.error( error );
});

var quaternion = new THREE.Quaternion();
var object = moon;
// quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ).normalize(), 0.005 );
// object.position.applyQuaternion( quaternion );
// renderer.render(scene, camera);

let isPlay = true;

document.addEventListener("keydown", (event) => {
  const keyName = event.key;

  if (keyName === "p") {
    isPlay = !isPlay;
  }
  else {
    return;
  }
  animate();
});

function animate() {
  if (!isPlay) return;

  requestAnimationFrame(animate);
  
  
  earthLock.rotation.y += .003;
  moonLock.rotation.y += .01;
  marsLock.rotation.y += .001;
  sun.rotation.y += .004;

  controls.update();

  renderer.render(scene, camera);
}

animate();