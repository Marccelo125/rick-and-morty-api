let currentPage = 1;
let totalPages = 0;
let initialPage = 1;

const urlCharacters = "https://rickandmortyapi.com/api/character";
const urlEpisodes = "https://rickandmortyapi.com/api/episode";
const urlLocations = "https://rickandmortyapi.com/api/location";

// Funções para renderização da página
function createElementWithClass(tag, className) {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  return element;
}

function renderCharacter(personagem) {
  const liElement = createElementWithClass("article", "character-item");
  const imgElement = createElementWithClass("img", "character-img");

  imgElement.src = personagem.image;
  liElement.appendChild(imgElement);

  const paragraphElement = createElementWithClass(
    "ul",
    "character-description"
  );
  let episodeURL = `https://rickandmortyapi.com/api/episode/${personagem.episode.length}`;

  paragraphElement.innerHTML += `    
  <li class="char-info-name">${personagem.name}</li>
  `;

  const charInfoStatus = createElementWithClass("li", "char-info-status");
  charInfoStatus.textContent = `${personagem.status} - ${personagem.species}`;

  if (personagem.status == "Alive") {
    charInfoStatus.classList.add("alive");
  }
  if (personagem.status == "Dead") {
    charInfoStatus.classList.add("dead");
  }
  if (personagem.status == "unknown") {
    charInfoStatus.classList.add("unknown");
  }

  paragraphElement.appendChild(charInfoStatus);

  axios
    .get(episodeURL)
    .then((response) => {
      const episode = response.data.name;
      paragraphElement.innerHTML += `
      <br /><li class="char-info-location-title">Ultima localização conhecida</li>
      <li>${personagem.location.name}</li>
      <br /><li class="char-info-lastSeen-title">Visto pela ultima vez em</li>
      <li>${episode}</li>`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  liElement.appendChild(paragraphElement);
  return liElement;
}

function renderCharacters(personagens) {
  const listaElement = document.getElementById("lista");
  listaElement.innerHTML = "";

  personagens.forEach((personagem, index) => {
    if (index % 2 === 0 && index !== personagem.length - 1 && index > 1) {
      const hrElement = document.createElement("hr");
      listaElement.appendChild(hrElement);
    }
    const liElement = renderCharacter(personagem);
    listaElement.appendChild(liElement);
  });
}

function searchCharacters() {
  const searchTerm = document.getElementById("searchInput").value.trim();

  if (searchTerm !== "") {
    currentPage = 1;
    fetchCharacters(currentPage, searchTerm);
  }
}

function fetchCharacters(page, searchTerm) {
  const baseApiUrl = "https://rickandmortyapi.com/api/character/";
  const url = searchTerm
    ? `${baseApiUrl}?name=${searchTerm}&page=${page}`
    : `${baseApiUrl}?page=${page}`;

  axios
    .get(url)
    .then((response) => {
      const searchTerm = document.getElementById("searchInput");
      const personagens = response.data.results;
      setSuccess(searchTerm, "");
      renderCharacters(personagens);
    })
    .catch((error) => {
      const searchTerm = document.getElementById("searchInput");
      setError(searchTerm, "Este personagem não foi encontrado");
      console.error("Error:", error);
    });
}

function setError(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  small.textContent = message;
  formControl.classList.remove("success");
  formControl.classList.add("error");
}

function setSuccess(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  small.textContent = message;
  formControl.classList.remove("error");
  formControl.classList.add("success");
}

// Funções para paginação
function getTotalPages() {
  return axios
    .get("https://rickandmortyapi.com/api/character")
    .then((response) => {
      const pages = response.data.info.pages;
      return pages;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function paginacao() {
  const pageNumbers = document.getElementById("pageNumbers");

  const buttonNextPage = `<button onclick=changePage(${
    currentPage + 1
  })> Próxima </button>`;
  const buttonPreviousPage = `<button onclick=changePage(${
    currentPage - 1
  })> Anterior </button>`;

  const buttonAnteriorHTML =
    currentPage > 1
      ? `<button id="btn-anterior" onclick=changePage(${currentPage - 1})> ${
          currentPage - 1
        } </button>`
      : "";
  const buttonAtualHTML = `<button onclick=changePage(${currentPage})> ${currentPage} </button>`;
  const buttonPosteriorHTML =
    currentPage < totalPages
      ? `<button id="btn-posterior" onclick=changePage(${currentPage + 1})> ${
          currentPage + 1
        } </button>`
      : "";
  const buttonFinalHTML =
    currentPage + 1 === totalPages || currentPage === totalPages
      ? ""
      : `
    <span>...</span>
    <button onclick=changePage(${totalPages})> ${totalPages} </button>
    `;
  const buttonInicialHTML =
    currentPage - 1 === initialPage || currentPage === initialPage
      ? ""
      : `
      <button onclick=changePage(${initialPage})> ${initialPage} </button>
      <span>...</span>
      `;

  pageNumbers.innerHTML = `
  ${buttonPreviousPage}
      ${buttonInicialHTML}
      ${buttonAnteriorHTML}
      ${buttonAtualHTML}
      ${buttonPosteriorHTML}
      ${buttonFinalHTML}
      ${buttonNextPage}
    `;
}

function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    paginacao();
    fetchCharacters(currentPage);
  }
}

function getInfos() {
  axios.get(urlCharacters).then((response) => {
    const charactersResponse = response.data.info.count;
    const charactersContainer = document.getElementById("characters");

    charactersContainer.innerText = `PERSONAGENS: ${charactersResponse}`;
  });

  axios.get(urlLocations).then((response) => {
    const locationResponse = response.data.info.count;
    const locationContainer = document.getElementById("location");

    locationContainer.innerText = `LOCALIZAÇÕES: ${locationResponse}`;
  });

  axios.get(urlEpisodes).then((response) => {
    const episodeResponse = response.data.info.count;
    const episodeContainer = document.getElementById("episodes");

    episodeContainer.innerText = `EPISÓDIOS: ${episodeResponse}`;
    console.log(episodeResponse.count);
  });
}

// Chamada assíncrona para obter o total de páginas e, em seguida, executar o restante do código
async function initialize() {
  totalPages = await getTotalPages();
  getInfos();
  paginacao();
  fetchCharacters(currentPage);
}

// Chamada imediata da função initialize
initialize();