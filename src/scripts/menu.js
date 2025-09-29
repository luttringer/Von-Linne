const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
const hamburgerLines = document.querySelectorAll('.hamburger-line');

let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        // Abrir menú - deslizar desde la derecha
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');

        // Mostrar overlay
        overlay.classList.remove('invisible', 'opacity-0');
        overlay.classList.add('visible', 'opacity-100');

        // Animar hamburguesa a X
        hamburgerLines[0].classList.add('rotate-45', 'translate-y-2');
        hamburgerLines[1].classList.add('opacity-0');
        hamburgerLines[2].classList.add('-rotate-45', '-translate-y-2');

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    } else {
        // Cerrar menú - deslizar hacia la derecha
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');

        // Ocultar overlay
        overlay.classList.remove('visible', 'opacity-100');
        overlay.classList.add('invisible', 'opacity-0');

        // Restaurar hamburguesa
        hamburgerLines[0].classList.remove('rotate-45', 'translate-y-2');
        hamburgerLines[1].classList.remove('opacity-0');
        hamburgerLines[2].classList.remove('-rotate-45', '-translate-y-2');

        // Restaurar scroll del body
        document.body.style.overflow = 'auto';
    }
}

// Event listeners
hamburgerBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Cerrar menú con tecla Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
    }
});

// Cerrar menú al hacer clic en un elemento del menú (opcional)
mobileMenu.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    });
});

// Prevenir el cierre al hacer clic dentro del menú
mobileMenu.addEventListener('click', function (e) {
    e.stopPropagation();
});