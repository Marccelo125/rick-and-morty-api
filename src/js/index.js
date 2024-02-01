let currentPage = 1;
let totalPages = 0;
let initialPage = 1;

const urlCharacters = "https://rickandmortyapi.com/api/character/";
const urlEpisodes = "https://rickandmortyapi.com/api/episode/";
const urlLocations = "https://rickandmortyapi.com/api/location/";

function renderCharacter(personagem, index) {
  const charList = document.querySelector(".characters-list");
  const charContainer = document.createElement("div");
  charContainer.classList.add(
    "container-fluid",
    "col-12",
    "col-md-12",
    "col-lg-6",
    "d-flex",
    "bg-dark",
    "justify-content-between",
    "align-self-center",
    "p-0",
    "g-3",
    "border",
    "rounded"
  );

  let episodeURL = `${urlEpisodes}${personagem.episode.length}`;
  axios
    .get(episodeURL)
    .then((response) => {
      const episode = response.data.name;
      charContainer.innerHTML += `
      <img src='${personagem.image}' class="img-fluid d-none d-md-flex d-lg-flex">
        <div class="text-start text-white align-self-center p-2 fs-7">
          <p class="fw-bold">${personagem.name}</p>
          <p>${personagem.status} - ${personagem.species}</p>
          <p><strong>Ultima localização conhecida</strong> ${personagem.location.name}</p>
          <p><strong>Visto pela ultima vez em</strong> ${episode}</p>
          <button type="button" id="button-character" class="btn btn-outline-info container-fluid" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${index}">Ler mais</button>
        </div>
      `;

      // MODAL CREATE //
      const modal = document.createElement("div");
      modal.innerHTML = `
      <div class="modal fade bg-dark bg-opacity-75" tabindex="-1" id="staticBackdrop-${index}">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-success fw-bold">${personagem.name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="container modal-body">
              <div class="row">
                <div class="col-12 d-flex justify-content-center">
                  <img src='${personagem.image}' class="img-fluid">
                </div>
                <div class="col-12 text-center p-4">
                  <p>${personagem.status} - ${personagem.species}</p>
                  <p class="fw-bold">Ultima localização conhecida</p>
                  <p>${personagem.location.name}</p>
                  <p class="fw-bold">Visto pela ultima vez em</p>
                  <p>${episode}</p>
                </div>
              </div>
              <div class="row mx-4 align-items-center">
              <button type="button" class="btn btn-danger container-fluid" data-bs-dismiss="modal">Fechar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
      charContainer.appendChild(modal);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  charList.appendChild(charContainer);
  return charContainer;
}

// Renderiza uma linha a cada 2 personagens
function renderCharacters(personagens) {
  const listaElement = document.getElementById("lista");
  listaElement.innerHTML = "";

  personagens.forEach((personagem, index) => {
    const divElement = renderCharacter(personagem, index);
    listaElement.appendChild(divElement);
  });
}

function fetchCharacters(page, searchTerm) {
  const url = searchTerm
    ? `${urlCharacters}?name=${searchTerm}&page=${page}`
    : `${urlCharacters}?page=${page}`;

  axios
    .get(url)
    .then((response) => {
      const personagens = response.data.results;
      renderCharacters(personagens);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getTotalPages() {
  return axios
    .get(`${urlCharacters}`)
    .then((response) => {
      const pages = response.data.info.pages;
      return pages;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    paginacao();
    fetchCharacters(currentPage);
  }
}

function paginacao() {
  const paginationContainer = document.getElementById("paginacao");

  const nextButton =
    currentPage < totalPages
      ? `<button type="button" onclick=changePage(${
          currentPage + 1
        }) class="btn btn-secondary col-4 my-4" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: 2rem; --bs-btn-font-size: 1rem;">Próxima</button>`
      : `<button type="button" onclick=changePage(${
          currentPage + 1
        }) class="btn btn-secondary col-4 my-4 disabled" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: 2rem; --bs-btn-font-size: 1rem;">Próxima</button>`;

  const previousButton =
    currentPage > 1
      ? `<button type="button" onclick=changePage(${
          currentPage + -1
        }) class="btn btn-secondary col-4 my-4" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: 2rem; --bs-btn-font-size: 1rem;">Anterior</button>`
      : `<button type="button" onclick=changePage(${
          currentPage + -1
        }) class="btn btn-secondary col-4 my-4 disabled" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: 2rem; --bs-btn-font-size: 1rem;">Anterior</button>`;

  paginationContainer.innerHTML = `
  ${previousButton}
  ${nextButton}
  `;
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
