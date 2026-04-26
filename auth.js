/* 
    auth.js - Motor de autenticación para SAANA (GitHub Pages)
    Utiliza localStorage para simular una base de datos.
*/

// CLAVES PARA LOCALSTORAGE (Para no mezclar datos)
const DB_USER_KEY = 'saana_user_data_v3';    // Datos del registro
const SESSION_KEY = 'saana_active_session';  // Sesión activa

document.addEventListener('DOMContentLoaded', () => {
    // Identificar en qué página estamos y activar la función correspondiente
    if (document.getElementById('form-registro-saana')) initRegistro();
    if (document.getElementById('form-login-saana')) initLogin();
    // Usamos el botón de logout para saber que estamos en el catálogo
    if (document.getElementById('btn-logout')) initCatalogo();
});


// --- FUNCIONALIDAD DE REGISTRO (IGUAL QUE ANTES) ---
function initRegistro() {
    const form = document.getElementById('form-registro-saana');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Intentando registrar...");

        // 1. Recolectar datos
        const data = {
            nombre: document.getElementById('reg-nombre').value.trim(),
            apellido: document.getElementById('reg-apellido').value.trim(),
            email: document.getElementById('reg-email').value.toLowerCase().trim(),
            pass1: document.getElementById('reg-password').value,
            pass2: document.getElementById('reg-confirm-password').value
        };

        // 2. Validaciones
        if (!data.email || !data.pass1) {
             alert("Por favor completa los campos obligatorios."); return;
        }
        if (data.pass1 !== data.pass2) {
            alert("Error: Las contraseñas no coinciden."); return;
        }

        // 3. Guardar usuario
        const userToSave = { ...data }; 
        delete userToSave.pass1; delete userToSave.pass2;
        userToSave.password = data.pass1;

        try {
            localStorage.setItem(DB_USER_KEY, JSON.stringify(userToSave));
            alert("¡Registro exitoso! Ahora por favor inicia sesión.");
            window.location.href = 'login.html';
        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar los datos.");
        }
    });
}


// --- FUNCIONALIDAD DE LOGIN (IGUAL QUE ANTES) ---
function initLogin() {
    const form = document.getElementById('form-login-saana');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Intentando login...");

        const emailInput = document.getElementById('login-email').value.toLowerCase().trim();
        const passInput = document.getElementById('login-password').value;

        // 1. Recuperar datos guardados
        const storedData = localStorage.getItem(DB_USER_KEY);
        
        if (!storedData) {
            alert("Error: Usuario no encontrado. Por favor regístrate primero."); return;
        }

        const registeredUser = JSON.parse(storedData);

        // 2. Comparar credenciales
        if (emailInput === registeredUser.email && passInput === registeredUser.password) {
            // Login exitoso: Creamos la sesión (aunque no mostremos el nombre, es útil saber que está logueado)
            sessionStorage.setItem(SESSION_KEY, 'active');
            console.log("Login correcto. Redirigiendo...");
            window.location.href = 'catalogo.html';
        } else {
            alert("Error: Correo o contraseña incorrectos.");
        }
    });
}


// --- FUNCIONALIDAD DEL CATÁLOGO (MODIFICADA) ---
function initCatalogo() {
    // YA NO BUSCAMOS NI MOSTRAMOS EL NOMBRE DEL USUARIO.
    console.log("Página de catálogo cargada.");

    // Funcionalidad del botón Log Out (ESTO SÍ SE MANTIENE)
    const logoutBtn = document.getElementById('btn-logout');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Borramos la sesión
            sessionStorage.removeItem(SESSION_KEY); 
            // Redirigimos al login
            window.location.href = 'login.html';
        });
    }
}
