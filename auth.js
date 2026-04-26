/* 
    auth.js - Motor de autenticación y funcionalidad del catálogo SAANA
*/

const DB_USER_KEY = 'saana_user_data_v3';
const SESSION_KEY = 'saana_active_session';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('form-registro-saana')) initRegistro();
    if (document.getElementById('form-login-saana')) initLogin();
    // Si existe el grid de productos, estamos en el catálogo
    if (document.querySelector('.product-grid')) initCatalogo();
});


// --- FUNCIONALIDAD DE REGISTRO (VALIDACIÓN MEJORADA) ---
function initRegistro() {
    const form = document.getElementById('form-registro-saana');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Intentando registrar...");

        // 1. Recolectar TODOS los datos
        const nombre = document.getElementById('reg-nombre').value.trim();
        const apellido = document.getElementById('reg-apellido').value.trim();
        const dia = document.getElementById('reg-dia').value;
        const mes = document.getElementById('reg-mes').value;
        const anio = document.getElementById('reg-anio').value;
        const email = document.getElementById('reg-email').value.toLowerCase().trim();
        const telefono = document.getElementById('reg-telefono').value.trim();
        const pass1 = document.getElementById('reg-password').value;
        const pass2 = document.getElementById('reg-confirm-password').value;

        // 2. Validaciones ESTRICTAS (Todos los campos obligatorios)
        // Si alguno de estos campos está vacío (""), entra al if.
        if (!nombre || !apellido || !dia || !mes || !anio || !email || !telefono || !pass1) {
             alert("Por favor, completa TODOS los campos obligatorios para registrarte.");
             return; // Detiene el proceso
        }

        if (pass1 !== pass2) {
            alert("Error: Las contraseñas no coinciden."); return;
        }
        
        if (pass1.length < 6) {
             alert("La contraseña debe tener al menos 6 caracteres."); return;
        }

        // 3. Guardar usuario
        const userToSave = {
            nombre, apellido, 
            fechaNacimiento: `${dia}/${mes}/${anio}`,
            email, telefono, password: pass1
        };

        try {
            localStorage.setItem(DB_USER_KEY, JSON.stringify(userToSave));
            alert("¡Registro exitoso! Ahora por favor inicia sesión.");
            window.location.href = 'login.html';
        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar los datos en el navegador.");
        }
    });
}


// --- FUNCIONALIDAD DE LOGIN (IGUAL QUE ANTES) ---
function initLogin() {
    const form = document.getElementById('form-login-saana');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('login-email').value.toLowerCase().trim();
        const passInput = document.getElementById('login-password').value;
        
        const storedData = localStorage.getItem(DB_USER_KEY);
        if (!storedData) { alert("Usuario no encontrado. Por favor regístrate primero."); return; }

        const registeredUser = JSON.parse(storedData);

        if (emailInput === registeredUser.email && passInput === registeredUser.password) {
            sessionStorage.setItem(SESSION_KEY, 'active');
            window.location.href = 'catalogo.html';
        } else {
            alert("Error: Correo o contraseña incorrectos.");
        }
    });
}


// --- FUNCIONALIDAD DEL CATÁLOGO (NUEVA: MODAL DE DETALLES) ---
function initCatalogo() {
    console.log("Catálogo cargado. Inicializando modal...");

    // 1. Referencias a elementos del DOM
    const cards = document.querySelectorAll('.card');
    const modalOverlay = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // Elementos DENTRO del modal que vamos a actualizar
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description-text');
    const modalPrice = document.getElementById('modal-price');

    // 2. Función para abrir el modal con datos
    const openModal = (cardData) => {
        // Inyectamos los datos obtenidos de la tarjeta en el HTML del modal
        modalImg.src = cardData.image;
        modalTitle.textContent = cardData.name;
        modalDesc.textContent = cardData.description;
        modalPrice.textContent = cardData.price;
        
        // Mostramos el modal añadiendo la clase 'active'
        modalOverlay.classList.add('active');
        // Bloquear scroll del cuerpo mientras el modal está abierto
        document.body.style.overflow = 'hidden'; 
    };

    // 3. Función para cerrar el modal
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        // Reactivar scroll del cuerpo
        document.body.style.overflow = 'auto'; 
    };


    // 4. Añadir "Event Listeners" (Escuchadores de clics)

    // A cada tarjeta de producto
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Evitamos que el clic en el botón pequeño de "añadir al carrito" abra el modal
            if(e.target.closest('.btn-add-cart-small')) return;

            // Recolectamos los datos guardados en los atributos 'data-' del HTML de la tarjeta
            const cardData = {
                name: card.getAttribute('data-name'),
                price: card.getAttribute('data-price'),
                image: card.getAttribute('data-image'),
                description: card.getAttribute('data-description')
            };
            
            openModal(cardData);
        });
    });

    // Al botón de cerrar (X)
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Cerrar si se hace clic fuera del contenido del modal (en el fondo oscuro)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });


    // Funcionalidad del botón Log Out (Mantenida)
    const logoutBtn = document.getElementById('btn-logout');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem(SESSION_KEY); 
            window.location.href = 'login.html';
        });
    }
}
