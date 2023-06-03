




/* ----------Глобальные сущности---------- */

// DOM-объекты элементов пользовательского интерфейса
const titleInput = document.getElementById('title-input');
const typeSelect = document.getElementById('type-select');
const searchButton = document.getElementById('search-button');
const statusOutput = document.getElementById('status-output');
const searchResultsContainer = document.getElementById('search-results-container');

// Состояние
let title, type;

// Создание объекта сетевого запроса AJAX
const request = new XMLHttpRequest();

// API-ключ
const apiKey = 'a85b9273-b2a7-4067-8306-4d9c56af9327';

// Ответ по поисковой выдаче
let response;
// Результат поиска
let searchResults;
// Полная информация по фильму
let cinemaFullInfo;



/* ----------Отправка поисковых запросов---------- */

searchButton.addEventListener('click', processInitialhRequest);

function processInitialhRequest() {
    // Очистка результатов предыдущего запроса
    const cinemaCards = searchResultsContainer.querySelectorAll('.cinema-card');
    for (const cinemaCard of cinemaCards) {
        cinemaCard.remove();
    }

    title = titleInput.value;
    type = typeSelect.value;

    const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=${type}&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&keyword=${title}&page=1`;
    sendRequest(url);
}

/* ----------Отправка поисковых результатов---------- */

function sendRequest(url) {
    // Инициализщация с указанием метода  и опций
    request.open('GET', url);
    request.setRequestHeader('X-API-KEY', apiKey);

    // Отправка запроса
    request.send();

    console.time('request');
}

// Привем и обработка ответа
request.addEventListener('load', processResponse);

function processResponse() {
    console.timeEnd('request');


    if (request.status == 200) {
        statusOutput.innerText = 
            `${type[0].toUpperCase() + type.slice(1).toLowerCase() } "${title}"`;
        
        response = JSON.parse(request.response);

        if ('items' in response) {
            searchResults = response.items;
            processSearchResults(searchResults);
        } else {
            cinemaFullInfo = response;
            processDetails(cinemaFullInfo);
        }        
    }
}

function processSearchResults(searchResults) {
    console.log('processSearchResults >> searchResults :>>', searchResults);

    for (const result of searchResults) {
        
        // Деструктуризация объекта
        const { 
            nameOriginal: title,
            posterUrl: poster,
            ratingImdb: rating,
            year,
            kinopoiskId
        } = result;

        // Создание новых HTML-элементов
        const card = 
`<div class="cinema-card" data-kinopoisk-id="${kinopoiskId}">
    <div class="poster">
        <img src="${poster}" alt="Poster of ${title}">
    </div>
    <div class="info">
        <div class="rating-favorite-container">
            <p class="rating">${rating}</p>
            <div class="favorite-icon"></div>
        </div>
        <h6 class="title">${title}</h6>
        <p class="year">${year}</p>
    </div>
</div>`;

        // Вставка нового HTML-элемента
        searchResultsContainer.insertAdjacentHTML('beforeend', card)
    }
}

// Обработка событий клика по карточкам
searchResultsContainer.addEventListener('click', processDetailsRequestRequest)

// Функция для отправки запроса детальной информации по фильму
function processDetailsRequestRequest({ target }) {
    const card = target.closest('div.cinema-card')

    if (card) {
        const kinopoiskId = card.dataset.kinopoiskId

        const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${kinopoiskId}`;
        sendRequest(url);
    }

}

// Функция для вывода детальной информации по фильму
function processDetails(cinemaFullInfo) {
    
    // Деструктуризация объекта
    const { 
        nameOriginal: title,
        posterUrl: poster,
        ratingImdb: rating,
        year,
        kinopoiskId
    } = result;

    // Создание новых HTML-элементов
    const card = 
`<div class="cinema-card" data-kinopoisk-id="${kinopoiskId}">
<div class="poster">
    <img src="${poster}" alt="Poster of ${title}">
</div>
<div class="info">
    <div class="rating-favorite-container">
        <p class="rating">${rating}</p>
        <div class="favorite-icon"></div>
    </div>
    <h6 class="title">${title}</h6>
    <p class="year">${year}</p>
</div>
</div>`;
}

// Функция для вывода детальной информации по фильму
function processDetails(cinemaFullInfo) {
    
    // Деструктуризация объекта
    const { 
        posterUrl: poster,
        ratingImdb: rating,
        nameOriginal: title,
        genres,
        countries,
        year,
        shortDescription: description,
        webUrl
    } = cinemaFullInfo;

    // Создание новых HTML-элементов
    const cinemaFullCard = 
        `<div id="fixed-container">
            <div id="cinema-full-card">
                <div class="poster">
                    <img src="${poster}" alt="Poster of ${title}">
                </div>
                <div class="info">
                <p class="rating">${rating}</p>
                <h2 class="title">${title}</h2>
                <h3 class="genres">
                    ${ genres.map(item => item.genre)
                        .join(', ')
                        .replace(/^./, letter => letter.toUpperCase()) }
                </h3>
                <h3 class="countries">
                    ${ countries.map(item => item.countries).join(', ') }
                </h3>
                <p class="year">${year}</p> 
                <p class="description">${description}</p>
                <a href="${webUrl}" target="blank">Link to Kinopoisk</a>
                </div>
                <button>&times;</button>
            </div>        
        </div>`;
    
    // Вставка нового HTML-элемента
    document.body.insertAdjacentHTML('beforeend', cinemaFullCard);

    const fixedContainer = document.getElementById('fixed-container')

    // Закрытие окна
    document.querySelector('#cinema-full-card button')
        .addEventListener('click', function() {
                fixedContainer.remove();
            }, {once: true});
    
        fixedContainer.addEventListener('click', function(event) {
            if (event.target.matches('#fixed-container')) {
                    fixedContainer.remove();
            }
        }, {once: true});
}















