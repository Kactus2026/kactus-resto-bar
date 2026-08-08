/* ==========================================================================
   KACTUS RESTO BAR — script.js
   Toda la lógica: render dinámico, carrito, búsqueda, filtros por categoría,
   drawer, WhatsApp y utilidades. Los datos viven en productos.js.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- NÚMERO DE WHATSAPP DEL LOCAL ---------- */
  // Reemplazar el número de ejemplo en formato internacional sin "+" ni espacios.
  const WHATSAPP_NUMERO = "5492645327261";
  const ALIAS_MERCADOPAGO = "Kactusresto";

  /* ---------- ESTADO ---------- */
  const estado = {
    carrito: {},        // { productoId: cantidad }
    categoriaActiva: "todas",
    busqueda: "",
    datosCliente: {},
  };

  /* ---------- HELPERS ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function formatoARS(numero) {
    return numero.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  }

  function buscarProducto(id) {
    return PRODUCTOS.find((p) => p.id === id);
  }

  function guardarCarrito() {
    try { sessionStorage.setItem("kactus_carrito", JSON.stringify(estado.carrito)); } catch (e) { /* noop */ }
  }

  function cargarCarritoGuardado() {
    try {
      const guardado = sessionStorage.getItem("kactus_carrito");
      if (guardado) estado.carrito = JSON.parse(guardado);
    } catch (e) { /* noop */ }
  }

  /* ---------- LAZY LOADING DE IMÁGENES ---------- */
  const observerImgs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.addEventListener("load", () => img.classList.add("cargada"), { once: true });
        }
        observerImgs.unobserve(img);
      }
    });
  }, { rootMargin: "150px" });

  function crearImgLazy(src, alt, claseExtra) {
    // El tamaño real lo define el CSS del contenedor (ver "CONTENCIÓN DE
    // IMÁGENES" en style.css). No fijamos width/height acá para no forzar
    // un tamaño intrínseco que desborde contenedores de otras proporciones
    // (140px de alto en promos, 92x92 en cards, 64x64 en el carrito).
    const img = document.createElement("img");
    img.alt = alt;
    img.loading = "lazy";
    img.className = "lazy-img" + (claseExtra ? " " + claseExtra : "");
    img.dataset.src = src;
    observerImgs.observe(img);
    return img;
  }

  /* ---------- TOASTS ---------- */
  function mostrarToast(mensaje) {
    const contenedor = $("#toastContenedor");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>✅</span><span>${mensaje}</span>`;
    contenedor.appendChild(toast);
    setTimeout(() => toast.remove(), 2700);
  }

  /* ==========================================================================
     RENDER: CATEGORÍAS (chips de navegación)
     ========================================================================== */
  function renderCategorias() {
    const nav = $("#categorias");
    nav.innerHTML = "";

    const chipTodas = document.createElement("button");
    chipTodas.className = "categoria-chip" + (estado.categoriaActiva === "todas" ? " activo" : "");
    chipTodas.textContent = "🌵 Todas";
    chipTodas.addEventListener("click", () => seleccionarCategoria("todas"));
    nav.appendChild(chipTodas);

    CATEGORIAS.forEach((cat) => {
      const chip = document.createElement("button");
      chip.className = "categoria-chip" + (estado.categoriaActiva === cat.id ? " activo" : "");
      chip.textContent = `${cat.icono} ${cat.nombre}`;
      chip.addEventListener("click", () => seleccionarCategoria(cat.id));
      nav.appendChild(chip);
    });
  }

  function seleccionarCategoria(catId) {
    estado.categoriaActiva = catId;
    renderCategorias();
    if (catId === "todas") {
      $("#seccionesProductos").scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const el = document.getElementById("seccion-" + catId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /* ==========================================================================
     RENDER: PROMOCIONES DESTACADAS (carrusel superior)
     ========================================================================== */
  function renderPromoSpotlight() {
    const cont = $("#promoScroll");
    cont.innerHTML = "";
    const promos = PRODUCTOS.filter((p) => p.categoria === "promociones");

    promos.forEach((p) => {
      const card = document.createElement("article");
      card.className = "promo-card";

      const badge = p.etiqueta ? `<span class="promo-card__badge">${p.etiqueta}</span>` : "";

      card.innerHTML = `
        ${badge}
        <div class="promo-card__body-img"></div>
        <div class="promo-card__body">
          <p class="promo-card__nombre">${p.nombre}</p>
          <p class="promo-card__desc">${p.descripcion}</p>
          <div class="promo-card__footer">
            <span class="precio">${formatoARS(p.precio)}</span>
          </div>
          <div class="acciones-card" data-id="${p.id}" style="margin-top:10px;"></div>
        </div>
      `;

      const imgWrap = card.querySelector(".promo-card__body-img");
      imgWrap.className = "promo-card__img";
      imgWrap.appendChild(crearImgLazy(p.imagen, p.nombre));

      const accionesWrap = card.querySelector(".acciones-card");
      accionesWrap.appendChild(crearControlCantidad(p.id));

      cont.appendChild(card);
    });
  }

  /* ==========================================================================
     RENDER: SECCIONES POR CATEGORÍA (todo el catálogo, excepto promos arriba)
     ========================================================================== */
  function renderSecciones() {
    const cont = $("#seccionesProductos");
    cont.innerHTML = "";

    const termino = estado.busqueda.trim().toLowerCase();
    let huboResultados = false;

    CATEGORIAS.forEach((cat) => {
      let productosCategoria = PRODUCTOS.filter((p) => p.categoria === cat.id);

      if (termino) {
        productosCategoria = productosCategoria.filter(
          (p) => p.nombre.toLowerCase().includes(termino) || p.descripcion.toLowerCase().includes(termino)
        );
      }

      if (productosCategoria.length === 0) return;
      huboResultados = true;

      const seccion = document.createElement("section");
      seccion.className = "seccion";
      seccion.id = "seccion-" + cat.id;

      seccion.innerHTML = `
        <div class="seccion__header">
          <span class="seccion__icono">${cat.icono}</span>
          <h2 class="seccion__titulo">${cat.nombre}</h2>
        </div>
        <div class="divisor-punteado" style="margin-left:16px; margin-right:16px;"></div>
        <div class="grid-productos"></div>
      `;

      const grid = seccion.querySelector(".grid-productos");
      productosCategoria.forEach((p) => grid.appendChild(crearCardProducto(p)));

      cont.appendChild(seccion);
    });

    $("#sinResultados").classList.toggle("oculto", huboResultados || !termino);
  }

  function crearCardProducto(p) {
    const card = document.createElement("article");
    card.className = "card-producto";

    const etiqueta = p.etiqueta ? `<span class="card-producto__etiqueta">${p.etiqueta}</span>` : "";

    card.innerHTML = `
      <div class="card-producto__img-wrap"></div>
      <div class="card-producto__info">
        <p class="card-producto__nombre">${p.nombre}</p>
        ${etiqueta}
        <p class="card-producto__desc">${p.descripcion}</p>
        <div class="card-producto__footer">
          <span class="precio">${formatoARS(p.precio)}</span>
          <div class="acciones-card" data-id="${p.id}"></div>
        </div>
      </div>
    `;

    const imgWrap = card.querySelector(".card-producto__img-wrap");
    imgWrap.className = "card-producto__img";
    imgWrap.appendChild(crearImgLazy(p.imagen, p.nombre));

    const accionesWrap = card.querySelector(".acciones-card");
    accionesWrap.appendChild(crearControlCantidad(p.id));

    return card;
  }

  /* ---------- CONTROL +/- REUTILIZABLE ---------- */
  function crearControlCantidad(productoId) {
    const cantidad = estado.carrito[productoId] || 0;
    const wrap = document.createElement("div");

    if (cantidad === 0) {
      wrap.innerHTML = `<button class="btn-agregar" data-agregar="${productoId}">+ Agregar</button>`;
    } else {
      wrap.innerHTML = `
        <div class="stepper">
          <button data-restar="${productoId}" aria-label="Quitar uno">−</button>
          <span>${cantidad}</span>
          <button data-sumar="${productoId}" aria-label="Agregar uno">+</button>
        </div>
      `;
    }
    return wrap;
  }

  /* ==========================================================================
     CARRITO: lógica de agregar / quitar / eliminar
     ========================================================================== */
  function agregarProducto(id, silencioso) {
    estado.carrito[id] = (estado.carrito[id] || 0) + 1;
    guardarCarrito();
    actualizarUICarrito();
    if (!silencioso) {
      const p = buscarProducto(id);
      mostrarToast(`${p.nombre} agregado al carrito`);
    }
  }

  function quitarUnidad(id) {
    if (!estado.carrito[id]) return;
    estado.carrito[id] -= 1;
    if (estado.carrito[id] <= 0) delete estado.carrito[id];
    guardarCarrito();
    actualizarUICarrito();
  }

  function eliminarProducto(id) {
    delete estado.carrito[id];
    guardarCarrito();
    actualizarUICarrito();
  }

  function vaciarCarrito() {
    estado.carrito = {};
    guardarCarrito();
    actualizarUICarrito();
    cerrarModalVaciar();
    mostrarToast("Carrito vaciado");
  }

  function totalItems() {
    return Object.values(estado.carrito).reduce((acc, c) => acc + c, 0);
  }

  function totalPrecio() {
    return Object.entries(estado.carrito).reduce((acc, [id, cant]) => {
      const p = buscarProducto(id);
      return acc + (p ? p.precio * cant : 0);
    }, 0);
  }

  /* ---------- Refresca TODO lo que depende del carrito ---------- */
  function actualizarUICarrito() {
    // Actualiza contadores +/- visibles en las cards ya renderizadas
    $$(".acciones-card").forEach((wrap) => {
      const id = wrap.dataset.id;
      wrap.innerHTML = "";
      wrap.appendChild(crearControlCantidad(id));
    });

    const items = totalItems();
    const total = totalPrecio();

    $("#contadorCarrito").textContent = items;
    $("#totalCarritoBarra").textContent = formatoARS(total);
    $("#barraCarrito").classList.toggle("visible", items > 0);

    renderDrawer();
  }

  /* ==========================================================================
     DRAWER (carrito lateral deslizante)
     ========================================================================== */
  function renderDrawer() {
    const lista = $("#listaCarrito");
    const ids = Object.keys(estado.carrito);

    if (ids.length === 0) {
      lista.innerHTML = `
        <div class="drawer__vacio">
          <div class="drawer__vacio-icono">🛒</div>
          <p>Tu carrito está vacío.<br>Elegí tus productos favoritos del catálogo.</p>
        </div>`;
      $("#bloqueObservaciones").classList.add("oculto");
      $("#drawerFooter").style.display = "none";
      return;
    }

    lista.innerHTML = "";
    ids.forEach((id) => {
      const p = buscarProducto(id);
      if (!p) return;
      const cant = estado.carrito[id];
      const item = document.createElement("div");
      item.className = "item-carrito";
      item.innerHTML = `
        <div class="item-carrito__img-wrap"></div>
        <div class="item-carrito__info">
          <p class="item-carrito__nombre">${p.nombre}</p>
          <p class="item-carrito__desc">${p.descripcion}</p>
          <div class="item-carrito__footer">
            <div class="stepper">
              <button data-restar="${id}" aria-label="Quitar uno">−</button>
              <span>${cant}</span>
              <button data-sumar="${id}" aria-label="Agregar uno">+</button>
            </div>
            <span class="item-carrito__subtotal">${formatoARS(p.precio * cant)}</span>
          </div>
          <button class="item-carrito__eliminar" data-eliminar="${id}">Eliminar producto</button>
        </div>
      `;
      const imgWrap = item.querySelector(".item-carrito__img-wrap");
      imgWrap.className = "item-carrito__img";
      imgWrap.appendChild(crearImgLazy(p.imagen, p.nombre));
      lista.appendChild(item);
      // Forzar carga inmediata (ya están dentro del drawer, visible on-demand)
      const imgEl = imgWrap.querySelector("img");
      imgEl.src = imgEl.dataset.src;
    });

    $("#bloqueObservaciones").classList.remove("oculto");
    $("#drawerFooter").style.display = "block";
    $("#resumenTotal").textContent = formatoARS(totalPrecio());
  }

  function abrirDrawer() {
    $("#drawer").classList.add("visible");
    $("#overlay").classList.add("visible");
    document.body.style.overflow = "hidden";
  }
  function cerrarDrawer() {
    $("#drawer").classList.remove("visible");
    $("#overlay").classList.remove("visible");
    document.body.style.overflow = "";
  }

  /* ---------- MODAL: confirmar vaciar carrito ---------- */
  function abrirModalVaciar() { $("#modalVaciar").classList.add("visible"); }
  function cerrarModalVaciar() { $("#modalVaciar").classList.remove("visible"); }

  /* ==========================================================================
     ENVÍO DEL PEDIDO POR WHATSAPP
     ========================================================================== */
  function abrirModalDatos() {
    if (totalItems() === 0) return;
    $("#modalDatos").classList.add("visible");
  }
  function cerrarModalDatos() { $("#modalDatos").classList.remove("visible"); }

  function construirMensajeWhatsApp(datos) {
    const lineasPedido = Object.entries(estado.carrito).map(([id, cant]) => {
      const p = buscarProducto(id);
      return `${cant}x ${p.nombre} — ${formatoARS(p.precio * cant)}`;
    }).join("\n");

    const observaciones = $("#campoObservaciones").value.trim();

    let pago = datos.pago;
    if (pago === "Efectivo" && datos.conCuanto) {
      pago += ` (paga con ${datos.conCuanto})`;
    }

    const partes = [
      "🟢 *NUEVO PEDIDO — KACTUS RESTO BAR*",
      "",
      `*Cliente:* ${datos.nombre} ${datos.apellido}`,
      `*Teléfono:* ${datos.telefono}`,
      `*Dirección:* ${datos.direccion}`,
      `*Barrio:* ${datos.barrio}`,
    ];

    if (datos.referencia) {
      partes.push(`*Referencia:* ${datos.referencia}`);
    }

    partes.push(`*Pago:* ${pago}`);

    if (datos.pago === "Transferencia" || datos.pago === "Mercado Pago") {
      partes.push(`*Alias para transferir:* ${ALIAS_MERCADOPAGO}`);
    }

    partes.push("", "*Pedido:*", lineasPedido);

    if (observaciones) {
      partes.push("", `*Observaciones:* ${observaciones}`);
    }

    partes.push("", `*TOTAL: ${formatoARS(totalPrecio())}*`, "", "¡Gracias! 🌵");

    return partes.join("\n");
  }

  function validarYEnviarPedido() {
    const nombre = $("#campoNombre").value.trim();
    const apellido = $("#campoApellido").value.trim();
    const telefono = $("#campoTelefono").value.trim();
    const direccion = $("#campoDireccion").value.trim();
    const barrio = $("#campoBarrio").value.trim();
    const referencia = $("#campoReferencia").value.trim();
    const pago = $('input[name="pago"]:checked').value;
    const conCuanto = $("#campoConCuanto").value.trim();

    if (!nombre || !apellido || !telefono || !direccion || !barrio) {
      mostrarToast("Completá todos los campos obligatorios");
      return;
    }

    const datos = { nombre, apellido, telefono, direccion, barrio, referencia, pago, conCuanto };
    const mensaje = construirMensajeWhatsApp(datos);
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
    cerrarModalDatos();
  }

  /* ==========================================================================
     EVENTOS GLOBALES (delegación de eventos)
     ========================================================================== */
  function inicializarEventos() {
    // Delegación: botones +/- y eliminar, tanto en catálogo como en el drawer
    document.addEventListener("click", (e) => {
      const agregar = e.target.closest("[data-agregar]");
      if (agregar) return agregarProducto(agregar.dataset.agregar);

      const sumar = e.target.closest("[data-sumar]");
      if (sumar) return agregarProducto(sumar.dataset.sumar, true);

      const restar = e.target.closest("[data-restar]");
      if (restar) return quitarUnidad(restar.dataset.restar);

      const eliminar = e.target.closest("[data-eliminar]");
      if (eliminar) return eliminarProducto(eliminar.dataset.eliminar);
    });

    // Buscador
    $("#inputBuscador").addEventListener("input", (e) => {
      estado.busqueda = e.target.value;
      renderSecciones();
    });

    // Abrir / cerrar drawer
    $("#barraCarrito").addEventListener("click", abrirDrawer);
    $("#btnCerrarDrawer").addEventListener("click", cerrarDrawer);
    $("#overlay").addEventListener("click", () => { cerrarDrawer(); cerrarModalVaciar(); cerrarModalDatos(); });

    // Vaciar carrito
    document.addEventListener("click", (e) => {
      if (e.target.id === "btnVaciarCarrito") abrirModalVaciar();
    });
    $("#btnCancelarVaciar").addEventListener("click", cerrarModalVaciar);
    $("#btnConfirmarVaciar").addEventListener("click", vaciarCarrito);

    // Enviar pedido -> abre modal de datos
    $("#btnEnviarPedido").addEventListener("click", abrirModalDatos);
    $("#btnCancelarDatos").addEventListener("click", cerrarModalDatos);
    $("#btnConfirmarDatos").addEventListener("click", validarYEnviarPedido);

    // Mostrar/ocultar "¿con cuánto pagás?" según método de pago
    $$('input[name="pago"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        $("#campoConCuantoWrap").classList.toggle("oculto", e.target.value !== "Efectivo");
      });
    });

    // Copiar alias de Mercado Pago
    $("#btnCopiarAlias").addEventListener("click", () => {
      const alias = $("#aliasMP").textContent;
      navigator.clipboard?.writeText(alias).then(() => mostrarToast("Alias copiado: " + alias))
        .catch(() => mostrarToast("No se pudo copiar. Alias: " + alias));
    });

    // Botón volver arriba
    window.addEventListener("scroll", () => {
      $("#btnArriba").classList.toggle("visible", window.scrollY > 500);
    });
    $("#btnArriba").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // Cerrar modales con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { cerrarDrawer(); cerrarModalVaciar(); cerrarModalDatos(); }
    });
  }

  /* ==========================================================================
     INIT
     ========================================================================== */
  function init() {
    cargarCarritoGuardado();
    $("#aliasMP").textContent = ALIAS_MERCADOPAGO;
    renderCategorias();
    renderPromoSpotlight();
    renderSecciones();
    actualizarUICarrito();
    inicializarEventos();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
