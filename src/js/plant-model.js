/**
 * plant-model.js
 * Módulo para la creación del modelo 3D de la planta farmacéutica
 */

import * as THREE from 'three';

/**
 * Clase para gestionar el modelo 3D de la planta
 */
export class PlantModel {
  constructor(scene, areas) {
    this.scene = scene;
    this.areas = areas;
    this.areaObjects = new Map(); // Mapa de objetos 3D por ID de área
    this.labelSprites = new Map(); // Sprites de etiquetas
  }

  /**
   * Construye el modelo 3D completo
   */
  build() {
    // Agregar piso
    this.addFloor();
    
    // Agregar áreas
    this.areas.forEach(area => {
      this.addArea(area);
    });
    
    // Agregar paredes exteriores
    this.addExteriorWalls();
    
    // Agregar iluminación ambiental mejorada
    this.addLighting();
  }

  /**
   * Agrega el piso de la planta
   */
  addFloor() {
    const floorGeometry = new THREE.PlaneGeometry(100, 80);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = -0.1;
    this.scene.add(floor);

    // Agregar líneas de cuadrícula
    const gridHelper = new THREE.GridHelper(100, 50, 0xcccccc, 0xe0e0e0);
    gridHelper.position.y = 0;
    this.scene.add(gridHelper);
  }

  /**
   * Agrega un área individual al modelo
   */
  addArea(area) {
    const { largo, ancho, alto } = area.dimensiones;
    const { x, y, z } = area.posicion;

    // Crear grupo para el área
    const areaGroup = new THREE.Group();
    areaGroup.userData = { areaId: area.id, areaData: area };

    // Geometría del área (caja)
    const geometry = new THREE.BoxGeometry(largo, alto, ancho);
    
    // Material con color específico del área
    const material = new THREE.MeshStandardMaterial({
      color: area.color,
      transparent: true,
      opacity: 0.7,
      roughness: 0.5,
      metalness: 0.1
    });

    const areaMesh = new THREE.Mesh(geometry, material);
    areaMesh.position.set(x, alto / 2, z);
    areaMesh.castShadow = true;
    areaMesh.receiveShadow = true;
    
    // Agregar borde para destacar el área
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x333333, 
      linewidth: 2 
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    wireframe.position.copy(areaMesh.position);
    
    areaGroup.add(areaMesh);
    areaGroup.add(wireframe);

    // Agregar etiqueta
    this.addLabel(area, x, alto + 0.5, z);

    // Guardar referencia
    this.areaObjects.set(area.id, areaGroup);
    this.scene.add(areaGroup);
  }

  /**
   * Agrega una etiqueta de texto para un área
   */
  addLabel(area, x, y, z) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    // Fondo
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Borde
    context.strokeStyle = area.color;
    context.lineWidth = 8;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Texto
    context.fillStyle = '#2c3e50';
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Nombre del área (posiblemente en múltiples líneas)
    const words = area.nombre.split(' ');
    let line = '';
    let lines = [];
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      const metrics = context.measureText(testLine);
      if (metrics.width > canvas.width - 40 && line !== '') {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    lines.push(line);

    const lineHeight = 40;
    const startY = (canvas.height - (lines.length * lineHeight)) / 2 + lineHeight / 2;
    
    lines.forEach((line, i) => {
      context.fillText(line.trim(), canvas.width / 2, startY + i * lineHeight);
    });

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    sprite.scale.set(8, 2, 1);

    this.labelSprites.set(area.id, sprite);
    this.scene.add(sprite);
  }

  /**
   * Agrega paredes exteriores de la planta
   */
  addExteriorWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xd0d0d0,
      roughness: 0.7,
      metalness: 0.1
    });

    const wallHeight = 5;
    const wallThickness = 0.3;

    // Pared frontal (sur)
    const frontWall = new THREE.Mesh(
      new THREE.BoxGeometry(100, wallHeight, wallThickness),
      wallMaterial
    );
    frontWall.position.set(0, wallHeight / 2, -40);
    frontWall.castShadow = true;
    this.scene.add(frontWall);

    // Pared trasera (norte)
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(100, wallHeight, wallThickness),
      wallMaterial
    );
    backWall.position.set(0, wallHeight / 2, 40);
    backWall.castShadow = true;
    this.scene.add(backWall);

    // Pared izquierda (oeste)
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, 80),
      wallMaterial
    );
    leftWall.position.set(-50, wallHeight / 2, 0);
    leftWall.castShadow = true;
    this.scene.add(leftWall);

    // Pared derecha (este)
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, 80),
      wallMaterial
    );
    rightWall.position.set(50, wallHeight / 2, 0);
    rightWall.castShadow = true;
    this.scene.add(rightWall);
  }

  /**
   * Agrega iluminación a la escena
   */
  addLighting() {
    // Luz ambiental suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Luz direccional principal
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(30, 50, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -60;
    directionalLight.shadow.camera.right = 60;
    directionalLight.shadow.camera.top = 60;
    directionalLight.shadow.camera.bottom = -60;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Luz de relleno
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-30, 30, -30);
    this.scene.add(fillLight);
  }

  /**
   * Resalta un área específica
   */
  highlightArea(areaId) {
    this.clearHighlights();
    
    const areaGroup = this.areaObjects.get(areaId);
    if (areaGroup) {
      const mesh = areaGroup.children.find(child => child instanceof THREE.Mesh);
      if (mesh) {
        mesh.material.emissive = new THREE.Color(0x4444ff);
        mesh.material.emissiveIntensity = 0.3;
      }
    }
  }

  /**
   * Limpia todos los resaltados
   */
  clearHighlights() {
    this.areaObjects.forEach(areaGroup => {
      const mesh = areaGroup.children.find(child => child instanceof THREE.Mesh);
      if (mesh) {
        mesh.material.emissive = new THREE.Color(0x000000);
        mesh.material.emissiveIntensity = 0;
      }
    });
  }

  /**
   * Obtiene el área en una posición específica (raycast)
   */
  getAreaAtPosition(raycaster, camera, mouse) {
    raycaster.setFromCamera(mouse, camera);
    
    const meshes = [];
    this.areaObjects.forEach(group => {
      const mesh = group.children.find(child => child instanceof THREE.Mesh);
      if (mesh) meshes.push(mesh);
    });

    const intersects = raycaster.intersectObjects(meshes);
    
    if (intersects.length > 0) {
      const parent = intersects[0].object.parent;
      return parent.userData.areaData;
    }
    
    return null;
  }

  /**
   * Muestra u oculta etiquetas
   */
  toggleLabels(show) {
    this.labelSprites.forEach(sprite => {
      sprite.visible = show;
    });
  }
}
