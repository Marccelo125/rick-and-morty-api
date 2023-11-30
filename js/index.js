const baseURL = "https://rickandmortyapi.com/api/character";

axios
  .get(baseURL)
  .then((response) => {
    const allCharactesInPage = response.data.results //.results para os personagens desta pag, end em .data tem info.next que mostra o link da prox pag

    allCharactesInPage.forEach(character => {
        const characterList = document.createElement("article")
        const newCharacter = document.createElement("p")

        if(character.status === 'Alive') {
            allCharactesInPage.splice(character)
        }
    
        newCharacter.innerHTML = `
        <p class="character-name">${character.name}</p>
        <p class="character-status">${character.status}</p>
        `

        document.body.appendChild(characterList)
        characterList.appendChild(newCharacter)
    });
  })
  .catch((error) => {
    console.log(error);
  });
