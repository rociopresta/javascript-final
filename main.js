let carrito = [];

/*Tarjetas de productos*/
function cargarProductos() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

function mostrarProductos(productos) {
    const contenedorProductos = document.getElementById('productos');
    productos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');
        divProducto.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <p>Stock: ${producto.stock}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        `;
        contenedorProductos.appendChild(divProducto);
    });
}
/*Carrito*/
function agregarAlCarrito(idProducto) {
    fetch('productos.json')
        .then(response => response.json())
        .then(productos => {
            const producto = productos.find(p => p.id === idProducto);
            const productoEnCarrito = carrito.find(p => p.id === idProducto);

            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }

            mostrarCarrito();
        })
        .catch(error => console.error('Error al agregar producto al carrito:', error));
}

function mostrarCarrito() {
    const contenedorCarrito = document.getElementById('carrito');
    contenedorCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const divItemCarrito = document.createElement('div');
        divItemCarrito.classList.add('item-carrito');
        divItemCarrito.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Precio: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
            <button onclick="quitarDelCarrito(${producto.id})">Quitar del Carrito</button>
        `;
        contenedorCarrito.appendChild(divItemCarrito);
    });
}

function quitarDelCarrito(idProducto) {
    const productoEnCarrito = carrito.find(p => p.id === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad--;

        if (productoEnCarrito.cantidad === 0) {
            carrito = carrito.filter(p => p.id !== idProducto);
        }

        mostrarCarrito();
    }
}

document.addEventListener('DOMContentLoaded', cargarProductos);