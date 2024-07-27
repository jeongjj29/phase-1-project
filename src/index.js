const collectionDiv = document.querySelector("#collection");
const descriptionDiv = document.querySelector("#description");

// fetch champion names
function displayCards(searchValue) {
  collectionDiv.innerHTML = "";
  fetch(
    "https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/champion.json"
  )
    .then((res) => res.json())
    .then((lol) => {
      const champions = lol.data;
      if (searchValue) {
        const champArray = Object.keys(champions);
        const championNames = champArray.filter(name => name.startsWith(searchValue))
        // *** add if no champion names match
        championNames.forEach((champion) => {
          createChampionCard(champion);
        });
      } else if (!searchValue) {
        const championNames = Object.keys(champions);
        championNames.forEach((champion) => {
          createChampionCard(champion);
      });
      }
      
    });
}

// creates cards and appends them to the collectionDiv
function createChampionCard(champName) {
  const cardDiv = document.createElement("div");
  cardDiv.id = champName;

  const champNameP = document.createElement("p");
  champNameP.textContent = champName;

  const champImg = document.createElement("img");
  champImg.className = "icon"
  const champImgUrl = `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${champName}.png`;
  convertImageToBase64(champImgUrl).then((dataUrl) => {
    champImg.src = dataUrl;
  });
  champImg.addEventListener("click", () => {
    handleChampionClick(champName);
  })

  cardDiv.append(champImg, champNameP);
  collectionDiv.append(cardDiv);
}

// converts image url into base64
let testImgSrc = "";

async function convertImageToBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// search bar changes what champions are seen
const searchBar = document.querySelector("#search");
searchBar.addEventListener("submit", (e) => {
  e.preventDefault();
  searchValue = searchBar.query.value;
  formattedSearchValue = searchValue.charAt(0).toUpperCase() + searchValue.slice(1).toLowerCase();
  displayCards(formattedSearchValue);
});

function handleChampionClick (championName) {
  descriptionDiv.innerHTML = "";
  fetch(`https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/champion/${championName}.json`)
  .then(res => res.json())
  .then(lol => {
    const data = lol.data;
    const championData = data[championName];
    const name = championData.name;
    const title = championData.title;
    const lore = championData.lore;
    const tags = championData.tags;
    const stats = championData.stats;

    const splashArtImg = document.createElement("img");
    splashArtImg.className = "splashArt"
    const champImgUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${name}_0.jpg`;
    convertImageToBase64(champImgUrl).then((dataUrl) => {
      splashArtImg.src = dataUrl;
    });

    const nameH2 = document.createElement("h2");
    nameH2.textContent = name + " ";
    nameH2.class = "championName"

    const titleSpan = document.createElement("span");
    titleSpan.textContent = title;
    titleSpan.className = "championTitle"
    nameH2.append(titleSpan);

    const loreP = document.createElement("p");
    loreP.textContent = lore;
    loreP.className = "championClass"
    
    
    descriptionDiv.append(nameH2, splashArtImg, loreP)
    
  })
}





displayCards();