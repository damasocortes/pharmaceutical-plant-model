/**
 * ui.js
 * Gestión de la interfaz de usuario
 */

export class UIManager {
  constructor(plantModel, flowSystem, areas) {
    this.plantModel = plantModel;
    this.flowSystem = flowSystem;
    this.areas = areas;
    this.tourIndex = 0;
    this.tourActive = false;
    
    this.initializeUI();
    this.attachEventListeners();
  }

  /**
   * Inicializa elementos de la UI
   */
  initializeUI() {
    // Panel de información
    this.infoPanel = document.getElementById('info-panel');
    
    // Botones de flujo
    this.flowButtons = {
      personal: document.getElementById('btn-flow-personal'),
      materiales: document.getElementById('btn-flow-materiales'),
      producto: document.getElementById('btn-flow-producto'),
      residuos: document.getElementById('btn-flow-residuos')
    };

    // Panel de tour
    this.tourPanel = document.getElementById('tour-panel');
    
    // Overlay de ayuda
    this.helpOverlay = document.getElementById('help-overlay');
  }

  /**
   * Adjunta event listeners a los elementos UI
   */
  attachEventListeners() {
    // Botones de flujo
    Object.keys(this.flowButtons).forEach(flowId => {
      const button = this.flowButtons[flowId];
      if (button) {
        button.addEventListener('click', () => this.toggleFlow(flowId));
      }
    });

    // Botón de limpiar flujos
    const clearFlowsBtn = document.getElementById('btn-clear-flows');
    if (clearFlowsBtn) {
      clearFlowsBtn.addEventListener('click', () => this.clearAllFlows());
    }

    // Botón de mostrar/ocultar etiquetas
    const toggleLabelsBtn = document.getElementById('btn-toggle-labels');
    if (toggleLabelsBtn) {
      let labelsVisible = true;
      toggleLabelsBtn.addEventListener('click', () => {
        labelsVisible = !labelsVisible;
        this.plantModel.toggleLabels(labelsVisible);
        toggleLabelsBtn.textContent = labelsVisible ? '🏷️ Ocultar Etiquetas' : '🏷️ Mostrar Etiquetas';
      });
    }

    // Botón de tour
    const tourBtn = document.getElementById('btn-tour');
    if (tourBtn) {
      tourBtn.addEventListener('click', () => this.startTour());
    }

    // Botones de navegación del tour
    const tourNextBtn = document.getElementById('tour-next');
    const tourPrevBtn = document.getElementById('tour-prev');
    const tourCloseBtn = document.getElementById('tour-close');

    if (tourNextBtn) {
      tourNextBtn.addEventListener('click', () => this.nextTourStep());
    }
    if (tourPrevBtn) {
      tourPrevBtn.addEventListener('click', () => this.prevTourStep());
    }
    if (tourCloseBtn) {
      tourCloseBtn.addEventListener('click', () => this.endTour());
    }

    // Botón de ayuda
    const helpBtn = document.getElementById('btn-help');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => this.toggleHelp());
    }

    // Cerrar panel de información
    const closeInfoBtn = document.querySelector('#info-panel .close-btn');
    if (closeInfoBtn) {
      closeInfoBtn.addEventListener('click', () => this.hideInfoPanel());
    }

    // Cerrar overlay de ayuda
    const closeHelpBtn = document.querySelector('#help-overlay .close-btn');
    if (closeHelpBtn) {
      closeHelpBtn.addEventListener('click', () => this.toggleHelp());
    }
  }

  /**
   * Muestra información de un área
   */
  showAreaInfo(area) {
    if (!area) return;

    this.infoPanel.classList.add('show');
    
    const content = `
      <button class="close-btn">×</button>
      <h2>${area.nombre}</h2>
      
      <div class="info-section">
        <h3>Clasificación</h3>
        <span class="classification-badge ${this.getClassificationClass(area.clasificacion)}">
          ${area.clasificacion}
        </span>
      </div>
      
      <div class="info-section">
        <h3>Función</h3>
        <p>${area.funcion}</p>
      </div>
      
      <div class="info-section">
        <h3>Dimensiones</h3>
        <p>Largo: ${area.dimensiones.largo}m × Ancho: ${area.dimensiones.ancho}m × Alto: ${area.dimensiones.alto}m</p>
        <p>Superficie: ${(area.dimensiones.largo * area.dimensiones.ancho).toFixed(1)} m²</p>
      </div>
      
      <div class="info-section">
        <h3>Equipamiento Principal</h3>
        <ul>
          ${area.equipamiento.map(eq => `<li>${eq}</li>`).join('')}
        </ul>
      </div>
      
      <div class="info-section">
        <h3>Sistema HVAC</h3>
        <p>${area.hvac}</p>
      </div>
      
      <div class="info-section">
        <h3>Cumplimiento Normativo</h3>
        <p><strong>${area.norma}</strong></p>
      </div>
    `;
    
    this.infoPanel.innerHTML = content;
    
    // Re-adjuntar event listener al botón de cerrar
    const closeBtn = this.infoPanel.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideInfoPanel());
    }
  }

  /**
   * Oculta el panel de información
   */
  hideInfoPanel() {
    this.infoPanel.classList.remove('show');
    this.plantModel.clearHighlights();
  }

  /**
   * Obtiene la clase CSS para la clasificación
   */
  getClassificationClass(clasificacion) {
    const cleanClass = clasificacion.toLowerCase()
      .replace('zona ', '')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Eliminar acentos
    return cleanClass;
  }

  /**
   * Activa/desactiva un flujo
   */
  toggleFlow(flowId) {
    this.flowSystem.toggleFlow(flowId);
    const button = this.flowButtons[flowId];
    
    if (this.flowSystem.isFlowActive(flowId)) {
      button.classList.add('active');
      this.showFlowInfo(flowId);
    } else {
      button.classList.remove('active');
    }
  }

  /**
   * Limpia todos los flujos
   */
  clearAllFlows() {
    this.flowSystem.clearAllFlows();
    Object.values(this.flowButtons).forEach(button => {
      button.classList.remove('active');
    });
    this.hideInfoPanel();
  }

  /**
   * Muestra información de un flujo
   */
  showFlowInfo(flowId) {
    const flowInfo = this.flowSystem.getFlowInfo(flowId);
    if (!flowInfo) return;

    this.infoPanel.classList.add('show');
    
    const content = `
      <button class="close-btn">×</button>
      <h2>${flowInfo.nombre}</h2>
      
      <div class="info-section">
        <h3>Descripción</h3>
        <p>${flowInfo.descripcion}</p>
      </div>
      
      <div class="info-section">
        <h3>Puntos Clave</h3>
        <ul>
          ${flowInfo.puntosClave.map(punto => `<li>${punto}</li>`).join('')}
        </ul>
      </div>
    `;
    
    this.infoPanel.innerHTML = content;
    
    // Re-adjuntar event listener
    const closeBtn = this.infoPanel.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideInfoPanel();
        this.clearAllFlows();
      });
    }
  }

  /**
   * Inicia el tour educativo
   */
  startTour() {
    this.tourActive = true;
    this.tourIndex = 0;
    this.clearAllFlows();
    this.showTourStep();
  }

  /**
   * Muestra el paso actual del tour
   */
  showTourStep() {
    if (!this.tourActive || this.tourIndex >= this.areas.length) {
      this.endTour();
      return;
    }

    const area = this.areas[this.tourIndex];
    this.plantModel.highlightArea(area.id);
    this.tourPanel.classList.add('show');

    const content = `
      <h3>Paso ${this.tourIndex + 1} de ${this.areas.length}: ${area.nombre}</h3>
      <p>${area.funcion}</p>
      <p><strong>Clasificación:</strong> ${area.clasificacion}</p>
      <div class="tour-controls">
        <button id="tour-prev" ${this.tourIndex === 0 ? 'disabled' : ''}>⬅️ Anterior</button>
        <button id="tour-close">Finalizar Tour</button>
        <button id="tour-next">${this.tourIndex === this.areas.length - 1 ? 'Finalizar' : 'Siguiente ➡️'}</button>
      </div>
    `;

    this.tourPanel.innerHTML = content;

    // Re-adjuntar event listeners
    document.getElementById('tour-next')?.addEventListener('click', () => this.nextTourStep());
    document.getElementById('tour-prev')?.addEventListener('click', () => this.prevTourStep());
    document.getElementById('tour-close')?.addEventListener('click', () => this.endTour());
  }

  /**
   * Siguiente paso del tour
   */
  nextTourStep() {
    this.tourIndex++;
    this.showTourStep();
  }

  /**
   * Paso anterior del tour
   */
  prevTourStep() {
    if (this.tourIndex > 0) {
      this.tourIndex--;
      this.showTourStep();
    }
  }

  /**
   * Finaliza el tour
   */
  endTour() {
    this.tourActive = false;
    this.tourPanel.classList.remove('show');
    this.plantModel.clearHighlights();
  }

  /**
   * Muestra/oculta el overlay de ayuda
   */
  toggleHelp() {
    this.helpOverlay.classList.toggle('show');
  }

  /**
   * Cierra el overlay de ayuda si está abierto
   */
  closeHelp() {
    this.helpOverlay.classList.remove('show');
  }

  /**
   * Actualiza el estado de carga
   */
  updateLoadingState(isLoading) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      if (isLoading) {
        loadingElement.classList.remove('hidden');
      } else {
        loadingElement.classList.add('hidden');
      }
    }
  }
}
