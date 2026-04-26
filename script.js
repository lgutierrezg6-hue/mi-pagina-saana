// 1. NUESTRA "BASE DE DATOS" FALSA
// Creamos una lista (array) de objetos. Cada objeto es un producto.
const productsDB = [
    {
        id: 1,
        name: "Reloj Aura-Fit",
        price: 180000,
        imageColor: "#d1c4e9" // Usamos colores en vez de imágenes reales por ahora
    },
    {
        id: 2,
        name: "Case 360º Protection",
        price: 25000,
        imageColor: "#b39ddb"
    },
    {
        id: 3,
        name: "AirPods Pro",
        price: 75000,
        imageColor: "#9575cd"
    },
    {
        id: 4,
        name: "Cargador Inalámbrico",
        price: 45000,
        imageColor: "#7e57c2"
    },
    {
        id: 5,
        name: "Soporte de Laptop",
        price: 120000,
        imageColor: "#673ab7"
    }
];


// 2. FUNCIÓN PARA DIBUJAR LOS PRODUCTOS EN LA PANTALLA
// Esta función toma la lista de arriba y crea el HTML de las tarjetitas.
function renderProducts() {
    // Buscamos el contenedor en el HTML donde vamos a poner los productos
    const container = document.getElementById('products-container');
    
    // Limpiamos el contenedor por si acaso
    container.innerHTML = '';

    // Recorremos cada producto de nuestra "base de datos"
    productsDB.forEach(product => {
        // Creamos el HTML de una tarjeta para cada producto
        const productHTML = `
            <div class="product-card">
                <div class="product-image-placeholder" style="background-color: ${product.imageColor};"></div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$ ${product.price.toLocaleString()}</p>
                    <!-- El botón tiene un "onclick" que llama a la función de agregar al carrito (la haremos en la próxima fase) -->
                    <button class="add-btn" onclick="addToCart(${product.id})">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        // Añadimos esta tarjeta al contenedor principal
        container.innerHTML += productHTML;
    });
}


// 3. INICIALIZACIÓN
// Esto se ejecuta cuando la página termina de cargar.
// Le decimos: "¡Dibuja los productos ahora!"
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    console.log("Página cargada y productos renderizados.");
});

// Función temporal para que no de error al hacer clic (la completaremos en la Fase 2)
function addToCart(productId) {
    alert(`¡Producto ID ${productId} agregado al carrito (simulado)! Pronto funcionará de verdad.`);
}
