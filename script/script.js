// Объявление констант
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'; // базовый url для изображений
const SERVER = 'https://api.themoviedb.org'; //
//const API_KEY3 = 'enter your API-key';
const leftMenu = document.querySelector('.left-menu'); // блок левого меню
const hamburger = document.querySelector('.hamburger'); // кнопка меню
const tvShowList = document.querySelector('.tv-shows__list'); // контейнер списка элементов (карточек фильмов)
const modal = document.querySelector('.modal'); // модальное окно
const tvShows = document.querySelector('.tv-shows'); //
const tvCardImg = document.querySelector('.tv-card__img'); // изображение выбранной карточки фильма
const modalTitle = document.querySelector('.modal__title'); // заголовок модального окна
const rating = document.querySelector('.rating'); // рейтинг фильма в модальном окне
const description = document.querySelector('.description'); // описание фильма в модальном окне
const genresList = document.querySelector('.genres-list'); // жанр фильма в модальном окне
const modalLink = document.querySelector('.modal__link'); // ссылка на страницу фильма в модальном окне
const searchForm = document.querySelector('.search__form'); // форма ввода
const searchFormInput = document.querySelector('.search__form-input'); // поле ввода в форме поиска

const loading = document.createElement('div'); // создаем элемент лоадера
loading.className = 'loading';

// Класс получения данных из файла json
const DBService = class {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        }
        else {
            throw new Error('Не удалось получить данные');
        }
    }
    // Метод получения тестовых данных
    getTestData = async () => {
        return await this.getData('test.json');
    }
    // Метод получения тестовых данных конкретной карты
    getTestCard = async () => {
        return await this.getData('card.json');
    }
    // Метод получения данных из поиска с сервера
    getSearchResult = async (query) => {
        return this.getData(`${ SERVER }/3/search/tv?api_key=${ API_KEY3 }&query=${ query }&language=ru-RU`);
    }
    // Метод получения данных конкретного фильма с сервера
    getTV = async (id) => {
        return this.getData(`${ SERVER }/3/tv/${ id }?api_key=${ API_KEY3 }&language=ru-RU`);
    }
}


// Функция рендеринга элементов списка фильмов
const renderCard = (response) => {

    //console.log(response.results); // вывод списка данных в консоль браузера

    tvShowList.textContent = ''; // очищаем список фильмов

    // Получаем список фильмов из файла json
    response.results.forEach((item) => {
        const card = document.createElement('li'); // создаем елемент списка
        card.className = 'tv-shows__item';
        const {
            id,
            vote_average: rating,
            name: title,
            backdrop_path: backdrop,
            poster_path: src
        } = item; // сериализуем полученные данные
        const posterImg = src ? IMG_URL + src : 'img/no-poster.jpg' ; // формируем путь к файлу изображения, если отсутствует, устанавливаем заглушку
        const backdropImg = backdrop ? `data-backdrop="${ IMG_URL }${ backdrop }"` : null; // формируем атрибут альтернативного изображения, если оно существует
        const ratingNo0 = rating ? `<span class="tv-card__vote">${ rating }</span>` : ''; // формируем разметку элемента рейтинга фильма
        // разметка одного элемента списка
        card.innerHTML = `
        <a href="#" class="tv-card">
            ${ ratingNo0 }
            <img class="tv-card__img"
                data-id="${ id }"
                src="${ posterImg }"
                ${ backdropImg }
                alt="${ title }" />
            <h4 class="tv-card__head">${ title }</h4>
        </a>
        `;

        loading.remove(); // удаление лоадера после получения данных и рендера карточек фильмов
        tvShowList.append(card); // добавление списка элементов

    })
};

// Тест получения данных при запросе на сервер
//console.log(new DBService().getSearchResult('няня'));

{
    tvShows.append(loading); // вывод лоадера перед окончанием загрузки данных
    new DBService().getTestData().then(renderCard); // создаем экземпляр класса получения данных из файла json
}

// Отправка формы поиска на сервер
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = searchFormInput.value.trim(); // получаем искомую фразу

    if (value) {
        tvShowList.textContent = ''; // очищаем список фильмов
        new DBService().getSearchResult(value).then(renderCard);
    }
    else {
        console.log('Пустое поле ввода');
    }

    searchFormInput.value = ''; //очистка поля формы поиска
});

// Функция обработки клика по кнопке меню (открывает меню)
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

// Функция обработки клика по содержимому меню, например, иконкам разделов (открывает меню)
document.addEventListener('click', (e) => {
    if (!e.target.closest('.left-menu')) {
        //alert('вне меню ');
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
})

// Функция обработки клика на меню
leftMenu.addEventListener('click', (e) => {
    event.preventDefault();
    const target = e.target;
    const dropDown = target.closest('.dropdown');
    if (dropDown) {
        dropDown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

// Функция обработки клика по карточке (открыттие модального окна)
tvShowList.addEventListener('click', (e) => {
    const target = e.target;
    const card = target.closest('.tv-card');
    const id = target.dataset.id;

    // включить прелоадер

    new DBService()
        .getTV(id)
        .then((res) => {
            //console.log(res); // получаем резальтат запроса
            // Заполняем поля модального окна
            tvCardImg.src = IMG_URL + res.poster_path;
            modalTitle.textContent = res.name;
            genresList.textContent = '';
            for(const item of res.genres) {
                genresList.innerHTML += `<li>${ item.name }</li>`;
            }
            rating.textContent = res.vote_average;
            description.textContent = res.overview;
            modalLink.href = res.homepage;
        });

        // .then() убрать прелоадер

    if (card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }

});

// Функция обработки клика вне модального окна и крестике закрытия (закрытие модального окна)
modal.addEventListener('click', (e) => {
    if (e.target.closest('.cross') || e.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

// Функция изменения изображения src на data-backdrop в карточке фильма
const changeImage = (e) => {
    const card = e.target.closest('.tv-shows__item');
    if (card) {
        const imgSrc = card.querySelector('.tv-card__img');
        const imgData = imgSrc.dataset.backdrop;
        if (imgData) { // если есть изображение в data-backdrop, меняем местами
            imgSrc.dataset.backdrop = imgSrc.src;
            imgSrc.src = imgData;
        }
    }
};

// Функции обработки наведения указателя мыши на карточку фильма (вызывает функцию замены изображения)
tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);