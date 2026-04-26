/* auth.js - Motor de autenticación */
const DB_USER_KEY = 'saana_user_data_v3';
const SESSION_KEY = 'saana_active_session';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('form-registro-saana')) initRegistro();
    if (document.getElementById('form-login-saana')) initLogin();
    if (document.getElementById('btn-logout')) initCatalogo();
});

// --- REGISTRO ---
function initRegistro() {
    const form = document.getElementById('form-registro-saana');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            nombre: document.getElementById('reg-nombre').value.trim(),
            apellido: document.getElementById('reg-apellido').value.trim(),
            email: document.getElementById('reg-email').value.toLowerCase().trim(),
            pass1: document.getElementById('reg-password').value,
            pass2: document.getElementById('reg-confirm-password').value
        };
        if (!data.email || !data.pass1) { alert("Completa los campos obligatorios."); return; }
        if (data.pass1 !== data.pass2) { alert("Las contraseñas no coinciden."); return; }
        
        const userToSave = { ...data }; delete userToSave.pass1; delete userToSave.pass2;
        userToSave.password = data.pass1;
        try {
            localStorage.setItem(DB_USER_KEY, JSON.stringify(userToSave));
            alert("¡Registro exitoso! Inicia sesión.");
            window.location.href = 'login.html';
        } catch (error) { console.error(error); alert("Error al guardar datos."); }
    });
}

// --- LOGIN ---
function initLogin() {
    const form = document.getElementById('form-login-saana');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('login-email').value.toLowerCase().trim();
        const passInput = document.getElementById('login-password').value;
        
        const storedData = localStorage.getItem(DB_USER_KEY);
        if (!storedData) { alert("Usuario no encontrado. Regístrate."); return; }
        
        const registeredUser = JSON.parse(storedData);
        if (emailInput === registeredUser.email && passInput === registeredUser.password) {
            sessionStorage.setItem(SESSION_KEY, 'active');
            window.location.href = 'catalogo.html';
        } else { alert("Correo o contraseña incorrectos."); }
    });
}

// --- CATÁLOGO ---
function initCatalogo() {
    // No hacemos nada con el nombre del usuario aquí.
    const logoutBtn = document.getElementById('btn-logout');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem(SESSION_KEY); 
            window.location.href = 'login.html';
        });
    }
}
