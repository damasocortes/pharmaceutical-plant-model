/**
 * flows.js
 * Sistema de visualización de flujos (personal, materiales, producto, residuos)
 */

import * as THREE from 'three';

/**
 * Clase para gestionar los flujos de la planta
 */
export class FlowSystem {
  constructor(scene) {
    this.scene = scene;
    this.flows = new Map();
    this.activeFlows = new Set();
    this.animationTime = 0;
    
    this.initializeFlows();
  }

  /**
   * Inicializa las definiciones de flujos
   */
  initializeFlows() {
    // Flujo de personal
    this.defineFlow('personal', {
      color: 0x3498db,
      paths: [
        // Entrada → Vestidores → Área de producción
        { start: { x: -30, z: -10 }, end: { x: -15, z: 5 } },
        { start: { x: -15, z: 5 }, end: { x: -5, z: 5 } },
        { start: { x: -5, z: 5 }, end: { x: 5, z: 5 } },
        { start: { x: 5, z: 5 }, end: { x: 18, z: 5 } },
        // Acceso a control de calidad
        { start: { x: 18, z: 5 }, end: { x: 5, z: -15 } },
        // Acceso a envasado
        { start: { x: 18, z: 5 }, end: { x: 30, z: 5 } }
      ]
    });

    // Flujo de materiales
    this.defineFlow('materiales', {
      color: 0xe67e22,
      paths: [
        // Recepción → Cuarentena → Almacén
        { start: { x: -30, z: 20 }, end: { x: -30, z: 5 } },
        // Almacén → Pesado
        { start: { x: -30, z: 5 }, end: { x: -15, z: 5 } },
        // Pesado → Mezclado
        { start: { x: -15, z: 5 }, end: { x: -5, z: 5 } },
        // Mezclado → Granulación
        { start: { x: -5, z: 5 }, end: { x: 5, z: 5 } },
        // Granulación → Compresión
        { start: { x: 5, z: 5 }, end: { x: 18, z: 5 } },
        // Compresión → Recubrimiento
        { start: { x: 18, z: 5 }, end: { x: 18, z: -8 } }
      ]
    });

    // Flujo de producto terminado
    this.defineFlow('producto', {
      color: 0x27ae60,
      paths: [
        // Recubrimiento → Control de calidad
        { start: { x: 18, z: -8 }, end: { x: 5, z: -15 } },
        // Control de calidad → Envasado
        { start: { x: 5, z: -15 }, end: { x: 30, z: 5 } },
        // Envasado → Almacén PT
        { start: { x: 30, z: 5 }, end: { x: 30, z: 20 } }
      ]
    });

    // Flujo de residuos
    this.defineFlow('residuos', {
      color: 0xe74c3c,
      paths: [
        // Desde áreas de producción hacia área de lavado
        { start: { x: -5, z: 5 }, end: { x: -15, z: -15 } },
        { start: { x: 5, z: 5 }, end: { x: -15, z: -15 } },
        { start: { x: 18, z: 5 }, end: { x: -15, z: -15 } },
        // Desde envasado
        { start: { x: 30, z: 5 }, end: { x: -15, z: -15 } }
      ]
    });
  }

  /**
   * Define un flujo con sus rutas
   */
  defineFlow(id, config) {
    const flowGroup = new THREE.Group();
    flowGroup.visible = false;

    config.paths.forEach((path, index) => {
      const arrow = this.createFlowArrow(
        path.start,
        path.end,
        config.color
      );
      flowGroup.add(arrow);
    });

    this.flows.set(id, flowGroup);
    this.scene.add(flowGroup);
  }

  /**
   * Crea una flecha de flujo entre dos puntos
   */
  createFlowArrow(start, end, color) {
    const group = new THREE.Group();

    // Calcular dirección y distancia
    const startVec = new THREE.Vector3(start.x, 0.5, start.z);
    const endVec = new THREE.Vector3(end.x, 0.5, end.z);
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const distance = direction.length();

    // Crear línea
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      startVec,
      endVec
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: color,
      linewidth: 3
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(line);

    // Crear flechas a lo largo del camino
    const numArrows = Math.max(2, Math.floor(distance / 5));
    for (let i = 1; i <= numArrows; i++) {
      const t = i / (numArrows + 1);
      const pos = new THREE.Vector3().lerpVectors(startVec, endVec, t);
      
      const arrowHelper = new THREE.ArrowHelper(
        direction.clone().normalize(),
        pos,
        2,
        color,
        0.8,
        0.6
      );
      arrowHelper.userData.animationOffset = t;
      group.add(arrowHelper);
    }

    return group;
  }

  /**
   * Activa o desactiva un flujo
   */
  toggleFlow(flowId) {
    const flow = this.flows.get(flowId);
    if (!flow) return;

    if (this.activeFlows.has(flowId)) {
      this.activeFlows.delete(flowId);
      flow.visible = false;
    } else {
      this.activeFlows.add(flowId);
      flow.visible = true;
    }
  }

  /**
   * Desactiva todos los flujos
   */
  clearAllFlows() {
    this.activeFlows.clear();
    this.flows.forEach(flow => {
      flow.visible = false;
    });
  }

  /**
   * Activa un flujo específico y desactiva los demás
   */
  showOnlyFlow(flowId) {
    this.clearAllFlows();
    this.toggleFlow(flowId);
  }

  /**
   * Anima los flujos activos
   */
  animate(deltaTime) {
    this.animationTime += deltaTime;

    this.activeFlows.forEach(flowId => {
      const flow = this.flows.get(flowId);
      if (!flow) return;

      flow.children.forEach(pathGroup => {
        pathGroup.children.forEach(child => {
          if (child instanceof THREE.ArrowHelper) {
            // Animación de pulsación
            const offset = child.userData.animationOffset || 0;
            const scale = 1 + 0.2 * Math.sin(this.animationTime * 3 + offset * Math.PI * 2);
            child.cone.scale.set(scale, scale, scale);
            child.line.scale.y = scale;
          }
        });
      });
    });
  }

  /**
   * Verifica si un flujo está activo
   */
  isFlowActive(flowId) {
    return this.activeFlows.has(flowId);
  }

  /**
   * Obtiene información de un flujo
   */
  getFlowInfo(flowId) {
    const flowDescriptions = {
      'personal': {
        nombre: 'Flujo de Personal',
        descripcion: 'Ruta del personal desde la entrada, pasando por vestidores con esclusa de aire, hacia las áreas de producción controladas.',
        puntosClave: [
          'Entrada por vestidores (zona negra/gris)',
          'Cambio de ropa de calle a uniforme limpio',
          'Acceso a áreas blancas mediante esclusas',
          'Circulación unidireccional en zonas críticas',
          'Salida por la misma ruta con procedimientos de higiene'
        ]
      },
      'materiales': {
        nombre: 'Flujo de Materiales',
        descripcion: 'Recorrido de materias primas desde su recepción hasta su transformación en producto intermedio.',
        puntosClave: [
          'Recepción y verificación documental',
          'Cuarentena hasta liberación por QC',
          'Almacenamiento en condiciones controladas',
          'Transferencia a producción mediante sistema FIFO',
          'Pesado exacto según fórmula maestra',
          'Procesamiento secuencial: mezclado → granulación → compresión'
        ]
      },
      'producto': {
        nombre: 'Flujo de Producto Terminado',
        descripcion: 'Trayectoria del producto desde su fabricación hasta su almacenamiento final.',
        puntosClave: [
          'Control de calidad en proceso',
          'Recubrimiento de tabletas (si aplica)',
          'Análisis y liberación por laboratorio QC',
          'Envasado primario y secundario',
          'Etiquetado con lote y caducidad',
          'Almacenamiento de producto terminado liberado'
        ]
      },
      'residuos': {
        nombre: 'Flujo de Residuos',
        descripcion: 'Sistema de evacuación de residuos sin contaminación cruzada.',
        puntosClave: [
          'Recolección en puntos designados',
          'Segregación por tipo de residuo',
          'Contenedores específicos identificados',
          'Rutas independientes del flujo de materiales',
          'Transferencia a área de lavado o disposición',
          'Prevención de retorno a áreas limpias'
        ]
      }
    };

    return flowDescriptions[flowId] || null;
  }
}
