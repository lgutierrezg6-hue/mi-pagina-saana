// --- LÓGICA DE REGISTRO ---
function registrarUsuario(event) {
    // Evita que el formulario recargue la página
    event.preventDefault();

    console.log("Intentando registrar...");

    // 1. Obtener valores del formulario de registro
    // (Asegúrate de que en tu HTML de registro los inputs tengan estos IDs)
    const nombreInput = document.getElementById('reg-nombre');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');

    // Validación simple
    if (!nombreInput.value || !emailInput.value || !passwordInput.value) {
        alert("Por favor, completa todos los campos para registrarte.");
        return;
    }

    // 2. Crear el objeto de usuario
    const nuevoUsuario = {
        nombre: nombreInput.value,
        email: emailInput.value,
        password: passwordInput.value
    };

    // 3. GUARDAR EN LOCALSTORAGE (Simulación de Base de Datos)
    // Convertimos el objeto a texto (JSON) para guardarlo
    localStorage.setItem('usuarioRegistrado', JSON.stringify(nuevoUsuario));

    // 4. Feedback y redirección
    alert('¡Registro exitoso! Ahora serás redirigido al login.');
    window.location.href = 'login.html';
}


// --- LÓGICA DE LOGIN (Aquí es donde tenías el error) ---
function iniciarSesion(event) {
    event.preventDefault();
    console.log("Intentando iniciar sesión...");

    // 1. Obtener datos del formulario de login
    // (Asegúrate que en tu login.html los inputs tengan estos IDs)
    const emailLogin = document.getElementById('login-email').value;
    const passwordLogin = document.getElementById('login-password').value;

    // 2. RECUPERAR DATOS DEL LOCALSTORAGE
    // Buscamos si hay algo guardado bajo la llave 'usuarioRegistrado'
    const usuarioGuardadoJSON = localStorage.getItem('usuarioRegistrado');

    // 3. Verificar si el usuario existe
    if (!usuarioGuardadoJSON) {
        // AQUÍ ESTABA TU ERROR: No encontraba nada en la memoria
        alert('Error: Usuario no encontrado en este navegador. Por favor regístrate primero.');
        return;
    }

    // Convertimos el texto guardado de vuelta a un objeto Javascript
    const usuarioGuardado = JSON.parse(usuarioGuardadoJSON);

    // 4. Validar credenciales (Email y Contraseña coinciden)
    if (emailLogin === usuarioGuardado.email && passwordLogin === usuarioGuardado.password) {
        // ¡Login Correcto!
        
        // Guardamos una "sesión activa" temporalmente para la página de catálogo
        sessionStorage.setItem('usuarioActivoNombre', usuarioGuardado.nombre);
        
        alert('Credenciales correctas. Redirigiendo al catálogo...');
        // REDIRECCIÓN
        window.location.href = 'catalogo.html';
    } else {
        alert('Error: El correo o la contraseña son incorrectos.');
    }
}


// --- LÓGICA DEL CATÁLOGO (Para mostrar el nombre) ---
function cargarDatosCatalogo() {
    // Verificar si venimos de un login exitoso
    const nombreUsuarioActivo = sessionStorage.getItem('usuarioActivoNombre');
    
    const elementoNombre = document.getElementById('nombre-usuario-header');

    if (nombreUsuarioActivo && elementoNombre) {
        // Si hay usuario y encontramos el elemento donde poner el nombre
        elementoNombre.textContent = "Hola, " + nombreUsuarioActivo;
    } else if (elementoNombre) {
        // Si entró directo sin loguearse
        elementoNombre.textContent = "Invitado";
       // Opcional: redirigir al login si no está logueado
       // window.location.href = 'login.html'; 
    }
}

// Detectar en qué página estamos para ejecutar la función correcta
document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en login.html
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', iniciarSesion);
    }

    // Si estamos en registro.html
    const registerForm = document.getElementById('form-registro');
    if (registerForm) {
        registerForm.addEventListener('submit', registrarUsuario);
    }

    // Si estamos en catalogo.html
    if (window.location.pathname.includes('catalogo.html')) {
        cargarDatosCatalogo();
    }
});
