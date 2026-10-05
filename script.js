// Base de datos inicial de comunicados y avisos institucionales (Nivel Secundaria)
const anunciosIniciales = [
    {
        id: 1,
        titulo: "XXIII Aniversario - Campeonato de Ex Alumnos 2026",
        categoria: "secundaria",
        fecha: "Lunes 19 de Octubre, 2026",
        descripcion: "¡Gran campeonato deportivo por nuestro XXIII Aniversario! Disciplinas: Futsal (Masculino) y Vóley (Femenino). Hora: 8:00 AM en los campos deportivos de la I.E. Informes e inscripciones: 929 706 819 - 993 720 439. ¡Habrá grandes premios y sorpresas!",
        afiche: "campeonato-exalumnos.jpg"
    },
    {
        id: 2,
        titulo: "Descanso Escolar de Octubre",
        categoria: "secundaria",
        fecha: "12 de octubre al 16 de octubre",
        descripcion: "De acuerdo con el calendario oficial del Minedu, los estudiantes tendrán su tercer bloque de vacaciones de la temporada, mientras los docentes y directivos realizan la semana de gestión pedagógica.",
        afiche: "calendario.jpg"
    },
    {
        id: 3,
        titulo: "Simulacro Nacional Multipeligro",
        categoria: "urgente",
        fecha: "13 de Octubre, 2026",
        descripcion: "De acuerdo con las normas técnicas de gestión de riesgo de desastres del Minedu (R.M. N.° 501-2025), este ejercicio es obligatorio en todos los planteles para entrenar las brigadas de emergencia escolares frente a sismos u otros peligros locales.",
        afiche: "simulacro.jpg"
    }
];

// Obtener anuncios guardados en el navegador o usar los iniciales
let anuncios = JSON.parse(localStorage.getItem('anuncios_ie_chipa')) || anunciosIniciales;

// Elementos del DOM
const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

// Función para renderizar tarjetas en el DOM principal
function mostrarAnuncios(filtro = 'todos') {
    if (!contenedorTarjetas) return;
    contenedorTarjetas.innerHTML = '';

    const anunciosFiltrados = filtro === 'todos' 
        ? anuncios 
        : anuncios.filter(anuncio => anuncio.categoria === filtro);

    if (anunciosFiltrados.length === 0) {
        contenedorTarjetas.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">No hay comunicados disponibles en esta categoría.</p>`;
        return;
    }

    anunciosFiltrados.slice().reverse().forEach(anuncio => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'tarjeta-anuncio';
        
        tarjeta.innerHTML = `
            <img src="${anuncio.afiche}" alt="Afiche de ${anuncio.titulo}" class="tarjeta-afiche" onerror="this.src='https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'">
            <div class="tarjeta-contenido">
                <span class="badge-categoria">${anuncio.categoria}</span>
                <h3>${anuncio.titulo}</h3>
                <p>${anuncio.descripcion}</p>
                <span class="fecha-anuncio"><i class="fa-regular fa-calendar"></i> ${anuncio.fecha}</span>
            </div>
        `;

        contenedorTarjetas.appendChild(tarjeta);
    });
}

// Filtros interactivos del Tablero
botonesFiltro.forEach(boton => {
    boton.addEventListener('click', (e) => {
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        e.target.classList.add('activo');
        
        const categoriaSeleccionada = e.target.getAttribute('data-filtro');
        mostrarAnuncios(categoriaSeleccionada);
    });
});

// Manejo del formulario de contacto hacia el WhatsApp del Director
const formContacto = document.getElementById('formContacto');

if (formContacto) {
    formContacto.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombreRemitente').value.trim();
        const asunto = document.getElementById('asuntoMensaje').value.trim();
        const mensajeTexto = document.getElementById('textoMensaje').value.trim();
        
        const numeroWhatsAppDirector = "51963642884"; 

        const mensajeWhatsApp = `*¡Nueva Consulta desde el Portal Web!*%0A%0A` +
                                `*Remitente:* ${nombre}%0A` +
                                `*Asunto:* ${asunto}%0A` +
                                `*Mensaje:* ${mensajeTexto}`;

        const urlWhatsApp = `https://wa.me/${51963642884}?text=${mensajeWhatsApp}`;

        alert(`¡Gracias ${nombre}! Su mensaje sobre "${asunto}" está listo para ser enviado directamente al WhatsApp del Director.`);
        window.open(urlWhatsApp, '_blank');
        formContacto.reset();
    });
}

// Lógica de seguridad y panel de administración exclusivo para el Director
const btnAbrirAdmin = document.getElementById('btnAbrirAdmin');
const modalAdmin = document.getElementById('modalAdmin');
const btnCerrarAdmin = document.getElementById('btnCerrarAdmin');
const seccionClave = document.getElementById('seccionClave');
const panelGestionAdmin = document.getElementById('panelGestionAdmin');
const inputClaveDirector = document.getElementById('inputClaveDirector');
const btnVerificarClave = document.getElementById('btnVerificarClave');
const formAdminAnuncio = document.getElementById('formAdminAnuncio');
const listaAdminBorrar = document.getElementById('listaAdminBorrar');

const CLAVE_DIRECTOR_SECRETA = "Chipa2026*"; 

if (btnAbrirAdmin && modalAdmin) {
    btnAbrirAdmin.addEventListener('click', () => {
        modalAdmin.style.display = 'flex';
        if (inputClaveDirector) inputClaveDirector.value = '';
        if (seccionClave) seccionClave.style.display = 'block';
        if (panelGestionAdmin) panelGestionAdmin.style.display = 'none';
    });

    if (btnCerrarAdmin) {
        btnCerrarAdmin.addEventListener('click', () => {
            modalAdmin.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalAdmin) {
            modalAdmin.style.display = 'none';
        }
    });
}

// Función para renderizar la lista de anuncios dentro del panel del director (para poder borrarlos)
function cargarListaParaBorrar() {
    if (!listaAdminBorrar) return;
    listaAdminBorrar.innerHTML = '';

    if (anuncios.length === 0) {
        listaAdminBorrar.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.85rem;">No hay anuncios publicados.</p>`;
        return;
    }

    anuncios.slice().reverse().forEach(anuncio => {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-glass);";
        
        item.innerHTML = `
            <div style="overflow: hidden; margin-right: 1rem;">
                <strong style="font-size: 0.9rem; color: var(--text-primary); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px;">${anuncio.titulo}</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">${anuncio.fecha}</span>
            </div>
            <button onclick="eliminarAnuncio(${anuncio.id})" style="background: #ff5555; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; flex-shrink: 0;"><i class="fa-solid fa-trash"></i> Borrar</button>
        `;
        listaAdminBorrar.appendChild(item);
    });
}

// Función global para eliminar un anuncio
window.eliminarAnuncio = function(id) {
    if (confirm("¿Estás seguro de eliminar este comunicado del tablero institucional?")) {
        anuncios = anuncios.filter(a => a.id !== id);
        localStorage.setItem('anuncios_ie_chipa', JSON.stringify(anuncios));
        
        // Actualizar tanto el tablero como la lista del panel
        mostrarAnuncios('todos');
        cargarListaParaBorrar();
        alert("Comunicado eliminado exitosamente.");
    }
};

// Validación de la clave secreta del Director
if (btnVerificarClave) {
    btnVerificarClave.addEventListener('click', () => {
        const claveIngresada = inputClaveDirector.value.trim();
        
        if (claveIngresada === CLAVE_DIRECTOR_SECRETA) {
            alert("¡Acceso autorizado, Prof. Ricardo Solis Chacon!");
            seccionClave.style.display = 'none';
            panelGestionAdmin.style.display = 'block';
            cargarListaParaBorrar(); // Cargar los botones de borrado
        } else {
            alert("Clave incorrecta. Acceso denegado únicamente para la Dirección.");
            inputClaveDirector.value = '';
        }
    });
}

// Envío y almacenamiento de anuncios procesando la imagen seleccionada
if (formAdminAnuncio) {
    formAdminAnuncio.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputArchivo = document.getElementById('adminAfiche');
        const archivo = inputArchivo.files[0];

        if (archivo) {
            const lector = new FileReader();
            
            lector.onload = function(eventoLectura) {
                const urlImagen = eventoLectura.target.result;

                const nuevoAnuncio = {
                    id: Date.now(),
                    titulo: document.getElementById('adminTitulo').value.trim(),
                    categoria: document.getElementById('adminCategoria').value,
                    fecha: document.getElementById('adminFecha').value.trim(),
                    afiche: urlImagen,
                    descripcion: document.getElementById('adminDescripcion').value.trim()
                };

                anuncios.push(nuevoAnuncio);
                localStorage.setItem('anuncios_ie_chipa', JSON.stringify(anuncios));

                alert("¡Anuncio y foto publicados correctamente en el tablero institucional!");
                
                formAdminAnuncio.reset();
                modalAdmin.style.display = 'none';
                
                mostrarAnuncios('todos');
                botonesFiltro.forEach(b => b.classList.remove('activo'));
                document.querySelector('[data-filtro="todos"]').classList.add('activo');
            };

            lector.readAsDataURL(archivo);
        }
    });
}

// Renderizado inicial al cargar la página web
document.addEventListener('DOMContentLoaded', () => {
    mostrarAnuncios('todos');
});