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
        const championNames = champArray.filter((name) =>
          name.startsWith(searchValue)
        );
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
  champImg.className = "icon";
  const champImgUrl = `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${champName}.png`;
  convertImageToBase64(champImgUrl).then((dataUrl) => {
    champImg.src = dataUrl;
  });
  champImg.addEventListener("click", () => {
    handleChampionClick(champName);
  });

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
  formattedSearchValue =
    searchValue.charAt(0).toUpperCase() + searchValue.slice(1).toLowerCase();
  displayCards(formattedSearchValue);
});

function handleChampionClick(championName) {
  descriptionDiv.innerHTML = "";
  fetch(
    `https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/champion/${championName}.json`
  )
    .then((res) => res.json())
    .then((lol) => {
      const data = lol.data;
      const championData = data[championName];
      const name = championData.name;
      const title = championData.title;
      const lore = championData.lore;
      const tags = championData.tags;
      const stats = championData.stats;
      const partype = championData.partype;
      const info = championData.info;

      // IMAGE DIV
      const imageDiv = document.createElement("div");
      const splashArtImg = document.createElement("img");
      splashArtImg.className = "splashArt";
      const champImgUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${name}_0.jpg`;
      convertImageToBase64(champImgUrl).then((dataUrl) => {
        splashArtImg.src = dataUrl;
      });
      imageDiv.append(splashArtImg);

      // NAME/TITLE DIV
      const nameTitleDiv = document.createElement("div");
      const nameH2 = document.createElement("h2");
      nameH2.textContent = name + " ";
      nameH2.class = "championName";

      const titleSpan = document.createElement("span");
      titleSpan.textContent = title;
      titleSpan.className = "championTitle";
      nameH2.append(titleSpan);
      nameTitleDiv.append(nameH2);

      // LORE DIV
      const loreDiv = document.createElement("div");
      const loreH2 = document.createElement("h2");
      loreH2.textContent = "Lore:"
      const loreP = document.createElement("p");
      loreP.textContent = lore;
      loreDiv.append(loreH2, loreP);

      // DATA DIV
      const dataDiv = document.createElement("div");
      const classDiv = document.createElement("div");
      const resourceDiv = document.createElement("div");
      const ratingDiv = document.createElement("div");

      dataDiv.append(classDiv, resourceDiv, ratingDiv);

      // STATS
      const statsDiv = document.createElement("div");
      statsDiv.id = "stats";
      const statsH2 = document.createElement("h2");
      statsH2.textContent = "Champion Stats:";

      const hpP = document.createElement("p");
      hpP.textContent = "HP: ";
      const hpValueSpan = document.createElement("span");
      hpValueSpan.textContent = stats.hp;
      const hpPerLvlSpan = document.createElement("span");
      hpPerLvlSpan.textContent = ` ( +${stats.hpperlevel} per Level )`;
      hpP.append(hpValueSpan, hpPerLvlSpan);

      const mpP = document.createElement("p");
      mpP.textContent = "MP: ";
      const mpValueSpan = document.createElement("span");
      mpValueSpan.textContent = stats.mp;
      const mpPerLvlSpan = document.createElement("span");
      mpPerLvlSpan.textContent = ` ( +${stats.mpperlevel} per Level )`;
      mpP.append(mpValueSpan, mpPerLvlSpan);

      const hpregenP = document.createElement("p");
      hpregenP.textContent = "HP Regen: ";
      const hpregenValueSpan = document.createElement("span");
      hpregenValueSpan.textContent = stats.hpregen;
      const hpregenPerLvlSpan = document.createElement("span");
      hpregenPerLvlSpan.textContent = ` ( +${stats.hpregenperlevel} per Level )`;
      hpregenP.append(hpregenValueSpan, hpregenPerLvlSpan);

      const mpregenP = document.createElement("p");
      mpregenP.textContent = "MP Regen: ";
      const mpregenValueSpan = document.createElement("span");
      mpregenValueSpan.textContent = stats.mpregen;
      const mpregenPerLvlSpan = document.createElement("span");
      mpregenPerLvlSpan.textContent = ` ( +${stats.mpregenperlevel} per Level )`;
      mpregenP.append(mpregenValueSpan, mpregenPerLvlSpan);

      const armorP = document.createElement("p");
      armorP.textContent = "Armor: ";
      const armorValueSpan = document.createElement("span");
      armorValueSpan.textContent = stats.armor;
      const armorPerLvlSpan = document.createElement("span");
      armorPerLvlSpan.textContent = ` ( +${stats.armorperlevel} per Level )`;
      armorP.append(armorValueSpan, armorPerLvlSpan);

      const mrP = document.createElement("p");
      mrP.textContent = "Magic Resist: ";
      const mrValueSpan = document.createElement("span");
      mrValueSpan.textContent = stats.spellblock;
      const mrPerLvlSpan = document.createElement("span");
      mrPerLvlSpan.textContent = ` ( +${stats.spellblockperlevel} per Level )`;
      mrP.append(mrValueSpan, mrPerLvlSpan);

      const adP = document.createElement("p");
      adP.textContent = "Attack Damage: ";
      const adValueSpan = document.createElement("span");
      adValueSpan.textContent = stats.attackdamage;
      const adPerLvlSpan = document.createElement("span");
      adPerLvlSpan.textContent = ` ( +${stats.attackdamageperlevel} per Level )`;
      adP.append(adValueSpan, adPerLvlSpan);

      const asP = document.createElement("p");
      asP.textContent = "Attack Speed: ";
      const asValueSpan = document.createElement("span");
      asValueSpan.textContent = stats.attackspeed;
      const asPerLevelSpan = document.createElement("span");
      asPerLevelSpan.textContent = ` ( +${stats.attackspeedperlevel} per Level )`;
      asP.append(asValueSpan, asPerLevelSpan);

      const movespdP = document.createElement("p");
      movespdP.textContent = "Movement Speed: "
      const movespdValueSpan = document.createElement("span");
      movespdValueSpan.textContent = stats.movespeed;
      movespdP.append(movespdValueSpan);

      const atkrngP = document.createElement("p");
      atkrngP.textContent = "Attack Range: ";
      const atkrngValueSpan = document.createElement("span");
      atkrngValueSpan.textContent = stats.attackrange;
      atkrngP.append(atkrngValueSpan);

      statsDiv.append(statsH2, hpP, mpP, hpregenP, mpregenP, armorP, mrP, adP, asP, movespdP, atkrngP);

      descriptionDiv.append(nameTitleDiv, imageDiv, loreDiv, dataDiv, statsDiv);
    });
}

// function that converts stat names
function renameStats(stat) {
  switch (stat) {
    case "hp":
      return "HP";
      break;
    case "hpperlevel":
      return "HP per Level";
      break;
    case "mp":
      return "MP";
      break;
    case "mpperlevel":
      return "MP per Level";
      break;
    case "movespeed":
      return "Move Speed";
      break;
    case "armor":
      return "Armor";
      break;
    case "armorperlevel":
      return "Armor per Level";
      break;
    case "spellblock":
      return "Magic Resist";
      break;
    case "spellblockperlevel":
      return "Magic Resist per Level";
      break;
    case "attackrange":
      return "Attack Range";
      break;
    case "hpregen":
      return "HP Regen";
      break;
    case "hpregenperlevel":
      return "HP Regen per Level";
      break;
    case "mpregen":
      return "MP Regen";
      break;
    case "mpregenperlevel":
      return "MP Regen per Level";
      break;
    case "crit":
      return "Crit";
      break;
  }
}

displayCards();
