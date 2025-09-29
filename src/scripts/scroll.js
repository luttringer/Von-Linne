window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    const ul = document.querySelector('header nav ul');
    const logoUdelar = document.querySelector('header span img:first-child');
    const logoUrbe = document.querySelector('header span img:last-child');
    const hamburguesa = document.querySelector('#hamburgerBtn');

    if (window.scrollY > 200) {
        header.classList.add('scrolled');
        ul.classList.add('scrolled');
        logoUdelar.classList.add('scrolled');
        logoUrbe.classList.add('scrolled');
        hamburguesa.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        ul.classList.remove('scrolled');
        logoUdelar.classList.remove('scrolled');
        logoUrbe.classList.remove('scrolled');
        hamburguesa.classList.remove('scrolled');
    }
});