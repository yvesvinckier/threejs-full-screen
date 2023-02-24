import * as THREE from "three";
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";

// Image
import ocean from "./img/jeremy-bishop-7KLUhedmR2c-unsplash.jpg";

export default class Sketch {
  constructor(options) {
    // Scene
    this.scene = new THREE.Scene();

    // Container
    this.container = options.dom;

    // Sizes
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    // Image aspect
    this.imageAspect = 2400 / 1800;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5, // bounds
      -10,
      10
    );
    this.camera.position.z = 2;

    // Time
    this.time = 0;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
  }

  addObjects() {
    // Geometry
    this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    // Material
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        uTexture: { value: new THREE.TextureLoader().load(ocean) },
        scale: { value: new THREE.Vector2(1, 1) },
      },
      // wireframe: true,
    });

    this.shaderScale = this.material.uniforms.scale.value;

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    // Update sizes
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    // Update camera
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.width, this.height);

    this.viewportAspect = this.width / this.height;

    // Fit image inside viewport
    if (this.imageAspect > this.viewportAspect) {
      this.shaderScale.set(this.imageAspect / this.viewportAspect, 1);
    } else {
      this.shaderScale.set(1, this.viewportAspect / this.imageAspect);
    }
  }

  render() {
    this.time += 0.001;
    this.renderer.render(this.scene, this.camera);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
}

new Sketch({
  dom: document.getElementById("container"),
});
