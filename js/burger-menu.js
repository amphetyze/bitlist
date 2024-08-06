const burger = document.querySelector('.burger');
const menu = document.querySelector('.header__right');

burger.addEventListener('click', () => {
    menu.classList.toggle('mobile-shown');
    burger.classList.toggle('active');
});