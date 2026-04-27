/* auth.js - Motor de funcionalidad */
const DB_USER_KEY = 'saana_user_data_v3';
const SESSION_KEY = 'saana_active_session';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('form-registro-saana')) initRegistro();
    if (document.getElementById('form-login-saana')) initLogin();
    // Si estamos en el catálogo, inicializamos su funcionalidad
    if (document.querySelector('.product-grid')) initCatalogo();
});

// --- REGISTRO Y LOGIN (SIN CAMBIOS) ---
function initRegistro() { /* ... el mismo código de registro de antes ... */ }
function initLogin() { /* ... el mismo código de login de antes ... */ }

// --- NUEVA FUNCIONALIDAD DEL CATÁLOGO (POP-UP) ---
function initCatalogo() {
    console.log("Catálogo iniciado.");
    const modal = document.getElementById('product-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cards = document.querySelectorAll('.product-card');

    // Elementos dentro del modal para rellenar
    const mImg = document.getElementById('modal-img');
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');
    const mPrice = document.getElementById('modal-price');

    // Función para abrir modal
    const openModal = (card) => {
        // Leemos los datos guardados en el HTML de la tarjeta
        mImg.src = card.getAttribute('data-imagen');
        mTitle.textContent = card.getAttribute('data-nombre');
        mDesc.textContent = card.getAttribute('data-descripcion');
        mPrice.textContent = card.getAttribute('data-precio');
        // Mostramos el modal
        modal.classList.add('active');
    };

    // Al hacer clic en una tarjeta
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Si no hicieron clic en el botón pequeño de carrito, abrimos el modal
            if(!e.target.closest('.add-to-cart-btn')) {
                openModal(card);
            }
        });
    });

    // Cerrar modal
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('active');
    });
    
     // Logout
    document.getElementById('btn-logout')?.addEventListener('click', (e) => {
        sessionStorage.removeItem(SESSION_KEY); window.location.href = 'login.html';
    });
}
