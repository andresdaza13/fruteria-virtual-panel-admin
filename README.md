# Frutería Web — Panel de administración (Proyecto 3)

Tienda en HTML, CSS y JavaScript puro con un **panel de administración** para registrar mercancía nueva en tiempo real.

## Funcionalidades
- Navegación semántica (`<nav>` + `<ul>`) entre la tienda, el panel y la hoja de vida.
- Formulario `#form-admin` separado del de compra: nombre, categoría, precio, stock e imagen, cada uno con su `<label>`.
- Panel maquetado con **Flexbox** (`display: flex`, `flex-wrap`, `gap`).
- Al enviar, los valores se convierten (`parseFloat` / `parseInt`), se empaquetan en un objeto literal `{ id, nombre, categoria, precio, stock, icono }`, se agregan a `inventarioProductos` con `push()` y se llama a `actualizarPantalla()` para redibujar el catálogo.

## Ejecutar
Abre `index.html` en el navegador (o publícalo con GitHub Pages).

> Los productos agregados viven en memoria: al recargar la página se pierden.

Autor: Carlos Andrés Caicedo Daza
