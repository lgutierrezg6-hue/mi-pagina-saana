// Esperamos a que toda la página se cargue antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // LÓGICA DE REGISTRO (Si estamos en registro.html)
    // =========================================
    
    // Buscamos si existe el formulario de registro en la página actual
    const registerForm = document.getElementById('form-registro');

    if (registerForm) {
        // Si existe, escuchamos cuando alguien le da click a "Registrarse"
        registerForm.addEventListener('submit', function(evento) {
            // Evitamos que la página se recargue (comportamiento por defecto)
            evento.preventDefault();

            // 1. Obtener los valores de los campos
            const correo = document.getElementById('reg-correo').value;
            const pass1 = document.getElementById('reg-pass1').value;
            const pass2 = document.getElementById('reg-pass2').value;
            // (Podríamos obtener los demás datos nombre, apellido, etc. si quisiéramos guardarlos)

            // 2. Validaciones extra (HTML ya valida que no estén vacíos)
            
            // Revisar si las contraseñas coinciden
            if (pass1 !== pass2) {
                alert("Error: Las contraseñas no coinciden.");
                return; // Detenemos el proceso
            }

            // Revisar si el usuario ya existe en nuestra "base de datos" local
            if (localStorage.getItem(correo)) {
                alert("Error: Este correo ya está registrado.");
                return;
            }

            // 3. Guardar los datos
            // Creamos un "paquete" (objeto) con los datos del usuario
            const nuevoUsuario = {
                correo: correo,
                contrasena: pass1, // Guardamos la contraseña (en un caso real, esto debería ir cifrado)
                nombre: document.getElementById('reg-nombre').value
            };

            // Guardamos el paquete en el navegador. Usamos el correo como llave para encontrarlo luego.
            // JSON.stringify convierte el paquete en texto para poder guardarlo.
            localStorage.setItem(correo, JSON.stringify(nuevoUsuario));

            // 4. Éxito
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            // Redirigimos a la página de login
            window.location.href = 'login.html';
        });
    }


    // =========================================
    // LÓGICA DE LOGIN (Si estamos en login.html)
    // =========================================

    // Buscamos si existe el formulario de login en la página actual
    const loginForm = document.getElementById('form-login');

    if (loginForm) {
        loginForm.addEventListener('submit', function(evento) {
            evento.preventDefault();

            // 1. Obtener los datos que ingresó el usuario
            const emailIngresado = document.getElementById('login-email').value;
            const passIngresada = document.getElementById('login-pass').value;

            // 2. Buscar al usuario en la "base de datos" local
            const usuarioGuardadoTexto = localStorage.getItem(emailIngresado);

            // 3. Verificar
            if (usuarioGuardadoTexto) {
                // Si el usuario existe, convertimos el texto guardado de nuevo a objeto
                const usuarioGuardado = JSON.parse(usuarioGuardadoTexto);

                // Comparamos la contraseña ingresada con la guardada
                if (passIngresada === usuarioGuardado.contrasena) {
                    // ¡Contraseña correcta!
                    alert("¡Bienvenido de nuevo, " + usuarioGuardado.nombre + "!");
                    
                    // (Opcional) Podríamos guardar aquí que la sesión está iniciada
                    // localStorage.setItem('sesionActiva', emailIngresado);

                    // Redirigimos al catálogo
                    window.location.href = 'catalogo.html';

                } else {
                    // Contraseña incorrecta
                    alert("Error: Contraseña incorrecta.");
                }
            } else {
                // El correo no existe en la base de datos
                alert("Error: Usuario no encontrado. Por favor regístrate.");
            }
        });
    }
});
