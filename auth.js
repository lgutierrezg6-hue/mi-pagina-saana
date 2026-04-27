/*
    auth.js - Motor funcional completo
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


// --- 1. REGISTRO ---
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
        if (!nombre || !apellido || !email || !password) { alert("Por favor completa todos los campos."); return; }

        // Guardamos el nombre completo para usarlo luego
        const nuevoUsuario = {
            nombreCompleto: `${nombre} ${apellido}`,
            email: email,
            password: password
        };

        localStorage.setItem(KEY_DATOS_USUARIO, JSON.stringify(nuevoUsuario));
        alert("¡Registro exitoso! Ahora inicia sesión.");
        window.location.href = 'login.html';
    });
}


// --- 2. LOGIN ---
function initLogin() {
    // Limpiar sesión previa al entrar al login
    sessionStorage.removeItem(KEY_SESION_ACTIVA);

    const form = document.getElementById('form-login-saana');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('login-email').value.toLowerCase().trim();
        const passInput = document.getElementById('login-password').value;

        const datosJSON = localStorage.getItem(KEY_DATOS_USUARIO);
        if (!datosJSON) { alert("Usuario no registrado. Por favor crea una cuenta."); return; }

        const usuario = JSON.parse(datosJSON);
        
        if (emailInput === usuario.email && passInput === usuario.password) {
            // Login exitoso: Creamos el "pase" de sesión
            sessionStorage.setItem(KEY_SESION_ACTIVA, 'true');
            window.location.href = 'catalogo.html';
        } else {
            alert("Correo o contraseña incorrectos.");
        }
    });
}


// --- 3. FUNCIONALIDAD DEL CATÁLOGO ---
function initCatalogo() {
    // A. GUARDIA DE SEGURIDAD
    if (!sessionStorage.getItem(KEY_SESION_ACTIVA)) {
        window.location.href = 'login.html';
        return;
    }

    // B. MOSTRAR NOMBRE REAL DEL USUARIO EN SIDEBAR
    const userNameDisplay = document.getElementById('user-name-display');
    const datosJSON = localStorage.getItem(KEY_DATOS_USUARIO);
    if (datosJSON && userNameDisplay) {
        const usuario = JSON.parse(datosJSON);
        // Si hay nombre guardado lo usamos, si no, ponemos "Usuario"
        userNameDisplay.textContent = usuario.nombreCompleto || "Usuario";
    }

    // C. FUNCIONALIDAD DEL MODAL (Ventana emergente)
    const modal = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const productCards = document.querySelectorAll('.product-card');

    // Elementos dentro del modal
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDesc = document.getElementById('modal-desc');

    // Función para abrir el modal con los datos de la tarjeta
    const openModal = (card) => {
        modalImg.src = card.getAttribute('data-img');
        modalTitle.textContent = card.getAttribute('data-name');
        modalPrice.textContent = card.getAttribute('data-price');
        modalDesc.textContent = card.getAttribute('data-desc');
        modal.classList.add('active'); // Mostrar modal
    };

    // Añadimos el clic a cada tarjeta
    productCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    // Cerrar modal con la 'X' o clic fuera
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });


    // D. FUNCIONALIDAD DE LOGOUT (Cerrar Sesión)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem(KEY_SESION_ACTIVA); // Romper el pase
            window.location.href = 'login.html';
        });
    }
}
