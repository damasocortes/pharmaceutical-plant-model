# Modelo Digital de Planta Farmacéutica - Producción de Tabletas

## 📋 Descripción del Proyecto

Modelo digital interactivo 3D de una planta farmacéutica dedicada a la fabricación de **tabletas**, diseñado conforme a la **NOM-059-SSA1-2015** (Buenas Prácticas de Fabricación de Medicamentos) y los principios de diseño de plantas farmacéuticas de Aulton.

## 🎯 Propósito

Integrar los principios del diseño de plantas farmacéuticas con las Buenas Prácticas de Fabricación (BPF), comprendiendo la relación entre infraestructura, flujo de procesos, control sanitario y calidad del medicamento.

## 🏭 Características Principales

### Modelo 3D Interactivo
- ✅ Visualización 3D con navegación 360°
- ✅ 13 áreas diferentes identificadas y etiquetadas
- ✅ Código de colores según clasificación BPF
- ✅ Representación de paredes, puertas y estructura
- ✅ Iluminación realista con sombras

### Áreas Incluidas
1. ✅ Área de recepción y cuarentena de materias primas
2. ✅ Almacén de materias primas
3. ✅ Área de producción de tabletas:
   - Zona de pesado
   - Zona de mezclado
   - Zona de granulación
   - Zona de compresión
   - Zona de recubrimiento
4. ✅ Área de control de calidad (laboratorio)
5. ✅ Área de envasado y acondicionamiento
6. ✅ Almacén de producto terminado
7. ✅ Áreas de servicios:
   - Vestidores
   - Sanitarios
   - Área de lavado de equipos

### Flujos Visualizados
- 🚶 **Flujo de personal** con esclusas de acceso
- 📦 **Flujo de materiales** desde recepción hasta producción
- 💊 **Flujo de producto terminado** hasta almacén
- 🗑️ **Flujo de residuos** sin contaminación cruzada
- 🎨 Flechas animadas con código de colores

### Información Detallada
- 📊 Especificaciones técnicas de cada área
- 📏 Dimensiones y superficies
- 🏷️ Clasificación BPF (Zona Negra, Gris, Blanca)
- 🔧 Equipamiento principal por área
- 🌡️ Requisitos de HVAC y presiones diferenciales
- 📜 Cumplimiento de NOM-059-SSA1-2015

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (para cargar Three.js desde CDN)
- No requiere instalación de software adicional

### Ejecución
1. Clona el repositorio:
```bash
git clone https://github.com/damasocortes/pharmaceutical-plant-model.git
cd pharmaceutical-plant-model
```

2. Abre el archivo `index.html` en tu navegador
   - **Opción 1 (Recomendada)**: Usa un servidor local
   ```bash
   # Con Python 3
   python -m http.server 8000
   # O con Python 2
   python -m SimpleHTTPServer 8000
   # Luego abre http://localhost:8000 en tu navegador
   ```
   - **Opción 2**: Abre directamente el archivo `index.html` (doble clic)
     - Nota: Algunos navegadores pueden restringir la carga de módulos ES6 desde archivos locales

### Controles de Navegación

#### Controles de Mouse
- **Click Izquierdo + Arrastrar**: Rotar la vista del modelo 3D
- **Rueda del Mouse**: Zoom in/out
- **Click Derecho + Arrastrar**: Mover la vista (pan)
- **Click en Área**: Ver información detallada del área seleccionada

#### Atajos de Teclado
- **1**: Activar/desactivar flujo de personal
- **2**: Activar/desactivar flujo de materiales
- **3**: Activar/desactivar flujo de producto terminado
- **4**: Activar/desactivar flujo de residuos
- **T**: Cambiar a vista superior
- **I**: Cambiar a vista isométrica
- **H**: Mostrar/ocultar ayuda
- **ESC**: Cerrar paneles abiertos

### Funcionalidades Interactivas

1. **Vistas Predefinidas**
   - Vista Superior (Plano arquitectónico)
   - Vista Isométrica 3D
   - Vista Frontal
   - Vista Lateral

2. **Visualización de Flujos**
   - Flujo de Personal (Azul)
   - Flujo de Materiales (Naranja)
   - Flujo de Producto Terminado (Verde)
   - Flujo de Residuos (Rojo)

3. **Información de Áreas**
   - Haz clic en cualquier área para ver:
     - Función del área
     - Dimensiones y superficie
     - Clasificación BPF
     - Equipamiento principal
     - Requisitos HVAC
     - Artículo NOM-059 aplicable

4. **Tour Educativo**
   - Tour guiado por todas las instalaciones
   - Explicación detallada de cada área
   - Navegación paso a paso

## 📚 Estructura del Proyecto

```
pharmaceutical-plant-model/
├── index.html                 # Página principal del modelo 3D
├── README.md                  # Este archivo
├── docs/
│   ├── documento-tecnico.md   # Documento técnico completo
│   ├── referencias.md         # Referencias bibliográficas
│   └── imagenes/              # Diagramas y capturas
├── src/
│   ├── js/                    # Código JavaScript
│   ├── css/                   # Estilos CSS
│   └── data/                  # Datos y configuraciones
└── assets/                    # Recursos multimedia
```

## 🎓 Fundamentación Teórica

### Normativa
- **NOM-059-SSA1-2015**: Buenas prácticas de fabricación de medicamentos
  - Instalaciones
  - Áreas de producción
  - Flujos de personal, materiales y residuos
  - Control de contaminación cruzada

### Referencias Académicas
- **Aulton, M.E.**: Farmacia: La ciencia del diseño de las formas farmacéuticas
  - Planeación de espacios
  - Diseño funcional de áreas
  - Flujo lógico de procesos
  - Consideraciones de seguridad y eficiencia

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura de la aplicación
- **CSS3**: Estilos y diseño responsivo
- **JavaScript (ES6+)**: Lógica de la aplicación
- **Three.js**: Renderizado 3D interactivo

## 📖 Documentación

La documentación completa del proyecto se encuentra en la carpeta `docs/`:
- **documento-tecnico.md**: Análisis detallado de la planta farmacéutica
- **referencias.md**: Bibliografía y fuentes consultadas

## 👥 Equipo de Desarrollo

- Proyecto académico colaborativo
- Modalidad: Equipos de laboratorio

## 📄 Licencia

Este proyecto es de naturaleza académica y educativa.

## 🤝 Contribuciones

Este es un proyecto académico. Las contribuciones están limitadas a los miembros del equipo de laboratorio.

---

**Nota**: Este modelo digital complementa la maqueta física tridimensional requerida en la actividad académica.