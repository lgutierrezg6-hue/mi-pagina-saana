/* 
    auth.js - Motor funcional para SAANA
    Maneja Registro, Login y Seguridad de Sesión.
*/

// --- CLAVES DE ALMACENAMIENTO ---
// Usamos estas llaves para guardar y leer datos del navegador.
const KEY_DATOS_USUARIO = 'saana_user_data_final'; // Aquí se guarda la info del registro
const KEY_SESION_ACTIVA = 'saana_session_active';   // Esto indica si alguien está logueado

// --- INICIALIZADOR ---
// Detecta en qué página estamos cuando carga el HTML
document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en la página de REGISTRO
    const formRegistro = document.getElementById('form-registro-saana');
    if (formRegistro) {
        console.log("Página de registro detectada.");
        iniciarFuncionalidadRegistro(formRegistro);
    }

    // Si estamos en la página de LOGIN
    const formLogin = document.getElementById('form-login-saana');
    if (formLogin) {
        console.log("Página de login detectada.");
        iniciarFuncionalidadLogin(formLogin);
    }

    // Si estamos en el CATÁLOGO (buscamos el botón de logout)
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
         console.log("Página de catálogo detectada.");
         iniciarFuncionalidadCatalogo(btnLogout);
    }
});


// =============================================
// 1. FUNCIONALIDAD DE REGISTRO
// =============================================
function iniciarFuncionalidadRegistro(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        console.log("Procesando registro...");

        // A. Obtener valores de los inputs (usando los IDs de tu HTML visual)
        const nombre = document.getElementById('reg-nombre').value.trim();
        const apellido = document.getElementById('reg-apellido').value.trim();
        const fechaNacimiento = `${document.getElementById('reg-dia').value}/${document.getElementById('reg-mes').value}/${document.getElementById('reg-anio').value}`;
        const email = document.getElementById('reg-email').value.toLowerCase().trim();
        const telefono = document.getElementById('reg-telefono').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        // B. Validaciones básicas
        if (password !== confirmPassword) {
            alert("Error: Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 4) {
             alert("Error: La contraseña es muy corta.");
             return;
        }

        // C. Crear objeto de usuario
        const nuevoUsuario = {
            nombre: nombre,
            apellido: apellido,
            fechaNacimiento: fechaNacimiento,
            email: email,
            telefono: telefono,
            password: password // En un caso real, esto NUNCA se guarda en texto plano
        };

        // D. Guardar en LocalStorage (Simulación de Base de Datos)
        try {
            localStorage.setItem(KEY_DATOS_USUARIO, JSON.stringify(nuevoUsuario));
            alert("¡Registro exitoso! Ahora serás redirigido para iniciar sesión.");
            // Redirigir al login
            window.location.href = 'login.html';
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un problema técnico al guardar los datos en el navegador.");
        }
    });
}


// =============================================
// 2. FUNCIONALIDAD DE LOGIN
// =============================================
function iniciarFuncionalidadLogin(form) {
    // Limpiar cualquier sesión previa al entrar al login
    sessionStorage.removeItem(KEY_SESION_ACTIVA);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Procesando login...");

        const emailIngresado = document.getElementById('login-email').value.toLowerCase().trim();
        const passwordIngresado = document.getElementById('login-password').value;

        // A. Buscar si existe un usuario registrado
        const datosGuardadosJSON = localStorage.getItem(KEY_DATOS_USUARIO);

        if (!datosGuardadosJSON) {
            alert("Error: No se encontró ningún usuario registrado. Por favor, crea una cuenta primero.");
            return;
        }

        // B. Convertir los datos guardados a un objeto real
        const usuarioRegistrado = JSON.parse(datosGuardadosJSON);

        // C. Verificar credenciales
        if (emailIngresado === usuarioRegistrado.email && passwordIngresado === usuarioRegistrado.password) {
            // ¡LOGIN CORRECTO!
            console.log("Credenciales válidas.");
            
            // CREAR SESIÓN ACTIVA (Esto es el "pase" para entrar al catálogo)
            // Usamos sessionStorage porque se borra al cerrar la pestaña (más seguro)
            sessionStorage.setItem(KEY_SESION_ACTIVA, 'true');

            alert(`Bienvenido/a, ${usuarioRegistrado.nombre}. Redirigiendo al catálogo...`);
            window.location.href = 'catalogo.html';

        } else {
            alert("Error: El correo o la contraseña son incorrectos.");
        }
    });
}


// =============================================
// 3. FUNCIONALIDAD DEL CATÁLOGO (Logout y otros)
// =============================================
function iniciarFuncionalidadCatalogo(btnLogout) {
    // Configurar el botón de cerrar sesión
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        // Borrar el "pase" de sesión activa
        sessionStorage.removeItem(KEY_SESION_ACTIVA);
        alert("Has cerrado sesión correctamente.");
        window.location.href = 'login.html';
    });

    // Aquí iría el resto del código del catálogo (modal de productos, etc.)
    // que ya tenías en versiones anteriores si deseas mantenerlo.
    console.log("Funcionalidad del catálogo lista.");
}
