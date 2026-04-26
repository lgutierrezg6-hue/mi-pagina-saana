// auth.js - El motor funcional para GitHub Pages

// --- CONSTANTES PARA EL ALMACENAMIENTO ---
// Usamos claves específicas para que no se mezclen con otros datos
const STORAGE_KEY_USER_DATA = 'saanaUserData_v1'; // Guarda email, pass y nombre
const STORAGE_KEY_SESSION = 'saanaUserSession_v1'; // Guarda quién está logueado actualmente

// --- FUNCIÓN 1: REGISTRO (Se ejecuta en registro.html) ---
function procesarRegistro(event) {
    event.preventDefault(); // Evita que la página se recargue
    console.log("Procesando registro...");

    // 1. Obtener los elementos del HTML por su ID
    // IMPORTANTE: Los inputs en registro.html DEBEN tener estos IDs
    const nombreInput = document.getElementById('reg-nombre');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');

    // 2. Validaciones básicas
    if (!nombreInput || !emailInput || !passwordInput) {
        console.error("Error: No se encontraron los inputs necesarios en el HTML.");
        return;
    }

    if (nombreInput.value === "" || emailInput.value === "" || passwordInput.value === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // 3. Crear el paquete de datos del usuario
    const nuevoUsuario = {
        nombre: nombreInput.value,
        email: emailInput.value.toLowerCase().trim(), // Guardamos el email en minúsculas y sin espacios
        password: passwordInput.value
    };

    // 4. GUARDAR EN LOCALSTORAGE (La "base de datos" del navegador)
    try {
        // Convertimos el objeto a texto JSON antes de guardar
        localStorage.setItem(STORAGE_KEY_USER_DATA, JSON.stringify(nuevoUsuario));
        console.log("Usuario guardado con éxito:", nuevoUsuario.email);

        // 5. Éxito y redirección
        alert("¡Registro exitoso! Ahora serás redirigido para iniciar sesión.");
        // Limpiamos el formulario
        nombreInput.value = ''; emailInput.value = ''; passwordInput.value = '';
        // Redirigimos al login
        window.location.href = 'login.html';

    } catch (error) {
        console.error("Error al guardar en localStorage:", error);
        alert("Hubo un error al intentar guardar los datos en este navegador.");
    }
}

// --- FUNCIÓN 2: LOGIN (Se ejecuta en login.html) ---
function procesarLogin(event) {
    event.preventDefault();
    console.log("Procesando login...");

    // 1. Obtener los elementos del HTML por su ID
    const emailLoginInput = document.getElementById('login-email');
    const passwordLoginInput = document.getElementById('login-password');

    // Validar que existan los inputs
    if (!emailLoginInput || !passwordLoginInput) return;

    const emailIngresado = emailLoginInput.value.toLowerCase().trim();
    const passwordIngresado = passwordLoginInput.value;

    // 2. BUSCAR LOS DATOS GUARDADOS
    const datosGuardadosJSON = localStorage.getItem(STORAGE_KEY_USER_DATA);

    // 3. Verificar si existe algún usuario registrado
    if (!datosGuardadosJSON) {
        // ESTE ES EL ERROR QUE TE SALÍA EN LA FOTO. Ahora ya sabemos por qué.
        alert("Error: Usuario no encontrado. Por favor regístrate primero.");
        return;
    }

    // Convertimos los datos guardados de texto JSON a objeto real
    const usuarioRegistrado = JSON.parse(datosGuardadosJSON);
    console.log("Comparando con usuario registrado:", usuarioRegistrado.email);

    // 4. Comparar credenciales
    if (emailIngresado === usuarioRegistrado.email && passwordIngresado === usuarioRegistrado.password) {
        // ¡LOGIN EXITOSO!

        // Guardamos en sessionStorage que el usuario está activo actualmente.
        // sessionStorage se borra al cerrar la pestaña, lo cual es ideal para "sesiones".
        sessionStorage.setItem(STORAGE_KEY_SESSION, usuarioRegistrado.nombre);
        
        console.log("Login correcto. Redirigiendo...");
        // REDIRECCIÓN FINAL AL CATÁLOGO
        window.location.href = 'catalogo.html';
    } else {
        // Credenciales incorrectas
        alert("Error: El correo o la contraseña son incorrectos.");
    }
}

// --- FUNCIÓN 3: CONTROL DEL CATÁLOGO (Se ejecuta en catalogo.html) ---
function verificarSesionCatalogo() {
    // Esta función verifica si hay alguien logueado al entrar al catálogo
    const nombreUsuarioActivo = sessionStorage.getItem(STORAGE_KEY_SESSION);
    const headerNombreElemento = document.getElementById('header-nombre-usuario');

    if (nombreUsuarioActivo) {
        // Si hay sesión, mostramos el nombre
        if (headerNombreElemento) {
            headerNombreElemento.textContent = "Hola, " + nombreUsuarioActivo;
        }
    } else {
        // Si NO hay sesión (intentaron entrar directo por la URL)
        // Opcional: Redirigirlos fuera o mostrar un mensaje.
        if (headerNombreElemento) {
            headerNombreElemento.textContent = "Modo Invitado (No has iniciado sesión)";
        }
         // Descomenta la siguiente línea si quieres forzarlos a loguearse para ver el catálogo:
         // window.location.href = 'login.html';
    }
}


// --- INICIALIZADOR PRINCIPAL ---
// Este código detecta en qué página estamos y activa las funciones necesarias.
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si estamos en la página de Registro
    const formRegistro = document.getElementById('form-registro-saana');
    if (formRegistro) {
        // Escuchamos el evento 'submit' del formulario
        formRegistro.addEventListener('submit', procesarRegistro);
        console.log("Escuchando formulario de registro.");
    }

    // Detectar si estamos en la página de Login
    const formLogin = document.getElementById('form-login-saana');
    if (formLogin) {
        formLogin.addEventListener('submit', procesarLogin);
        console.log("Escuchando formulario de login.");
    }

    // Detectar si estamos en el catálogo (buscando un elemento específico del catálogo)
    if (document.getElementById('pagina-catalogo-wrapper')) {
        verificarSesionCatalogo();
        console.log("Verificando sesión en catálogo.");
    }
});
