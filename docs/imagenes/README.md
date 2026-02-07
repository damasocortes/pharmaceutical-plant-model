# Diagramas de Flujo

Esta carpeta contiene los diagramas de flujo del modelo de planta farmacéutica.

## Diagramas Disponibles

Los diagramas están integrados directamente en la aplicación web 3D interactiva. Para visualizar los flujos:

1. Abra el archivo `index.html` en su navegador
2. Use los botones de control de flujos en el panel izquierdo:
   - **Flujo de Personal**: Muestra el recorrido del personal desde la entrada
   - **Flujo de Materiales**: Visualiza el movimiento de materias primas
   - **Flujo de Producto Terminado**: Muestra el recorrido del producto final
   - **Flujo de Residuos**: Indica las rutas de evacuación de residuos

## Descripción de Flujos

### Flujo de Personal
- Entrada → Vestidores → Esclusas → Áreas de producción
- Código de color: Azul (#3498db)

### Flujo de Materiales
- Recepción → Cuarentena → Almacén → Pesado → Mezclado → Granulación → Compresión → Recubrimiento
- Código de color: Naranja (#e67e22)

### Flujo de Producto Terminado
- Recubrimiento → Control de Calidad → Envasado → Almacén PT
- Código de color: Verde (#27ae60)

### Flujo de Residuos
- Desde áreas de producción → Área de lavado → Salida
- Código de color: Rojo (#e74c3c)

---

**Nota:** Los diagramas están implementados como visualizaciones 3D interactivas con flechas animadas que indican la dirección de cada flujo.
