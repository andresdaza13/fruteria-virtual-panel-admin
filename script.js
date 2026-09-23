const manzana   = { id: 1,  nombre: "manzana",    categoria: "fruta",   precio: 20.5,  stock: 8,  icono: "images/manzana.jpg" };
const pina      = { id: 2,  nombre: "pina",       categoria: "fruta",   precio: 15.35, stock: 5,  icono: "images/pina.jpg" };
const pera      = { id: 3,  nombre: "pera",       categoria: "fruta",   precio: 5.45,  stock: 12, icono: "images/pera.jpg" };
const melon     = { id: 4,  nombre: "melon",      categoria: "fruta",   precio: 6.15,  stock: 3,  icono: "images/melon.jpg" };
const zanahoria = { id: 5,  nombre: "zanahoria",  categoria: "verdura", precio: 3.2,   stock: 14, icono: "images/zanahoria.jpg" };
const tomate    = { id: 6,  nombre: "tomate",     categoria: "verdura", precio: 4.75,  stock: 0,  icono: "images/tomate.jpg" };
const jugo      = { id: 7,  nombre: "jugo",       categoria: "bebida",  precio: 12.0,  stock: 6,  icono: "images/jugo.jpg" };
const cocoAgua  = { id: 8,  nombre: "aguaCoco",   categoria: "bebida",  precio: 8.9,   stock: 4,  icono: "images/aguaCoco.jpg" };
const platano   = { id: 9,  nombre: "plátano",    categoria: "fruta",   precio: 18.0,  stock: 20, icono: "images/platano.jpg" };
const uva       = { id: 10, nombre: "uva",        categoria: "fruta",   precio: 35.5,  stock: 15, icono: "images/uva.jpg" };
const sandia    = { id: 11, nombre: "sandía",     categoria: "fruta",   precio: 25.0,  stock: 7,  icono: "images/sandia.jpg" };
const mango     = { id: 12, nombre: "mango",      categoria: "fruta",   precio: 22.3,  stock: 10, icono: "images/mango.jpg" };
const fresa     = { id: 13, nombre: "fresa",      categoria: "fruta",   precio: 45.0,  stock: 0,  icono: "images/fresa.jpg" };
const lechuga   = { id: 14, nombre: "lechuga",    categoria: "verdura", precio: 12.5,  stock: 18, icono: "images/lechuga.jpg" };
const cebolla   = { id: 15, nombre: "cebolla",    categoria: "verdura", precio: 9.8,   stock: 30, icono: "images/cebolla.jpg" };
const pepino    = { id: 16, nombre: "pepino",     categoria: "verdura", precio: 14.2,  stock: 2,  icono: "images/pepino.jpg" };
const brocoli   = { id: 17, nombre: "brócoli",    categoria: "verdura", precio: 19.9,  stock: 12, icono: "images/brocoli.jpg" };
const limonada  = { id: 18, nombre: "limonada",   categoria: "bebida",  precio: 15.0,  stock: 20, icono: "images/limonada.jpg" };
const teHelado  = { id: 19, nombre: "té helado",  categoria: "bebida",  precio: 18.5,  stock: 14, icono: "images/te.jpg" };
const agua      = { id: 20, nombre: "agua pura",  categoria: "bebida",  precio: 10.0,  stock: 50, icono: "images/agua.jpg" };

const inventarioProductos = [
  manzana, pina, pera, melon, zanahoria, tomate, jugo, cocoAgua,
  platano, uva, sandia, mango, fresa, lechuga, cebolla, pepino,
  brocoli, limonada, teHelado, agua
];

const COSTO_ENVIO = 8;
const MINIMO_ENVIO_GRATIS = 60;
const MINIMO_CUPON_MITAD = 100;

let carrito = [];
let porcentajeDescuento = 0;
let envioGratisPorCupon = false;
let cuponActivo = false; // NUEVO Proyecto 5: evita aplicar dos cupones a la vez
let categoriaActual = "todos";
let temaOscuro = false;
let numeroPedido = 1000;
let temporizadorMensaje = null;

const contenedorProductos = document.getElementById("lista-productos");
const contenedorCarrito   = document.getElementById("items-carrito");
const contadorCarrito     = document.getElementById("contador-carrito");
const textoSubtotal       = document.getElementById("texto-subtotal");
const textoDescuento      = document.getElementById("texto-descuento");
const lineaDescuento      = document.getElementById("linea-descuento");
const textoEnvio          = document.getElementById("texto-envio");
const textoTotal          = document.getElementById("texto-total");
const mensajeSistema      = document.getElementById("mensaje-sistema");
const inputDescuento      = document.getElementById("input-descuento");
const btnDescuento        = document.getElementById("btn-aplicar-descuento");
const selectCategoria     = document.getElementById("filtro-categoria");
const formCompra          = document.getElementById("form-compra");
const inputNombre         = document.getElementById("input-nombre");
const inputCorreo         = document.getElementById("input-correo");
const panelBoleta         = document.getElementById("panel-boleta");
const avisoConexion       = document.getElementById("aviso-conexion");
const btnTema             = document.getElementById("btn-tema");

const formatearPrecio = (valor) => {
  return `$${valor.toFixed(2)}`;
};

function buscarProductoPorId(idProducto) {
  return inventarioProductos.find((producto) => producto.id === idProducto) || null;
}

function buscarItemEnCarrito(idProducto) {
  return carrito.find((item) => item.id === idProducto) || null;
}

const carritoSinProducto = (idProducto) => {
  const nuevoCarrito = [];
  carrito.forEach((item) => {
    if (item.id !== idProducto) {
      nuevoCarrito.push(item);
    }
  });
  return nuevoCarrito;
};

const contarUnidades = () => {
  let unidades = 0;
  carrito.forEach((item) => {
    unidades = unidades + item.cantidad;
  });
  return unidades;
};

const calcularTotales = () => {
  let subtotal = 0;
  carrito.forEach((item) => {
    subtotal = subtotal + (item.precio * item.cantidad);
  });

  const descuento = subtotal * porcentajeDescuento;

  const envio = (carrito.length === 0 || envioGratisPorCupon === true || subtotal - descuento >= MINIMO_ENVIO_GRATIS)
    ? 0
    : COSTO_ENVIO;

  const total = subtotal - descuento + envio;

  return { subtotal, descuento, envio, total };
};

function renderizarProductos() {
  while (contenedorProductos.firstChild) {
    contenedorProductos.firstChild.remove();
  }

  inventarioProductos.forEach((producto) => {
    const coincideFiltro = (categoriaActual === "todos" || producto.categoria === categoriaActual);

    if (coincideFiltro) {
      const tarjeta = document.createElement("article");
      tarjeta.classList.add("tarjeta");

      let textoStock = "";
      if (producto.stock === 0) {
        textoStock = "Agotado";
        tarjeta.classList.add("agotada");
      } else if (producto.stock <= 3) {
        textoStock = `¡Últimas ${producto.stock} unidades!`;
        tarjeta.classList.add("poco-stock");
      } else {
        textoStock = `Disponibles: ${producto.stock}`;
      }

      const itemEnCarrito = buscarItemEnCarrito(producto.id);
      const textoEnCarrito = (itemEnCarrito === null) ? "" : `Ya llevas ${itemEnCarrito.cantidad} en el carrito`;

      tarjeta.innerHTML = `
        <span class="icono-producto"><img src="${producto.icono}" alt="${producto.nombre}" style="width: 100%; height: 100%; object-fit: contain;"></span>
        <h3 class="nombre-producto">${producto.nombre}</h3>
        <p class="etiqueta-categoria">${producto.categoria}</p>
        <p class="precio-producto">${formatearPrecio(producto.precio)}</p>
        <p class="estado-stock">${textoStock}</p>
        <p class="mini-dato">${textoEnCarrito}</p>
      `;

      const botonComprar = document.createElement("button");
      botonComprar.classList.add("boton", "boton-bloque");

      if (producto.stock === 0) {
        botonComprar.textContent = "Sin existencias";
        botonComprar.disabled = true;
      } else {
        botonComprar.textContent = "Agregar al carrito";
        botonComprar.addEventListener("click", () => {
          agregarAlCarrito(producto.id);
        });
      }

      tarjeta.appendChild(botonComprar);
      contenedorProductos.appendChild(tarjeta);
    }
  });
}

const agregarAlCarrito = (idProducto) => {
  const producto = buscarProductoPorId(idProducto);

  if (producto.stock > 0) {
    const item = buscarItemEnCarrito(idProducto);

    if (item === null) {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        icono: producto.icono,
        cantidad: 1
      });
    } else {
      item.cantidad++;
    }

    producto.stock--;
    mostrarMensaje(`${producto.nombre} agregado al carrito`, "exito");
    actualizarPantalla();
  } else {
    mostrarMensaje(`No queda inventario de ${producto.nombre}`, "error");
  }
};

// Proyecto 5, requisito 3: blindada para que la resta NUNCA deje cantidades negativas.
function cambiarCantidad(idProducto, cambio) {
  const item = buscarItemEnCarrito(idProducto);
  const producto = buscarProductoPorId(idProducto);

  if (item === null) {
    return;
  }

  if (cambio === 1) {
    if (producto.stock > 0) {
      item.cantidad++;
      producto.stock--;
    } else {
      mostrarMensaje(`No hay más unidades de ${producto.nombre}`, "error");
    }
  } else {
    if (item.cantidad <= 0) {
      return;
    }

    item.cantidad--;
    producto.stock++;

    if (item.cantidad === 0) {
      carrito = carritoSinProducto(idProducto);
    }
  }

  actualizarPantalla();
}

function quitarDelCarrito(idProducto) {
  const item = buscarItemEnCarrito(idProducto);

  if (item === null) {
    return;
  }

  const producto = buscarProductoPorId(idProducto);
  producto.stock = producto.stock + item.cantidad;
  carrito = carritoSinProducto(idProducto);
  mostrarMensaje(`${producto.nombre} se quitó del carrito`, "error");
  actualizarPantalla();
}

const renderizarCarrito = function () {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.firstChild.remove();
  }

  if (carrito.length === 0) {
    const vacio = document.createElement("p");
    vacio.classList.add("carrito-vacio");
    vacio.textContent = "Tu carrito está vacío. Agrega productos del catálogo.";
    contenedorCarrito.appendChild(vacio);
    return;
  }

  carrito.forEach((item) => {
    const linea = document.createElement("div");
    linea.classList.add("linea-carrito");

    const info = document.createElement("div");
    info.innerHTML = `
      <p class="nombre-linea"><img src="${item.icono}" alt="${item.nombre}" style="width: 20%; height: 100%;"> ${item.nombre}</p>
      <p class="detalle-linea">${item.cantidad} x ${formatearPrecio(item.precio)} = ${formatearPrecio(item.precio * item.cantidad)}</p>
    `;

    const controles = document.createElement("div");
    controles.classList.add("controles-linea");

    const btnMenos = document.createElement("button");
    btnMenos.classList.add("boton-mini");
    btnMenos.textContent = "-";
    btnMenos.addEventListener("click", () => {
      cambiarCantidad(item.id, -1);
    });

    const btnMas = document.createElement("button");
    btnMas.classList.add("boton-mini");
    btnMas.textContent = "+";
    btnMas.addEventListener("click", () => {
      cambiarCantidad(item.id, 1);
    });

    const btnQuitar = document.createElement("button");
    btnQuitar.classList.add("boton-mini", "boton-quitar");
    btnQuitar.textContent = "X";
    btnQuitar.addEventListener("click", () => {
      quitarDelCarrito(item.id);
    });

    controles.appendChild(btnMenos);
    controles.appendChild(btnMas);
    controles.appendChild(btnQuitar);

    linea.appendChild(info);
    linea.appendChild(controles);
    contenedorCarrito.appendChild(linea);
  });
};

function renderizarResumen() {
  const totales = calcularTotales();

  textoSubtotal.textContent = formatearPrecio(totales.subtotal);
  textoTotal.textContent = formatearPrecio(totales.total);
  contadorCarrito.textContent = contarUnidades();

  if (totales.descuento > 0) {
    textoDescuento.textContent = `- ${formatearPrecio(totales.descuento)}`;
    lineaDescuento.classList.remove("oculto");
  } else {
    lineaDescuento.classList.add("oculto");
  }

  textoEnvio.textContent = (totales.envio === 0) ? "Gratis" : formatearPrecio(totales.envio);
}

function actualizarPantalla() {
  renderizarProductos();
  renderizarCarrito();
  renderizarResumen();
}

selectCategoria.addEventListener("change", () => {
  categoriaActual = selectCategoria.value;
  renderizarProductos();
});

// Proyecto 5, requisito 2: cupón sanitizado con trim() + toUpperCase()
// Proyecto 5, requisito 4: bloqueo si ya hay un cupón activo
const aplicarCupon = function () {
  const codigo = inputDescuento.value.trim().toUpperCase();
  const totales = calcularTotales();

  if (carrito.length === 0) {
    mostrarMensaje("Agrega productos antes de usar un cupón", "info");
    return;
  }

  if (cuponActivo) {
    mostrarMensaje("Ya tienes un cupón aplicado. Quítalo antes de usar otro.", "advertencia");
    return;
  }

  switch (codigo) {
    case "DESCUENTO10":
      porcentajeDescuento = 0.10;
      envioGratisPorCupon = false;
      cuponActivo = true;
      mostrarMensaje("Cupón aplicado: 10% de descuento", "exito");
      break;

    case "MITAD":
      if (totales.subtotal >= MINIMO_CUPON_MITAD) {
        porcentajeDescuento = 0.50;
        envioGratisPorCupon = false;
        cuponActivo = true;
        mostrarMensaje("Cupón aplicado: 50% de descuento", "exito");
      } else {
        porcentajeDescuento = 0;
        mostrarMensaje(
          `El cupón MITAD necesita una compra mínima de ${formatearPrecio(MINIMO_CUPON_MITAD)}`,
          "error"
        );
      }
      break;

    case "ENVIOGRATIS":
      porcentajeDescuento = 0;
      envioGratisPorCupon = true;
      cuponActivo = true;
      mostrarMensaje("Cupón aplicado: envío gratis", "exito");
      break;

    default:
      porcentajeDescuento = 0;
      envioGratisPorCupon = false;
      mostrarMensaje("Ese código no existe o ya venció", "error");
  }

  renderizarResumen();
};

btnDescuento.addEventListener("click", () => {
  aplicarCupon();
});

function detectarEnterCupon(e) {
  if (e.key === "Enter") {
    aplicarCupon();
  }
}
inputDescuento.addEventListener("keydown", detectarEnterCupon);

const manejarCompra = function (evento) {
  evento.preventDefault();

  if (carrito.length === 0) {
    mostrarMensaje("Tu carrito está vacío", "error");
    return;
  }

  const nombreCliente = inputNombre.value;
  const correoCliente = inputCorreo.value;

  if (nombreCliente.length < 3) {
    mostrarMensaje("Escribe tu nombre completo (mínimo 3 letras)", "error");
    return;
  }

  const totales = calcularTotales();
  numeroPedido++;

  dibujarBoleta(nombreCliente, correoCliente, totales);

  carrito = [];
  porcentajeDescuento = 0;
  envioGratisPorCupon = false;
  cuponActivo = false; // Proyecto 5: liberamos la bandera para la próxima compra
  inputDescuento.value = "";
  inputNombre.value = "";
  inputCorreo.value = "";

  mostrarMensaje(`Pedido #${numeroPedido} confirmado`, "exito");
  actualizarPantalla();
};

formCompra.addEventListener("submit", manejarCompra);

function dibujarBoleta(nombreCliente, correoCliente, totales) {
  while (panelBoleta.firstChild) {
    panelBoleta.firstChild.remove();
  }

  const titulo = document.createElement("h3");
  titulo.textContent = `Pedido #${numeroPedido} confirmado`;
  panelBoleta.appendChild(titulo);

  const datos = document.createElement("p");
  datos.textContent = `${nombreCliente} · ${correoCliente}`;
  panelBoleta.appendChild(datos);

  let i = 0;
  do {
    const item = carrito[i];
    const linea = document.createElement("p");
    linea.textContent = `${item.cantidad} x ${item.nombre} = ${formatearPrecio(item.precio * item.cantidad)}`;
    panelBoleta.appendChild(linea);
    i++;
  } while (i < carrito.length);

  if (totales.descuento > 0) {
    const ahorro = document.createElement("p");
    ahorro.textContent = `Ahorraste ${formatearPrecio(totales.descuento)} con tu cupón`;
    panelBoleta.appendChild(ahorro);
  }

  const envio = document.createElement("p");
  envio.textContent = (totales.envio === 0) ? "Envío: gratis" : `Envío: ${formatearPrecio(totales.envio)}`;
  panelBoleta.appendChild(envio);

  const total = document.createElement("p");
  total.classList.add("boleta-total");
  total.textContent = `Total pagado: ${formatearPrecio(totales.total)}`;
  panelBoleta.appendChild(total);

  panelBoleta.classList.remove("oculto");
}

// Proyecto 5, requisito 5: nuevo case "advertencia"
function mostrarMensaje(texto, tipo) {
  mensajeSistema.textContent = texto;

  mensajeSistema.classList.remove("oculto", "mensaje-exito", "mensaje-error", "mensaje-info", "mensaje-advertencia");

  switch (tipo) {
    case "exito":
      mensajeSistema.classList.add("mensaje-exito");
      break;
    case "error":
      mensajeSistema.classList.add("mensaje-error");
      break;
    case "info":
      mensajeSistema.classList.add("mensaje-info");
      break;
    case "advertencia":
      mensajeSistema.classList.add("mensaje-advertencia");
      break;
    default:
      mensajeSistema.classList.add("mensaje-exito");
  }

  clearTimeout(temporizadorMensaje);
  temporizadorMensaje = setTimeout(() => {
    mensajeSistema.classList.add("oculto");
  }, 3000);
}


const formAdmin       = document.getElementById("form-admin");
const adminNombre     = document.getElementById("admin-nombre");
const adminCategoria  = document.getElementById("admin-categoria");
const adminPrecio     = document.getElementById("admin-precio");
const adminStock      = document.getElementById("admin-stock");
const adminImagen     = document.getElementById("admin-imagen");
const adminPreview    = document.getElementById("admin-preview");

// Convierte el archivo elegido en una URL temporal que <img> puede mostrar.
// URL.createObjectURL(file) => "blob:..." (vive mientras la página esté abierta).
const obtenerUrlImagen = (archivo) => URL.createObjectURL(archivo);

// Vista previa: se actualiza cada vez que el usuario elige otra imagen
adminImagen.addEventListener("change", () => {
  const archivo = adminImagen.files[0];
  if (archivo) {
    adminPreview.src = obtenerUrlImagen(archivo);
    adminPreview.classList.remove("oculto");
  } else {
    adminPreview.classList.add("oculto");
  }
});

// El botón "Limpiar" (type="reset") vacía los inputs; también ocultamos la vista previa
formAdmin.addEventListener("reset", () => {
  adminPreview.classList.add("oculto");
  adminPreview.removeAttribute("src");
});

const registrarProducto = function (evento) {
  // 1. Evitar que el formulario recargue la página (perderíamos el arreglo en memoria)
  evento.preventDefault();

  // 2. Recolectar valores. OJO: .value SIEMPRE devuelve String.
  const nombre    = adminNombre.value.trim().toLowerCase();
  const categoria = adminCategoria.value;
  const precio    = parseFloat(adminPrecio.value);   // "12.5" -> 12.5
  const stock     = parseInt(adminStock.value, 10);  // "10"   -> 10
  const archivo   = adminImagen.files[0];

  // 3. Validaciones: si parseFloat/parseInt fallan devuelven NaN
  if (nombre.length < 2) {
    mostrarMensaje("El nombre debe tener al menos 2 letras", "error");
    return;
  }
  if (isNaN(precio) || precio <= 0) {
    mostrarMensaje("Escribe un precio válido mayor que 0", "error");
    return;
  }
  if (isNaN(stock) || stock < 0) {
    mostrarMensaje("El stock debe ser un número entero de 0 o más", "error");
    return;
  }
  if (!archivo) {
    mostrarMensaje("Selecciona una imagen para el producto", "error");
    return;
  }
  const yaExiste = inventarioProductos.some((p) => p.nombre === nombre);
  if (yaExiste) {
    mostrarMensaje(`Ya existe un producto llamado "${nombre}"`, "advertencia");
    return;
  }

  // 4. Empaquetar en un OBJETO LITERAL con las MISMAS propiedades que los demás:
  //    { id, nombre, categoria, precio, stock, icono }
  const nuevoProducto = {
    id: inventarioProductos.length + 1,   // id único: longitud actual + 1
    nombre: nombre,
    categoria: categoria,
    precio: precio,                        // ya es Number, sirve para calcularTotales()
    stock: stock,
    icono: obtenerUrlImagen(archivo)
  };

  // 5. Inyectar el objeto en el arreglo global del inventario
  inventarioProductos.push(nuevoProducto);

  // 6. Forzar el ciclo de limpieza y redibujado.
  //    Quitamos el filtro para que la nueva tarjeta sea visible sí o sí.
  categoriaActual = "todos";
  selectCategoria.value = "todos";
  actualizarPantalla();

  // Extra: resaltar la tarjeta nueva (es la última que se dibujó) y llevar la vista a ella
  const tarjetaNueva = contenedorProductos.lastElementChild;
  tarjetaNueva.classList.add("nueva");
  tarjetaNueva.scrollIntoView({ block: "center" });

  mostrarMensaje(`"${nuevoProducto.nombre}" registrado con id ${nuevoProducto.id}`, "exito");
  console.log("Producto agregado:", nuevoProducto);
  console.table(inventarioProductos);

  formAdmin.reset();
};

formAdmin.addEventListener("submit", registrarProducto);

btnTema.addEventListener("click", () => {
  if (temaOscuro === false) {
    document.body.classList.add("tema-oscuro");
    btnTema.textContent = "Modo claro";
    temaOscuro = true;
  } else {
    document.body.classList.remove("tema-oscuro");
    btnTema.textContent = "Modo oscuro";
    temaOscuro = false;
  }
});

(function iniciarTienda() {
  console.log("Iniciando la tienda...");

  actualizarPantalla();

  window.addEventListener("offline", () => {
    avisoConexion.classList.remove("oculto");
  });

  window.addEventListener("online", () => {
    avisoConexion.classList.add("oculto");
    mostrarMensaje("Conexión restaurada", "exito");
  });

  console.log(`Tienda lista con ${inventarioProductos.length} productos.`);
})();