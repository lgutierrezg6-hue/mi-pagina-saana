/*
    auth.js - Motor funcional actualizado
*/

// --- CLAVES DE ALMACENAMIENTO ---
const KEY_DATOS_USUARIO = 'saana_user_data_final';
const KEY_SESION_ACTIVA = 'saana_active_session';

// --- INICIALIZADOR ---
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('form-registro-saana')) initRegistro();
    if (document.getElementById('form-login-saana')) initLogin();
    
    // Si estamos en el catálogo (detectado por el grid de productos)
    if (document.querySelector('.product-grid')) {
        initCatalogo();
    }
});


// --- 1. REGISTRO (Sin cambios importantes) ---
function initRegistro() {
    const form = document.getElementById('form-registro-saana');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('reg-nombre').value.trim();
        const apellido = document.getElementById('reg-apellido').value.trim();
        const email = document.getElementById('reg-email').value.toLowerCase().trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) { alert("Las contraseñas no coinciden."); return; }
        if (!nombre || !email || !password) { alert("Por favor completa los campos obligatorios."); return; }

        // Guardamos el nombre completo para usarlo luego
        const nuevoUsuario = {
            nombreCompleto: `${nombre} ${apellido}`,
            email: email,
            password: password
        };

        localStorage.setItem(KEY_DATOS_USUARIO, JSON.stringify(nuevoUsuario));
        alert("¡Registro exitoso! Inicia sesión.");
        window.location.href = 'login.html';
    });
}


// --- 2. LOGIN (Sin cambios importantes) ---
function initLogin() {
    const form = document.getElementById('form-login-saana');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('login-email').value.toLowerCase().trim();
        const passInput = document.getElementById('login-password').value;

        const datosJSON = localStorage.getItem(KEY_DATOS_USUARIO);
        if (!datosJSON) { alert("Usuario no encontrado."); return; }

        const usuario = JSON.parse(datosJSON);
        
        if (emailInput === usuario.email && passInput === usuario.password) {
            // Login exitoso: Creamos la sesión
            sessionStorage.setItem(KEY_SESION_ACTIVA, 'true');
            window.location.href = 'catalogo.html';
        } else {
            alert("Credenciales incorrectas.");
        }
    });
}


// --- 3. FUNCIONALIDAD DEL CATÁLOGO (¡NUEVO!) ---
function initCatalogo() {
    // A. VERIFICACIÓN DE SEGURIDAD (Guardia)
    if (!sessionStorage.getItem(KEY_SESION_ACTIVA)) {
        window.location.href = 'login.html';
        return; // Detenemos la ejecución si no hay sesión
    }

    // B. MOSTRAR NOMBRE DE USUARIO EN SIDEBAR
    const userNameDisplay = document.getElementById('user-name-display');
    const datosJSON = localStorage.getItem(KEY_DATOS_USUARIO);
    if (datosJSON && userNameDisplay) {
        const usuario = JSON.parse(datosJSON);
        // Usamos el nombre guardado o "Usuario" si no hay nombre
        userNameDisplay.textContent = usuario.nombreCompleto || "Usuario";
    }

    // C. FUNCIONALIDAD DEL MODAL DE PRODUCTOS
    const modal = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const productCards = document.querySelectorAll('.product-card');

    // Elementos dentro del modal
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDesc = document.getElementById('modal-desc');

    // Función para abrir el modal con datos
    const openModal = (card) => {
        // Leemos los datos de los atributos 'data-' de la tarjeta clickeada
        const name = card.getAttribute('data-name');
        const price = card.getAttribute('data-price');
        const img = card.getAttribute('data-img');
        const desc = card.getAttribute('data-desc');

        // Rellenamos el modal con esos datos
        modalImg.src = img;
        modalTitle.textContent = name;
        modalPrice.textContent = price;
        modalDesc.textContent = desc;

        // Mostramos el modal
        modal.classList.add('active');
    };

    // Añadimos el evento de clic a cada tarjeta
    productCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    // Cerrar el modal al dar clic en la 'X'
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Cerrar el modal al dar clic fuera del contenido (en el fondo oscuro)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });


    // D. FUNCIONALIDAD DE LOGOUT
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem(KEY_SESION_ACTIVA);
            window.location.href = 'login.html';
        });
    }
}
