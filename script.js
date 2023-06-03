/* ------------------------------------------------------------------------- *\
*                 Веб-приложение по поиску фильмов и сериалов
\* ------------------------------------------------------------------------- */

/* ---------------------- Глобальные сущности ---------------------- */

// DOM-объекты элементов пользовательского интерфейса
const titleInput = document.getElementById("title-input");
const typeSelect = document.getElementById("type-select");
const searchButton = document.getElementById("search-button");
const statusOutput = document.getElementById("status-output");
const searchResultsContainer = document.getElementById(
    "search-results-container"
);

// Состояние
let title, type;

// Создание объекта сетевого запроса AJAX
const request = new XMLHttpRequest();

// API-ключ
const apiKey = "babd72f9-9560-4373-a5c3-9e8caae771fc";

// Ответ по поисковому запросу
let response;
// Результаты поиска
let searchResults;
// Полная информация по фильму
let cinemaFullInfo;

/* ---------------------- Отправка поисковых запросов ---------------------- */

// Обработка события клика по кнопке searchButton
searchButton.addEventListener("click", processInitialRequest);

// Функция для обработка начального запроса
function processInitialRequest() {
    // Очистка результатов предыдущего поиска
    const cinemaCards = searchResultsContainer.querySelectorAll(".cinema-card");
    for (const cinemaCard of cinemaCards) {
        cinemaCard.remove();
    }

    title = titleInput.value;
    type = typeSelect.value;

    const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&keyword=${title}&type=${type}&page=1`;
    sendRequest(url);
}

/* -------------------- Обработка поисковых результатов -------------------- */

// Функция для отправки запроса и получения ответа
function sendRequest(url) {
    // Инициализация запроса с указанием метода, заголовка с API-ключом и опций
    request.open("GET", url);
    request.setRequestHeader("X-API-KEY", apiKey);

    // Отправка запроса
    request.send();
    console.time("request");
}

// Приём и обработка ответа
request.addEventListener("load", processResponse);

function processResponse() {
    console.timeEnd("request");

    if (request.status == 200) {
        statusOutput.innerText = `${
            type[0].toUpperCase() + type.slice(1).toLowerCase()
        } "${title}"`;

        response = JSON.parse(request.response);

        if ("items" in response) {
            searchResults = response.items;
            processSearchResults(searchResults);
        } else {
            cinemaFullInfo = response;
            processDetails(cinemaFullInfo);
        }
    }
}

// Обработка результатов поиска
function processSearchResults(searchResults) {
    // console.log('processSearchResults >> searchResults :>> ', searchResults);

    searchResults.forEach((result) => {
        const {
            nameOriginal: title,
            posterUrl: poster,
            ratingImdb: rating,
            year,
            kinopoiskId,
        } = result;

        // Создание новых HTML-элементов
        const card = `<div class="cinema-card" data-kinopoisk-id="${kinopoiskId}">
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

        // Вставка нового HTML-элементов
        searchResultsContainer.insertAdjacentHTML("beforeend", card);
    });
}

// Обработка событий клика по карточкам
searchResultsContainer.addEventListener("click", processDetailsRequest);

// Функция для отправки запроса детальной информации по фильму
function processDetailsRequest({ target }) {
    const card = target.closest("div.cinema-card");

    if (card) {
        const kinopoiskId = card.dataset.kinopoiskId;
        const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${kinopoiskId}`;
        sendRequest(url);
    }
}

// Функция для вывода детальной информации по фильму
function processDetails(cinemaFullInfo) {
    // Деструктуризация объекта
    const {
        posterUrl: poster,
        ratingKinopoisk: rating,
        nameOriginal: title,
        genres,
        countries,
        year,
        shortDescription: description,
        webUrl,
    } = cinemaFullInfo;

    // Создание новых HTML-элементов
    const cinemaFullCard = `<div id="fixed-container">
            <div id="cinema-full-card">
                <div class="poster">
                    <img src="${poster}" alt="Poster of ${title}">
                </div>
                <div class="info">
                    <p class="rating">${rating}</p>
                    <h2 class="title">${title}</h2>
                    <h3 class="genre">
                        ${genres
                            .map((item) => item.genre)
                            .join(", ")
                            .replace(/^./, (letter) => letter.toUpperCase())}
                    </h3>
                    <h3 class="countries">
                        ${countries.map((item) => item.country).join(", ")}
                    </h3>
                    <p class="year">${year}</p>
                    <p class="description">${description}</p>
                    <a href="${webUrl}" target="_blank">Link to Kinopoisk</a>
                </div>
                <button>&times;</button>
            </div>
        </div>`;

    // Вставка нового HTML-элемента
    document.body.insertAdjacentHTML("beforeend", cinemaFullCard);

    // Закрытие окна
    const fixedContainer = document.getElementById("fixed-container");

    document.querySelector("#cinema-full-card button").addEventListener(
        "click",
        function () {
            fixedContainer.remove();
        },
        { once: true }
    );

    fixedContainer.addEventListener(
        "click",
        function (event) {
            if (event.target.matches("#fixed-container")) {
                fixedContainer.remove();
            }
        },
        { once: true }
    );
}