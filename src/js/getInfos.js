// Pegando informações
function getCharacterCount() {
    return axios.get(urlCharacters).then((response) => {
      return response.data.info.count;
    });
  }
  
  function getLocationCount() {
    return axios.get(urlLocations).then((response) => {
      return response.data.info.count;
    });
  }
  
  function getEpisodeCount() {
    return axios.get(urlEpisodes).then((response) => {
      return response.data.info.count;
    });
  }
  
  function updateContainer(containerId, label, count) {
    const container = document.getElementById(containerId);
    container.innerText = `${label}: ${count}`;
  }
  
  function getInfos() {
    Promise.all([getCharacterCount(), getLocationCount(), getEpisodeCount()])
      .then(([charactersCount, locationsCount, episodesCount]) => {
        updateContainer("characters", "PERSONAGENS", charactersCount);
        updateContainer("location", "LOCALIZAÇÕES", locationsCount);
        updateContainer("episodes", "EPISÓDIOS", episodesCount);
      })
      .catch((error) => {
        console.error("Erro ao obter informações:", error);
      });
  }