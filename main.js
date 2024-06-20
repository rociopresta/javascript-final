document.addEventListener('DOMContentLoaded', () => {
    fetch('/productos.json')
        .then(response => response.json())
        .then(data => mostrarProductos(data));
});

const carrito = [];
let precioTotal = 0;

function mostrarProductos(productos) {
    const listaProductos = document.getElementById('lista-productos');

    productos.forEach(producto => {
        const productElement = document.createElement('div');
        productElement.classList.add('producto');

        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        productElement.appendChild(imagen);

        const nombreProducto = document.createElement('h2');
        nombreProducto.textContent = producto.nombre;
        productElement.appendChild(nombreProducto);

        const descripcion = document.createElement('p');
        descripcion.textContent = producto.descripcion;
        productElement.appendChild(descripcion);

        const precio = document.createElement('p');
        precio.textContent = `Precio: $${producto.precio.toFixed(2)}`;
        productElement.appendChild(precio);

        const stock = document.createElement('p');
        stock.textContent = `Stock: ${producto.stock}`;
        productElement.appendChild(stock);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const botonAgregar = document.createElement('button');
        botonAgregar.textContent = 'Agregar al Carrito';
        botonAgregar.addEventListener('click', () => {
            agregarAlCarrito(producto);
        });
        buttonContainer.appendChild(botonAgregar);

        productElement.appendChild(buttonContainer);

        listaProductos.appendChild(productElement);
    });
}

function agregarAlCarrito(producto) {
    const productoEnCarrito = carrito.find(item => item.id === producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    calcularTotal();
    actualizarCarrito();
}

function quitarDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        const producto = carrito[index];
        if (producto.cantidad > 1) {
            producto.cantidad--;
        } else {
            carrito.splice(index, 1);
        }
    }

    calcularTotal();
    actualizarCarrito();
}

function calcularTotal() {
    precioTotal = carrito.reduce((total, producto) => {
        return total + (producto.precio * producto.cantidad);
    }, 0);

    const precioTotalElemento = document.getElementById('precio-total');
    precioTotalElemento.textContent = precioTotal.toFixed(2);
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const itemCarrito = document.createElement('li');
        itemCarrito.innerHTML = `
            ${producto.nombre} - $${producto.precio.toFixed(2)} x ${producto.cantidad}
            <button class="btn-quitar" onclick="quitarDelCarrito(${producto.id})">Quitar</button>
        `;
        listaCarrito.appendChild(itemCarrito);
    });
}

document.getElementById('comprar').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
    } else {
        const nombresProductos = carrito.map(producto => producto.nombre).join(', ');
        alert(`Compra realizada por un total de $${precioTotal.toFixed(2)}. Productos: ${nombresProductos}`);
        carrito.length = 0;
        actualizarCarrito();
    }
});
