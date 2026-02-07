/**
 * main.js
 * Aplicación principal del modelo 3D de planta farmacéutica
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PlantModel } from './plant-model.js';
import { FlowSystem } from './flows.js';
import { UIManager } from './ui.js';

/**
 * Clase principal de la aplicación
 */
class PharmaceuticalPlantApp {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.plantModel = null;
    this.flowSystem = null;
    this.uiManager = null;
    this.areas = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    
    this.init();
  }

  /**
   * Inicializa la aplicación
   */
  async init() {
    try {
      // Cargar datos
      await this.loadData();
      
      // Configurar Three.js
      this.setupThreeJS();
      
      // Crear modelo de planta
      this.plantModel = new PlantModel(this.scene, this.areas);
      this.plantModel.build();
      
      // Crear sistema de flujos
      this.flowSystem = new FlowSystem(this.scene);
      
      // Configurar UI
      this.uiManager = new UIManager(this.plantModel, this.flowSystem, this.areas);
      
      // Event listeners
      this.attachEventListeners();
      
      // Iniciar animación
      this.animate();
      
      // Ocultar pantalla de carga
      this.uiManager.updateLoadingState(false);
      
      console.log('Aplicación iniciada correctamente');
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
    }
  }

  /**
   * Carga los datos de áreas
   */
  async loadData() {
    try {
      const response = await fetch('./src/data/areas.json');
      const data = await response.json();
      this.areas = data.areas;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Datos de respaldo en caso de error
      this.areas = [];
    }
  }

  /**
   * Configura Three.js (escena, cámara, renderer)
   */
  setupThreeJS() {
    // Crear escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.scene.fog = new THREE.Fog(0xf0f0f0, 80, 150);

    // Crear cámara
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(40, 40, 40);
    this.camera.lookAt(0, 0, 0);

    // Crear renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Controles de órbita
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 120;
    this.controls.maxPolarAngle = Math.PI / 2.1;
  }

  /**
   * Adjunta event listeners
   */
  attachEventListeners() {
    // Resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Click en áreas
    this.renderer.domElement.addEventListener('click', (event) => this.onClick(event));
    
    // Mouse move para highlight
    this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));

    // Botones de vista
    const topViewBtn = document.getElementById('btn-top-view');
    const isoViewBtn = document.getElementById('btn-iso-view');
    const frontViewBtn = document.getElementById('btn-front-view');
    const sideViewBtn = document.getElementById('btn-side-view');

    if (topViewBtn) {
      topViewBtn.addEventListener('click', () => this.setTopView());
    }
    if (isoViewBtn) {
      isoViewBtn.addEventListener('click', () => this.setIsometricView());
    }
    if (frontViewBtn) {
      frontViewBtn.addEventListener('click', () => this.setFrontView());
    }
    if (sideViewBtn) {
      sideViewBtn.addEventListener('click', () => this.setSideView());
    }

    // Controles de teclado
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  /**
   * Maneja el evento de click
   */
  onClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const area = this.plantModel.getAreaAtPosition(this.raycaster, this.camera, this.mouse);
    
    if (area) {
      this.uiManager.showAreaInfo(area);
      this.plantModel.highlightArea(area.id);
    }
  }

  /**
   * Maneja el movimiento del mouse
   */
  onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  /**
   * Maneja teclas presionadas
   */
  onKeyDown(event) {
    switch(event.key) {
      case 'Escape':
        this.uiManager.hideInfoPanel();
        this.uiManager.toggleHelp(); // Cerrar ayuda si está abierta
        break;
      case '1':
        this.uiManager.toggleFlow('personal');
        break;
      case '2':
        this.uiManager.toggleFlow('materiales');
        break;
      case '3':
        this.uiManager.toggleFlow('producto');
        break;
      case '4':
        this.uiManager.toggleFlow('residuos');
        break;
      case 'h':
      case 'H':
        this.uiManager.toggleHelp();
        break;
      case 't':
      case 'T':
        this.setTopView();
        break;
      case 'i':
      case 'I':
        this.setIsometricView();
        break;
    }
  }

  /**
   * Maneja el redimensionamiento de la ventana
   */
  onWindowResize() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Vista superior (plano)
   */
  setTopView() {
    this.animateCamera(
      new THREE.Vector3(0, 80, 0),
      new THREE.Vector3(0, 0, 0)
    );
  }

  /**
   * Vista isométrica
   */
  setIsometricView() {
    this.animateCamera(
      new THREE.Vector3(40, 40, 40),
      new THREE.Vector3(0, 0, 0)
    );
  }

  /**
   * Vista frontal
   */
  setFrontView() {
    this.animateCamera(
      new THREE.Vector3(0, 20, 60),
      new THREE.Vector3(0, 0, 0)
    );
  }

  /**
   * Vista lateral
   */
  setSideView() {
    this.animateCamera(
      new THREE.Vector3(60, 20, 0),
      new THREE.Vector3(0, 0, 0)
    );
  }

  /**
   * Anima la cámara a una nueva posición
   */
  animateCamera(targetPosition, targetLookAt) {
    const startPosition = this.camera.position.clone();
    const startLookAt = this.controls.target.clone();
    const duration = 1000; // ms
    const startTime = Date.now();

    const animateStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeInOutCubic(progress);

      this.camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
      this.controls.target.lerpVectors(startLookAt, targetLookAt, easeProgress);
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(animateStep);
      }
    };

    animateStep();
  }

  /**
   * Función de easing
   */
  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Loop de animación
   */
  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();
    
    // Actualizar controles
    this.controls.update();
    
    // Animar flujos
    if (this.flowSystem) {
      this.flowSystem.animate(deltaTime);
    }
    
    // Renderizar
    this.renderer.render(this.scene, this.camera);
  }
}

// Iniciar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PharmaceuticalPlantApp();
  });
} else {
  new PharmaceuticalPlantApp();
}
