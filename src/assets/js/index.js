"use strict";


//Покзываем/скрываем выпадющее меню в селекте
let selectTitle = document.querySelector('.js-select-title');
const selectList = document.querySelector('.select-list');

selectTitle.addEventListener('click', () => {
    selectList.classList.toggle('active');
});


//меняем текст/флаг в селекте
const selectItems = document.querySelectorAll('.js-select-item');

selectItems.forEach(item => {
    item.addEventListener('click', function() {
        selectTitle.innerHTML = item.innerHTML;
        selectTitle.dataset.lang = item.dataset.lang;
        selectList.classList.remove('active');
    });
})


//при клике на элементы в меню шапки показываем выпадающее меню
const navItems = document.querySelectorAll('.js-nav-item');

navItems.forEach(item => {
    item.addEventListener('click', function(evt) {
        const navItem = evt.target;
        const dropDown = navItem.querySelector('.drop-down');
        const dropDowns = document.querySelectorAll('.drop-down');

        navItems.forEach(elem => {
            if(elem !== item) {
                elem.classList.remove('active');
            }
        });

        item.classList.toggle('active');

        dropDowns.forEach(item => {
            if(item === dropDown) {
                return;
            }
            item.classList.remove('active');
        })

        dropDown.classList.toggle('active');
    });
})


//кнопка скрытия выбора языка
const closeButton = document.querySelector('.js-close-button');

closeButton.addEventListener('click', () => {
    closeButton.closest('.header-top').classList.add('hidden');
});


//при клике вне выпадающих меню, закрываем их
document.addEventListener( 'click', (evt) => {
    const dropdowns = document.querySelectorAll('.js-drop-down');

    dropdowns.forEach(item => {
        const navItem = item.closest('.js-nav-item');
        clickOutside(evt, item, navItem, navItem);
    })

    clickOutside(evt, selectList, selectTitle);
})

function clickOutside(evt, popup, popupActivator, anotherElement = null) {
    if(popup.classList.contains('active')) {
        const withinBoundaries = evt.composedPath().includes(popup);
        const activateElement = evt.composedPath().includes(popupActivator);
    
        if (!withinBoundaries && !activateElement) {
            popup.classList.remove('active');

            if(anotherElement) {
                anotherElement.classList.remove('active');
            }
        }
    }
}
