/* 
    auth.js - Motor de autenticación para SAANA (GitHub Pages)
    Utiliza localStorage para simular una base de datos.
*/

// CLAVES PARA LOCALSTORAGE (Para no mezclar datos)
const DB_USER_KEY = 'saana_user_data_v2';    // Aquí se guardan los datos del registro
const SESSION_KEY = 'saana_active_session';  // Aquí se guarda quién está logueado ahora

document.addEventListener('DOMContentLoaded', () => {
    // Identificar en qué página estamos y activar la función correspondiente
    if (document.getElementById('form-registro-saana')) initRegistro();
    if (document.getElementById('form-login-saana')) initLogin();
    if (document.getElementById('sidebar-user-name')) initCatalogo();
});


// --- FUNCIONALIDAD DE REGISTRO ---
function initRegistro() {
    const form = document.getElementById('form-registro-saana');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Intentando registrar...");

        // 1. Recolectar datos
        const data = {
            nombre: document.getElementById('reg-nombre').value.trim(),
            apellido: document.getElementById('reg-apellido').value.trim(),
            // Combinamos la fecha
            dob: `${document.getElementById('reg-dia').value}/${document.getElementById('reg-mes').value}/${document.getElementById('reg-ano').value}`,
            email: document.getElementById('reg-email').value.toLowerCase().trim(),
            telefono: document.getElementById('reg-telefono').value.trim(),
            pass1: document.getElementById('reg-password').value,
            pass2: document.getElementById('reg-confirm-password').value
        };

        // 2. Validaciones
        if (!data.nombre || !data.email || !data.pass1) {
             alert("Por favor completa los campos obligatorios."); return;
        }
        if (data.pass1 !== data.pass2) {
            alert("Error: Las contraseñas no coinciden."); return;
        }

        // 3. Guardar usuario (Excluyendo la confirmación de password)
        const userToSave = { ...data }; 
        delete userToSave.pass1; delete userToSave.pass2;
        userToSave.password = data.pass1; // Guardamos la contraseña final

        try {
            // Guardamos en localStorage (simulación de base de datos)
            localStorage.setItem(DB_USER_KEY, JSON.stringify(userToSave));
            alert("¡Registro exitoso! Ahora por favor inicia sesión.");
            window.location.href = 'login.html';
        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar los datos en el navegador.");
        }
    });
}


// --- FUNCIONALIDAD DE LOGIN ---
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
            // Login exitoso: Creamos la sesión con nombre y apellido
            sessionStorage.setItem(SESSION_KEY, registeredUser.nombre + " " + registeredUser.apellido);
            console.log("Login correcto. Redirigiendo...");
            window.location.href = 'catalogo.html';
        } else {
            alert("Error: Correo o contraseña incorrectos.");
        }
    });
}


// --- FUNCIONALIDAD DEL CATÁLOGO ---
function initCatalogo() {
    // 1. Verificar si hay sesión activa
    const activeUserName = sessionStorage.getItem(SESSION_KEY);
    const userNameDisplay = document.getElementById('sidebar-user-name');

    if (activeUserName) {
        // Si está logueado, mostramos su nombre en el sidebar
        if (userNameDisplay) userNameDisplay.textContent = activeUserName;
    } else {
        // Si NO está logueado
        if (userNameDisplay) userNameDisplay.textContent = "Invitado";
        // Opcional: redirigir al login
        // window.location.href = 'login.html'; 
    }

    // Funcionalidad del botón Log Out
    const logoutBtn = document.getElementById('btn-logout');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem(SESSION_KEY); // Cerrar sesión
            window.location.href = 'login.html'; // Volver al login
        });
    }
}
