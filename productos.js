/* ==========================================================================
   KACTUS RESTO BAR — productos.js
   Acá vive TODO el contenido del catálogo: categorías y productos.
   Para agregar / quitar / modificar un producto, editá este archivo.
   No hace falta tocar el HTML ni el CSS.

   Estructura de cada producto:
   {
     id: identificador único (string)
     nombre: string
     descripcion: string breve
     precio: number (en pesos argentinos, sin puntos ni comas)
     imagen: ruta o URL de la imagen
     destacado: true/false -> se muestra en "Más pedidos"
     promoPizza: true/false -> aplica el regalo de papas fritas
     etiqueta: texto corto opcional para la card ("Más pedido", "Ahorrás $X", etc.)
   }

   IMAGEN: por ahora se usan fotos de stock de alta calidad como placeholder.
   Cuando tengas fotos reales del local, simplemente reemplazá el valor de
   "imagen" por la ruta local, ej: "imagenes/hamburguesa-completa.jpg"
   ========================================================================== */

const PLACEHOLDER = {
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  burgerDouble: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80",
  sandwichSteak: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80",
  lomito: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
  pizzaSlice: "https://images.unsplash.com/photo-1548365328-9f547fb0953b?auto=format&fit=crop&w=600&q=80",
  fries: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80",
  friesCheese: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80",
  empanadas: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?auto=format&fit=crop&w=600&q=80",
  tarta: "https://images.unsplash.com/photo-1601924582975-b5f3b9a3b7e4?auto=format&fit=crop&w=600&q=80",
  tostado: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=600&q=80",
  combo: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80",
};

/* Fotos reales del local (reemplazan el placeholder producto por producto) */
const REAL = {
  pachatas2: "imagenes/2-pachatas-papas.jpg",
  pachatas3: "imagenes/3-pachatas-papas.jpg",
  pachatas4: "imagenes/4-pachatas-papas.jpg",
  pachatasCerdo2: "imagenes/2-pachatas-cerdo-papas.jpg",
  pachatasCerdoGenerica: "imagenes/pachatas-cerdo.jpg",
  pachataGenerica: "imagenes/pachata.jpg",
  lomo1: "imagenes/1-lomo-papas.jpg",
  lomo2: "imagenes/2-lomos-papas.jpg",
  hamburguesaComun: "imagenes/hamburguesa-comun.jpg",
  pizzaLomo: "imagenes/pizza-lomo.jpg",
  papasCheddarPanceta: "imagenes/papas-cheddar-panceta.jpg",
  papasCheddar: "imagenes/papas-cheddar.jpg",
  papasHuevo: "imagenes/papas-huevo.jpg",
  pizzaEspecial: "imagenes/pizza-especial.jpg",
  pizzaMuzzarella: "imagenes/pizza-muzzarella.jpg",
  pizzaPanceta: "imagenes/pizza-panceta.jpg",
  pizzaRoquefort: "imagenes/pizza-roquefort.jpg",
  tartaJamonQueso: "imagenes/tarta-jamonqueso.jpg",
  tartaVerduras: "imagenes/tarta-verduras.jpg",
  tostado: "imagenes/tostado.jpg",
  pizzaNapolitana: "imagenes/pizza-napolitana.jpg",
  barroluco: "imagenes/barroluco.jpg",
  chorrillana: "imagenes/chorrillana.jpg",
  empanadasCarne: "imagenes/empanadas-carne.jpg",
  empanadasJamonQueso: "imagenes/empanadas-jamonqueso.jpg",
};

const CATEGORIAS = [
  { id: "promociones", nombre: "Promociones", icono: "🔥" },
  { id: "hamburguesas", nombre: "Hamburguesas", icono: "🍔" },
  { id: "pachatas", nombre: "Pachatas", icono: "🥖" },
  { id: "lomos", nombre: "Lomos", icono: "🥩" },
  { id: "pizzas", nombre: "Pizzas", icono: "🍕" },
  { id: "papas", nombre: "Papas fritas", icono: "🍟" },
  { id: "chorrillana", nombre: "Chorrillana", icono: "🥘" },
  { id: "sintacc", nombre: "Menú Sin TACC", icono: "🌾" },
  { id: "otros", nombre: "Tostados y Barroluco", icono: "🥪" },
];

const PRODUCTOS = [
  /* ================= PROMOCIONES ================= */
  {
    id: "promo-2pachatas-papas",
    categoria: "promociones",
    nombre: "2 Pachatas + Papas",
    descripcion: "Dos pachatas especiales + porción de papas fritas para compartir.",
    precio: 29500,
    imagen: REAL.pachatas2,
    destacado: true,
    etiqueta: "Más pedido",
  },
  {
    id: "promo-3pachatas-papas",
    categoria: "promociones",
    nombre: "3 Pachatas + Papas",
    descripcion: "Tres pachatas especiales + papas fritas. Ideal para compartir en grupo.",
    precio: 44000,
    imagen: REAL.pachatas3,
  },
  {
    id: "promo-4pachatas-papas",
    categoria: "promociones",
    nombre: "4 Pachatas + Papas",
    descripcion: "Cuatro pachatas especiales + papas fritas. La opción familiar.",
    precio: 58000,
    imagen: REAL.pachatas4,
    etiqueta: "Familiar",
  },
  {
    id: "promo-1lomo-papas",
    categoria: "promociones",
    nombre: "1 Lomo + Papas",
    descripcion: "Un lomo especial + porción de papas fritas.",
    precio: 20500,
    imagen: REAL.lomo1,
  },
  {
    id: "promo-2lomos-papas",
    categoria: "promociones",
    nombre: "2 Lomos + Papas",
    descripcion: "Dos lomos especiales + papas fritas para compartir.",
    precio: 33000,
    imagen: REAL.lomo2,
    destacado: true,
    etiqueta: "Más pedido",
  },
  {
    id: "promo-2pachatascerdo-papas",
    categoria: "promociones",
    nombre: "2 Pachatas de cerdo + Papas",
    descripcion: "Dos pachatas de cerdo + porción de papas fritas.",
    precio: 18000,
    imagen: REAL.pachatasCerdo2,
  },
  {
    id: "promo-3pachatascerdo-papas",
    categoria: "promociones",
    nombre: "3 Pachatas de cerdo + Papas",
    descripcion: "Tres pachatas de cerdo + papas fritas para compartir.",
    precio: 25000,
    imagen: REAL.pachatasCerdoGenerica,
  },
  {
    id: "promo-2hamburguesas-papas",
    categoria: "promociones",
    nombre: "2 Hamburguesas + Papas",
    descripcion: "Dos hamburguesas especiales + porción de papas fritas.",
    precio: 17000,
    imagen: REAL.hamburguesaComun,
    destacado: true,
    etiqueta: "Más pedido",
  },
  {
    id: "promo-3hamburguesas-papas",
    categoria: "promociones",
    nombre: "3 Hamburguesas + Papas",
    descripcion: "Tres hamburguesas especiales + papas fritas para compartir.",
    precio: 23000,
    imagen: REAL.hamburguesaComun,
  },
  {
    id: "promo-1hamburguesa-papas",
    categoria: "promociones",
    nombre: "1 Hamburguesa + Papas",
    descripcion: "Una hamburguesa especial + porción de papas fritas.",
    precio: 9000,
    imagen: REAL.hamburguesaComun,
    etiqueta: "Ideal para uno",
  },
  {
    id: "promo-2pizzasmuzza",
    categoria: "promociones",
    nombre: "2 Pizzas Muzzarella",
    descripcion: "Dos pizzas muzzarella grandes. Incluye papas fritas de regalo.",
    precio: 23000,
    imagen: REAL.pizzaMuzzarella,
    promoPizza: true,
  },
  {
    id: "promo-pizzamuzza-napo",
    categoria: "promociones",
    nombre: "Pizza Muzzarella + Napolitana",
    descripcion: "Una muzzarella y una napolitana grandes. Incluye papas fritas de regalo.",
    precio: 24000,
    imagen: REAL.pizzaNapolitana,
    promoPizza: true,
    destacado: true,
    etiqueta: "Más pedido",
  },
  {
    id: "promo-pizzaespecial-napo",
    categoria: "promociones",
    nombre: "Pizza Especial + Napolitana",
    descripcion: "Una pizza especial y una napolitana grandes. Incluye papas fritas de regalo.",
    precio: 26000,
    imagen: REAL.pizzaEspecial,
    promoPizza: true,
  },
  {
    id: "promo-pizzaespecial-muzza",
    categoria: "promociones",
    nombre: "Pizza Especial + Muzzarella",
    descripcion: "Una pizza especial y una muzzarella grandes. Incluye papas fritas de regalo.",
    precio: 25000,
    imagen: REAL.pizzaEspecial,
    promoPizza: true,
  },

  /* ================= PAPAS FRITAS ================= */
  { id: "papas-clasicas", categoria: "papas", nombre: "Clásicas", descripcion: "Papas fritas clásicas bien doradas.", precio: 4000, imagen: PLACEHOLDER.fries },
  { id: "papas-cheddar", categoria: "papas", nombre: "Cheddar", descripcion: "Papas fritas con generosa salsa cheddar.", precio: 4800, imagen: REAL.papasCheddar, destacado: true, etiqueta: "Más pedido" },
  { id: "papas-huevo", categoria: "papas", nombre: "Huevo", descripcion: "Papas fritas con huevo frito por encima.", precio: 4500, imagen: REAL.papasHuevo },
  { id: "papas-cheddar-panceta", categoria: "papas", nombre: "Cheddar + Panceta", descripcion: "Papas fritas con salsa cheddar y panceta crocante.", precio: 5500, imagen: REAL.papasCheddarPanceta },

  /* ================= HAMBURGUESAS ================= */
  { id: "hamburguesa-especial", categoria: "hamburguesas", nombre: "Especial", descripcion: "Medallón, queso, lechuga, tomate y salsa de la casa.", precio: 7200, imagen: REAL.hamburguesaComun },
  { id: "hamburguesa-completa", categoria: "hamburguesas", nombre: "Completa", descripcion: "Medallón, jamón, queso, huevo, lechuga y tomate.", precio: 7500, imagen: REAL.hamburguesaComun, destacado: true, etiqueta: "Más pedido" },
  { id: "hamburguesa-cheddar", categoria: "hamburguesas", nombre: "Cheddar", descripcion: "Medallón con abundante salsa cheddar.", precio: 7800, imagen: REAL.hamburguesaComun },
  { id: "hamburguesa-vegetariana", categoria: "hamburguesas", nombre: "Vegetariana", descripcion: "Medallón vegetariano, lechuga, tomate y salsa de la casa.", precio: 7000, imagen: REAL.hamburguesaComun },
  { id: "hamburguesa-doble", categoria: "hamburguesas", nombre: "Doble Medallón de Carne", descripcion: "Dos medallones de carne, queso, lechuga, tomate y salsa de la casa.", precio: 9500, imagen: REAL.hamburguesaComun },

  /* ================= PACHATAS ================= */
  { id: "pachata-especial", categoria: "pachatas", nombre: "Especial", descripcion: "Pachata con jamón, queso, lechuga y tomate.", precio: 14500, imagen: REAL.pachataGenerica },
  { id: "pachata-completa", categoria: "pachatas", nombre: "Completa", descripcion: "Pachata con jamón, queso, huevo, lechuga y tomate.", precio: 15000, imagen: REAL.pachataGenerica, destacado: true, etiqueta: "Más pedido" },
  { id: "pachata-kactus", categoria: "pachatas", nombre: "Kactus", descripcion: "La pachata de la casa, con todos los toppings.", precio: 16000, imagen: REAL.pachataGenerica, etiqueta: "Recomendada" },
  { id: "pachata-super", categoria: "pachatas", nombre: "Super Pachata", precio: 21000, descripcion: "Doble carne, doble queso y todos los toppings.", imagen: REAL.pachataGenerica },
  { id: "pachata-cheddar", categoria: "pachatas", nombre: "Cheddar", descripcion: "Pachata con abundante salsa cheddar.", precio: 15800, imagen: REAL.pachataGenerica },

  /* ================= LOMOS ================= */
  { id: "lomo-especial", categoria: "lomos", nombre: "Especial", descripcion: "Lomito con jamón, queso, lechuga y tomate.", precio: 17500, imagen: PLACEHOLDER.lomito },
  { id: "lomo-completo", categoria: "lomos", nombre: "Completo", descripcion: "Lomito con jamón, queso, huevo, lechuga y tomate.", precio: 18000, imagen: PLACEHOLDER.lomito, destacado: true, etiqueta: "Más pedido" },
  { id: "lomo-kactus", categoria: "lomos", nombre: "Kactus", descripcion: "El lomito de la casa, con todos los toppings.", precio: 19000, imagen: PLACEHOLDER.lomito, etiqueta: "Recomendado" },
  { id: "lomo-super", categoria: "lomos", nombre: "Super Lomo", descripcion: "Doble carne, doble queso y todos los toppings.", precio: 26000, imagen: PLACEHOLDER.lomito },
  { id: "lomo-vegetariano", categoria: "lomos", nombre: "Vegetariano", descripcion: "Lomito vegetariano con lechuga, tomate y salsa.", precio: 9500, imagen: PLACEHOLDER.lomito },

  /* ================= PIZZAS ================= */
  { id: "pizza-especial", categoria: "pizzas", nombre: "Especial (grande)", descripcion: "Pizza especial de la casa, tamaño grande.", precio: 14300, imagen: REAL.pizzaEspecial },
  { id: "pizza-muzzarella", categoria: "pizzas", nombre: "Muzzarella (grande)", descripcion: "Clásica muzzarella, tamaño grande.", precio: 12300, imagen: REAL.pizzaMuzzarella, destacado: true, etiqueta: "Más pedida" },
  { id: "pizza-fugazzeta", categoria: "pizzas", nombre: "Fugazzeta (grande)", descripcion: "Muzzarella y cebolla, tamaño grande.", precio: 12300, imagen: PLACEHOLDER.pizza },
  { id: "pizza-roquefort", categoria: "pizzas", nombre: "Roquefort (grande)", descripcion: "Muzzarella con roquefort, tamaño grande.", precio: 15300, imagen: REAL.pizzaRoquefort },
  { id: "pizza-panceta", categoria: "pizzas", nombre: "Panceta (grande)", descripcion: "Muzzarella con panceta crocante, tamaño grande.", precio: 15300, imagen: REAL.pizzaPanceta },
  { id: "pizza-napolitana", categoria: "pizzas", nombre: "Napolitana (grande)", descripcion: "Muzzarella, tomate, ajo y albahaca, tamaño grande.", precio: 12300, imagen: REAL.pizzaNapolitana },
  { id: "pizza-lomo", categoria: "pizzas", nombre: "Lomo Pizza (grande)", descripcion: "Pizza con generosa cobertura de lomo. Tamaño grande.", precio: 44500, imagen: REAL.pizzaLomo, etiqueta: "Premium" },
  { id: "pizza-media-muza", categoria: "pizzas", nombre: "Media Muzzarella", descripcion: "Clásica muzzarella, media pizza.", precio: 6300, imagen: REAL.pizzaMuzzarella },
  { id: "pizza-media-especial", categoria: "pizzas", nombre: "Media Especial", descripcion: "Pizza especial de la casa, media pizza.", precio: 7300, imagen: REAL.pizzaEspecial },
  { id: "pizza-media-fugazzeta", categoria: "pizzas", nombre: "Media Fugazzeta", descripcion: "Muzzarella y cebolla, media pizza.", precio: 7300, imagen: REAL.pizzaMuzzarella },
  { id: "pizza-media-panceta", categoria: "pizzas", nombre: "Media Panceta", descripcion: "Muzzarella con panceta crocante, media pizza.", precio: 8500, imagen: REAL.pizzaPanceta },
  { id: "pizza-media-napolitana", categoria: "pizzas", nombre: "Media Napolitana", descripcion: "Muzzarella, tomate, ajo y albahaca, media pizza.", precio: 7300, imagen: REAL.pizzaNapolitana },
  { id: "pizza-media-lomo", categoria: "pizzas", nombre: "Media Lomo Pizza", descripcion: "Pizza con cobertura de lomo, media pizza.", precio: 28500, imagen: REAL.pizzaLomo },

  /* ================= CHORRILLANA ================= */
  { id: "chorrillana-clasica", categoria: "chorrillana", nombre: "Chorrillana", descripcion: "Papas fritas con carne, cebolla, huevo y queso. Para compartir.", precio: 23000, imagen: REAL.chorrillana },

  /* ================= MENÚ SIN TACC ================= */
  { id: "tacc-tarta-jamonqueso", categoria: "sintacc", nombre: "Tarta Jamón y Queso", descripcion: "Tarta apta sin TACC de jamón y queso.", precio: 15000, imagen: REAL.tartaJamonQueso },
  { id: "tacc-tarta-verduras", categoria: "sintacc", nombre: "Tarta de Verduras", descripcion: "Tarta apta sin TACC de verduras de estación.", precio: 15000, imagen: REAL.tartaVerduras },
  { id: "tacc-empanadas-jamonqueso", categoria: "sintacc", nombre: "Empanadas Jamón y Queso (½ docena)", descripcion: "Media docena de empanadas aptas sin TACC.", precio: 14500, imagen: REAL.empanadasJamonQueso },
  { id: "tacc-empanadas-carne", categoria: "sintacc", nombre: "Empanadas Carne (½ docena)", descripcion: "Media docena de empanadas de carne aptas sin TACC.", precio: 14500, imagen: REAL.empanadasCarne },
  { id: "tacc-lomo", categoria: "sintacc", nombre: "Lomo", descripcion: "Lomito apto sin TACC.", precio: 19500, imagen: PLACEHOLDER.lomito },
  { id: "tacc-hamburguesa", categoria: "sintacc", nombre: "Hamburguesa", descripcion: "Hamburguesa apta sin TACC.", precio: 7000, imagen: PLACEHOLDER.burger },

  /* ================= TOSTADOS Y BARROLUCO ================= */
  { id: "otros-tostado", categoria: "otros", nombre: "Tostado", descripcion: "Tostado de jamón y queso clásico.", precio: 6500, imagen: REAL.tostado },
  { id: "otros-barroluco", categoria: "otros", nombre: "Barroluco", descripcion: "Barroluco de la casa, bien generoso.", precio: 18000, imagen: REAL.barroluco, etiqueta: "Recomendado" },
];
