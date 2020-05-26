const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.left-menu')) {
        //alert('вне меню ');
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
})

leftMenu.addEventListener('click', (e) => {
    const target = e.target;
    const dropDown = target.closest('.dropdown');
    if (dropDown) {
        dropDown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});