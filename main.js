document.addEventListener("DOMContentLoaded", function () {
  const btnAgregarPersonalizado = document.getElementById(
    "btnAgregarPersonalizado"
  );
  const nombreProductoInput = document.getElementById("nombreProducto");
  const precioProductoInput = document.getElementById("precioProducto");
  const stockProductoInput = document.getElementById("stockProducto");
  const imagenProductoInput = document.getElementById("imagenProducto");
  const listaProductosDiv = document.getElementById("listaProductos");
  const listaCarritoDiv = document.getElementById("listaCarrito");
  const carritoIcono = document.getElementById("carritoIcono");
  const carritoModal = document.getElementById("carritoModal");
  const cerrarCarrito = document.getElementById("cerrarCarrito");
  const carritoCantidad = document.getElementById("carritoCantidad");
  const buscadorProductoInput = document.getElementById("buscadorProducto");

  let carrito = [];
  let productos = [];

  carritoIcono.addEventListener("click", () => {
    carritoModal.style.display = "flex";
    mostrarCarrito();
  });

  cerrarCarrito.addEventListener("click", () => {
    carritoModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === carritoModal) {
      carritoModal.style.display = "none";
    }
  });

  cargarProductosDesdeAPI();

  btnAgregarPersonalizado.addEventListener("click", () => {
    const nombreProducto = nombreProductoInput.value.trim();
    const precioProducto = parseFloat(precioProductoInput.value.trim());
    const stockProducto = parseInt(stockProductoInput.value.trim(), 10);
    const imagenProducto = imagenProductoInput.value.trim();

    if (
      validarEntradas(
        nombreProducto,
        precioProducto,
        stockProducto,
        imagenProducto
      )
    ) {
      agregarProducto({
        nombre: nombreProducto,
        precio: precioProducto.toFixed(2),
        stock: stockProducto,
        imagen: imagenProducto,
      });
      limpiarInputs();
    } else {
      alert("Por favor, completa todos los campos correctamente.");
    }
  });

  buscadorProductoInput.addEventListener("input", function () {
    mostrarProductos(this.value.toLowerCase());
  });

  function validarEntradas(nombre, precio, stock, imagen) {
    return (
      nombre !== "" &&
      !isNaN(precio) &&
      precio > 0 &&
      Number.isInteger(stock) &&
      stock > 0 &&
      imagen !== ""
    );
  }

  function limpiarInputs() {
    nombreProductoInput.value = "";
    precioProductoInput.value = "";
    stockProductoInput.value = "";
    imagenProductoInput.value = "";
  }

  function agregarProducto(producto) {
    productos.push(producto);
    mostrarProductos();
  }

  function actualizarBotonesAgregarCarrito() {
    document.querySelectorAll(".btnAgregarCarrito").forEach((boton, index) => {
      boton.addEventListener("click", () => agregarAlCarrito(index));
    });
  }

  function actualizarBotonesEliminar() {
    document.querySelectorAll(".btnEliminar").forEach((boton, index) => {
      boton.addEventListener("click", () => eliminarProducto(index));
    });
  }

  function agregarAlCarrito(index) {
    const producto = productos[index];
    carrito.push(producto);
    carritoCantidad.textContent = carrito.length;
    mostrarCarrito();
  }

  function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    carritoCantidad.textContent = carrito.length;
    mostrarCarrito();
  }

  function mostrarCarrito() {
    listaCarritoDiv.innerHTML = carrito
      .map(
        (item, index) => `
                <div class="item-carrito">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <p><strong>Producto:</strong> ${item.nombre}</p>
                    <p><strong>Precio:</strong> $${item.precio}</p>
                    <button class="btnEliminarCarrito" data-index="${index}">Eliminar</button>
                </div>
            `
      )
      .join("");

    document.querySelectorAll(".btnEliminarCarrito").forEach((boton) => {
      boton.addEventListener("click", () =>
        eliminarDelCarrito(boton.dataset.index)
      );
    });
  }

  function mostrarProductos(filtro = "") {
    listaProductosDiv.innerHTML = productos
      .filter((item) => item.nombre.toLowerCase().includes(filtro))
      .map(
        (item, index) => `
                <div class="producto">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <p><strong>Producto:</strong> ${item.nombre}</p>
                    <p><strong>Precio:</strong> $${item.precio}</p>
                    <p><strong>Stock:</strong> ${item.stock}</p>
                    <button class="btnAgregarCarrito">Agregar al Carrito</button>
                    <button class="btnEliminar">Eliminar</button>
                </div>
            `
      )
      .join("");

    actualizarBotonesAgregarCarrito();
    actualizarBotonesEliminar();
  }

  function eliminarProducto(index) {
    productos.splice(index, 1);
    mostrarProductos();
  }

  function cargarProductosDesdeAPI() {
    fetch("https://fakestoreapi.com/products?limit=9")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((producto) => {
          agregarProducto({
            nombre: producto.title,
            precio: producto.price.toFixed(2),
            stock: Math.floor(Math.random() * 10) + 1,
            imagen: producto.image,
          });
        });
      })
      .catch((error) => {
        console.error("Error al cargar los productos desde la API:", error);
      });
  }
});
