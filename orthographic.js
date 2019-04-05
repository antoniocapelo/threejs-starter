import {
  Scene,
  Mesh,
  OrthographicCamera,
  WebGLRenderer,
  PlaneBufferGeometry
} from "three";

import MagicShader from "magicshader";

/** Initial setup */
const renderer = new WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const camera = new OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  1000
);

window.camera = camera;
camera.position.z = 1;

const geometry = new PlaneBufferGeometry(window.innerWidth, window.innerHeight, 1);
const material = new MagicShader({
  name: "Simple Shader controls",
  vertexShader: `
      precision highp float;
      
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      attribute vec2 uv;
      varying vec2 vUv;
  
      uniform vec3 translate; // ms({ value: [0, 0, 0], step: 0.01 })
      uniform float scale; // ms({ value: 1.0, options: { small: 0.5, medium: 1, big: 2 } })
      uniform mat4 aMatrix4; // ms({ value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })
  
      void main() {
        vec3 pos = position + translate;
        pos *= scale;
        vUv = uv;
  
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
  fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      
      uniform vec3 myColor; // ms({ value: '#53b574' })
      uniform float brightness; // ms({ value: 0, range: [0, 0.5], step: 0.1 })
      uniform bool visible; // ms({ value: 1, name: 'Visibility' })
      uniform int test; // ms({ value: 0 })
  
      void main() {
          if (visible) {
            vec2 st = vUv;
            vec3 color = vec3(1.0);
        
            // bottom-left
            vec2 bl = step(vec2(0.1), st);
            float pct = bl.x * bl.y;
        
            // top-right
            vec2 tr = step(vec2(0.1),1.0-st);
            pct *= tr.x * tr.y;

            // defining color
            color = vec3(1. - pct) * (1.0 - myColor);
            color = vec3(1.) - color;
            gl_FragColor = vec4(color + brightness,1.0);
          } else {
            gl_FragColor = vec4(0.0);
          }
      }
    `
});

const mesh = new Mesh(geometry, material);
scene.add(mesh);
window.material = material;

window.addEventListener('resize', (e) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
