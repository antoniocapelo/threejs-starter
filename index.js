import {
  Scene,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  BoxBufferGeometry
} from "three";

import MagicShader from "magicshader";

/** Initial setup */
const renderer = new WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const camera = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
window.camera = camera;
camera.position.z = 1;

const geometry = new BoxBufferGeometry(1, 1, 1);
const material = new MagicShader({
  name: "Simple Shader controls",
  vertexShader: `
      precision highp float;
      
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
  
      uniform vec3 translate; // ms({ value: [0, 0, 0], step: 0.01 })
      uniform float scale; // ms({ value: 0.5, options: { small: 0.5, medium: 1, big: 2 } })
      uniform mat4 aMatrix4; // ms({ value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })
  
      void main() {
        vec3 pos = position + translate;
        pos *= scale;
  
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
  fragmentShader: `
      precision highp float;
      
      uniform vec3 color; // ms({ value: '#ff00f0' })
      uniform float brightness; // ms({ value: 0, range: [0, 0.5], step: 0.1 })
      uniform bool visible; // ms({ value: 1, name: 'Visibility' })
      uniform int test; // ms({ value: 0 })
  
      void main() {
          if (visible) {
            gl_FragColor = vec4(color + brightness, 1.0);
          } else {
            gl_FragColor = vec4(0.0);
          }
      }
    `
});

const mesh = new Mesh(geometry, material);
scene.add(mesh);

window.addEventListener('resize', function(e) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
