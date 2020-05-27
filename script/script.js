
const ING_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
//const API_KEY3 = 'enter your API-key';

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

    getTestData = async () => {
        return await this.getData('test.json');
    }
}

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');

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

tvShowList.addEventListener('click', (e) => {
    const target = e.target;
    const card = target.closest('.tv-card');
    console.log(target);

    if (card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }

});

modal.addEventListener('click', (e) => {
    if (e.target.closest('.cross') || e.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});


const changeImage = (e) => {
    const card = e.target.closest('.tv-shows__item');
    if (card) {
        const imgSrc = card.querySelector('.tv-card__img');
        const imgData = imgSrc.dataset.backdrop;
        if (imgData) {
            imgSrc.dataset.backdrop = imgSrc.src;
            imgSrc.src = imgData;
        }
    }
};
tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);

const renderCard = (response) => {
    console.log(response.results);

    tvShowList.textContent = '';

    response.results.forEach((item) => {
        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        const {
            vote_average: rating,
            name: title,
            backdrop_path: backdrop,
            poster_path: src
        } = item;
        const posterImg = src ? ING_URL + src : 'img/no-poster.jpg' ;
        const backdropImg = backdrop ? `data-backdrop="${ ING_URL }${ backdrop }"` : null;
        const ratingNo0 = rating ? `<span class="tv-card__vote">${ rating }</span>` : '';
        card.innerHTML = `
        <a href="#" class="tv-card">
            ${ ratingNo0 }
            <img class="tv-card__img"
                src="${ posterImg }"
                ${ backdropImg }
                alt="${ title }" />
            <h4 class="tv-card__head">${ title }</h4>
        </a>
        `;

        tvShowList.append(card);

    })
};

new DBService().getTestData().then(renderCard);