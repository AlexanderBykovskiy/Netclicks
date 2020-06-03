// Объявление констант
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'; // базовый url для изображений
const SERVER = 'https://api.themoviedb.org'; // базовый адрес api

//const API_KEY3 = '4e61d32c7f8095da04f6550d8cc3dd94';

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
const preloader = document.querySelector('.preloader'); // прелоадер
const dropdown = document.querySelectorAll('.dropdown'); // раскрытые списки меню
const tvShowsHead = document.querySelector('.tv-shows__head'); // раскрытые списки меню
const posterWrapper = document.querySelector('.poster__wrapper'); // постер в модальном окне
const modalContent = document.querySelector('.modal__content'); // блок содержащий контент модального окна
const pagination = document.querySelector('.pagination'); // пгинатор
let tempURL = '';


const loading = document.createElement('div'); // создаем элемент лоадера
loading.className = 'loading';

// Класс получения данных из файла json
const DBService = class {
    getData = async (url) => {
        tvShows.append(loading);
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        }
        else {
            throw new Error('Не удалось получить данные');
        }
    }
    // Метод получения тестовых данных из файла
    getTestData = async () => {
        return await this.getData('test.json');
    }
    // Метод получения тестовых данных конкретной карты из файла
    getTestCard = async () => {
        return await this.getData('card.json');
    }
    // Метод получения данных из поиска с сервера
    getSearchResult = async (query) => {
        tempURL = `${ SERVER }/3/search/tv?api_key=${ API_KEY3 }&query=${ query }&language=ru-RU`;
        return this.getData(tempURL);
    }
    // Метод получения данных по конкретной странице
    getNextPage  = async (page) => {
        return this.getData(tempURL + '&page=' + page);
    }
    // Метод получения данных конкретного фильма с сервера
    getTV = async (id) => {
        return this.getData(`${ SERVER }/3/tv/${ id }?api_key=${ API_KEY3 }&language=ru-RU`);
    }
    // Метод получения новинок за сегодня
    getToday = async () => {
        tempURL = `${ SERVER }/3/tv/airing_today?api_key=${ API_KEY3 }&language=ru-RU`;
        return this.getData(tempURL);
    }
    // Метод получения новинок за неделю
    getWeek = async () => {
        tempURL = `${ SERVER }/3/tv/on_the_air?api_key=${ API_KEY3 }&language=ru-RU`;
        return this.getData(tempURL);
    }
    // Метод получения топ сериалов
    getTopRated = async () => {
        tempURL = `${ SERVER }/3/tv/top_rated?api_key=${ API_KEY3 }&language=ru-RU`;
        return this.getData(tempURL);
    }
    // Метод получения популярных
    getPopular = async () => {
        tempURL = `${ SERVER }/3/tv/popular?api_key=${ API_KEY3 }&language=ru-RU`;
        return this.getData(tempURL);
    }
}

const myDBService = new DBService();

// Функция рендеринга элементов списка фильмов
const renderCard = (response, target) => {

    //console.log(response.results); // вывод списка данных в консоль браузера

    tvShowList.textContent = ''; // очищаем список фильмов

    if(!response.total_results) {
        loading.remove(); // удаление лоадера после получения данных и рендера карточек фильмов
        tvShowsHead.textContent = 'Поиск не дал результатов! Измените запрос и повторите снова.';
        pagination.textContent = '';
        //console.log(response.total_results);
        return;
    }

    //tvShowsHead.textContent = 'Результат поиска';
    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';

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

    //console.log(response.total_pages);
    pagination.textContent = '';
    if (response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li><a href="#" class="page-link">${ i }</a></li>`;
        }
    }
};

// Тест получения данных при запросе на сервер
//console.log(myDBService().getSearchResult('няня'));

{
    tvShows.append(loading); // вывод лоадера перед окончанием загрузки данных
    //myDBService.getTestData().then(renderCard); // получения данных из файла json
    myDBService.getToday().then(renderCard); // получение и вывод данных по умолчанию - за сегодня
}

// Отправка формы поиска на сервер
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = searchFormInput.value.trim(); // получаем искомую фразу

    if (value) {
        tvShowList.textContent = ''; // очищаем список фильмов
        myDBService.getSearchResult(value).then(renderCard);
    }
    else {
        console.log('Пустое поле ввода');
    }

    searchFormInput.value = ''; //очистка поля формы поиска
});

// Функция сворачивания списков в меню
closeDpordown = () => {
    dropdown.forEach((item) => {
        item.classList.remove('active');
    })
}

// Функция обработки клика по кнопке меню (открывает/закрывает меню)
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDpordown();
});

// Функция обработки клика по содержимому меню, например, иконкам разделов (открывает/закрывает меню)
document.addEventListener('click', (e) => {
    if (!e.target.closest('.left-menu')) {
        //alert('вне меню ');
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDpordown();
    }
})

// Функция обработки клика на списке в меню
leftMenu.addEventListener('click', (e) => {
    event.preventDefault();
    const target = e.target;
    const dropDown = target.closest('.dropdown');
    if (dropDown) {
        dropDown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
    if (target.closest('#top-rated')) {
        myDBService.getTopRated().then((response) => renderCard(response, target));
    }
    if (target.closest('#popular')) {
        myDBService.getPopular().then((response) => renderCard(response, target));
    }
    if (target.closest('#week')) {
        myDBService.getWeek().then((response) => renderCard(response, target));
    }
    if (target.closest('#today')) {
        myDBService.getToday().then((response) => renderCard(response, target));
    }
    if (target.closest('#search')) {
        tvShowList.textContent = '';
        tvShowsHead.textContent ='';
        pagination.textContent = '';
    }
});

// Функция обработки клика по карточке (открыттие модального окна)
tvShowList.addEventListener('click', (e) => {
    const target = e.target;
    const card = target.closest('.tv-card');
    const id = target.dataset.id;

    if (card) {

        preloader.style.display = 'block'; // включаем прелоадер

        myDBService
            .getTV(id)
            .then((res) => {
                //console.log(res); // получаем резальтат запроса
                // Заполняем поля модального окна
                if (res.poster_path) {
                    tvCardImg.src = IMG_URL + res.poster_path;
                    tvCardImg.alt = res.name;
                    posterWrapper.style.display = 'block';
                    modalContent.style.paddingLeft = '150px';
                }
                else {
                    posterWrapper.style.display = 'none';
                    modalContent.style.paddingLeft = '35px';
                }
                modalTitle.textContent = res.name;
                genresList.textContent = '';
                for(const item of res.genres) {
                    genresList.innerHTML += `<li>${ item.name }</li>`;
                }
                rating.textContent = res.vote_average;
                description.textContent = res.overview;
                modalLink.href = res.homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .then(() => preloader.style.display = 'none'); // убрать прелоадер
    }

});

// Функция обработки клика вне модального окна и крестике закрытия (закрытие модального окна)
modal.addEventListener('click', (e) => {
    if (e.target.closest('.cross') || e.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
        loading.remove();
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

// Функция обработки клика по кнопкам пагинации
pagination.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target;
    if(target.classList.contains('page-link')) {
        tvShows.append(loading);
        myDBService.getNextPage(target.textContent).then(renderCard);
    }
});