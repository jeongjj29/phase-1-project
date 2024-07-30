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
        for (let champion in champions) {
          const championData = champions[champion];
          const championNameLowerCase = champion.toLowerCase();
          const championTags = championData.tags;

          if (
            championNameLowerCase.startsWith(searchValue) &&
            filterByTags(championTags)
          ) {
            const championName = championData.name;
            createChampionCard(champion, championName);
          }
        }
      } else if (!searchValue) {
        for (let champion in champions) {
          const championData = champions[champion];
          const championNameLowerCase = champion.toLowerCase();
          const championTags = championData.tags;

          if (filterByTags(championTags)) {
            const championName = championData.name;
            createChampionCard(champion, championName);
          }
        }
      }
    });
}

function handleCloseButton() {
  descriptionDiv.innerHTML = "";
  descriptionDiv.className = "hidden";
}

// creates cards and appends them to the collectionDiv
function createChampionCard(champId, champName) {
  const cardDiv = document.createElement("div");
  cardDiv.id = champId;

  const champNameP = document.createElement("p");
  champNameP.textContent = champName;

  const champImg = document.createElement("img");
  champImg.className = "icon";
  const champImgUrl = `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${champId}.png`;
  convertImageToBase64(champImgUrl).then((dataUrl) => {
    champImg.src = dataUrl;
  });

  champImg.addEventListener("click", () => {
    handleChampionClick(champId);
  });
  champImg.addEventListener("mouseenter", () => {
    champImg.style.cursor = "pointer";
  });
  champImg.addEventListener("mouseleave", () => {
    champImg.style.cursor = "default";
  });

  cardDiv.append(champImg, champNameP);
  collectionDiv.append(cardDiv);
}

// converts image url into base64
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
  handleCloseButton();
  searchValue = searchBar.query.value.toLowerCase();
  displayCards(searchValue);
  this.query.value = "";
});

const checkboxes = document.querySelectorAll("input[type='checkbox']");
const selectedClasses = new Set();
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    handleCloseButton();
    const checkbox = event.target;
    if (checkbox.checked) {
      selectedClasses.add(checkbox.id);
    } else {
      selectedClasses.delete(checkbox.id);
    }
    const searchValue = searchBar.query.value.toLowerCase();
    displayCards(searchValue);
  });
});

function filterByTags(tags) {
  if (selectedClasses.size === 0) {
    return true;
  } else {
    return [...selectedClasses].every((selectedClass) =>
      tags.includes(selectedClass)
    );
    // return tags.some((tag) => selectedClasses.has(tag));
  }
}

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
      const imageSection = document.createElement("section");
      imageSection.id = "splashArt";
      const splashArtImg = document.createElement("img");
      const champImgUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championName}_0.jpg`;
      convertImageToBase64(champImgUrl).then((dataUrl) => {
        splashArtImg.src = dataUrl;
      });
      imageSection.append(splashArtImg);

      // NAME/TITLE DIV
      const nameTitleSection = document.createElement("section");
      nameTitleSection.id = "name-title";
      const nameH2 = document.createElement("h2");
      nameH2.textContent = name + " ";
      nameH2.class = "championName";

      const titleH3 = document.createElement("h3");
      titleH3.textContent = title;
      titleH3.className = "championTitle";

      const closeDescriptionButton = document.createElement("button");
      closeDescriptionButton.textContent = "X";
      closeDescriptionButton.id = "close-description-box";
      closeDescriptionButton.addEventListener("click", () => {
        handleCloseButton();
      });

      nameTitleSection.append(nameH2, titleH3);

      // LORE DIV
      const loreSection = document.createElement("section");
      loreSection.id = "lore";
      const loreH2 = document.createElement("h2");
      loreH2.textContent = "Lore";
      const loreP = document.createElement("p");
      loreP.textContent = lore;
      loreSection.append(loreH2, loreP);

      // DATA DIV
      const dataSection = document.createElement("section");
      dataSection.id = "data";

      const classDiv = document.createElement("div");
      classDiv.className = "tag";
      const classH3 = document.createElement("h2");
      classH3.textContent = "Classes";
      classDiv.append(classH3);
      tags.forEach(function (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag;
        classDiv.append(tagP);
      });

      const resourceDiv = document.createElement("div");
      resourceDiv.className = "tag";
      const resourceH3 = document.createElement("h2");
      const resourceP = document.createElement("p");
      resourceH3.textContent = "Resource Type";
      resourceP.textContent = partype;
      resourceDiv.append(resourceH3, resourceP);

      const ratingDiv = document.createElement("div");
      ratingDiv.className = "tag";
      const ratingH3 = document.createElement("h2");
      ratingH3.textContent = "Ratings";
      ratingDiv.append(ratingH3);
      for (let rating in info) {
        const ratingP = document.createElement("p");
        const ratingSpan = document.createElement("span");
        ratingSpan.className = "rating-title";
        const formattedRatingText =
          rating.charAt(0).toUpperCase() + rating.slice(1);
        ratingSpan.textContent = formattedRatingText + ": ";
        const ratingValueSpan = document.createElement("span");
        ratingValueSpan.className = "rating-value";
        ratingValueSpan.textContent = info[rating];
        ratingP.append(ratingSpan, ratingValueSpan);
        ratingDiv.append(ratingP);
      }

      dataSection.append(classDiv, resourceDiv, ratingDiv);

      // STATS
      const statsSection = document.createElement("section");
      statsSection.id = "stats";
      const statsH2 = document.createElement("h2");
      statsH2.textContent = "Champion Stats";

      const hpDiv = document.createElement("div");
      hpDiv.className = "stat";
      const hpH4 = document.createElement("h4");
      hpH4.textContent = "Health";
      const hpValueSpan = document.createElement("span");
      hpValueSpan.textContent = stats.hp;
      const hpPerLvlSpan = document.createElement("span");
      hpPerLvlSpan.textContent = ` ( +${stats.hpperlevel} per Level )`;
      const hpSpan = document.createElement("span");
      hpDiv.append(hpH4, hpValueSpan, hpPerLvlSpan);

      const mpDiv = document.createElement("div");
      mpDiv.className = "stat";
      const mpH4 = document.createElement("h4");
      mpH4.textContent = "Resource";
      const mpValueSpan = document.createElement("span");
      mpValueSpan.textContent = stats.mp ? stats.mp : "N/A";
      const mpPerLvlSpan = document.createElement("span");
      mpPerLvlSpan.textContent = stats.mpperlevel
        ? ` ( +${stats.mpperlevel} per Level )`
        : "";
      if (stats.mp) {
        mpDiv.append(mpH4, mpValueSpan, mpPerLvlSpan);
      } else {
        mpDiv.append(mpH4, mpValueSpan);
      }

      const hpregenDiv = document.createElement("div");
      hpregenDiv.className = "stat";
      const hpregenH4 = document.createElement("h4");
      hpregenH4.textContent = "Health Regen";
      const hpregenValueSpan = document.createElement("span");
      hpregenValueSpan.textContent = stats.hpregen;
      const hpregenPerLvlSpan = document.createElement("span");
      hpregenPerLvlSpan.textContent = ` ( +${stats.hpregenperlevel} per Level )`;
      hpregenDiv.append(hpregenH4, hpregenValueSpan, hpregenPerLvlSpan);

      const mpregenDiv = document.createElement("div");
      mpregenDiv.className = "stat";
      const mpregenH4 = document.createElement("h4");
      mpregenH4.textContent = "Resource Regen";
      const mpregenValueSpan = document.createElement("span");
      mpregenValueSpan.textContent = stats.mpregen ? stats.mpregen : "N/A";
      const mpregenPerLvlSpan = document.createElement("span");
      mpregenPerLvlSpan.textContent = stats.mpregenperlevel
        ? ` ( +${stats.mpregenperlevel} per Level )`
        : "";
      if (stats.mp) {
        mpregenDiv.append(mpregenH4, mpregenValueSpan, mpregenPerLvlSpan);
      } else {
        mpregenDiv.append(mpregenH4, mpregenValueSpan);
      }

      const armorDiv = document.createElement("div");
      armorDiv.className = "stat";
      const armorH4 = document.createElement("h4");
      armorH4.textContent = "Armor";
      const armorValueSpan = document.createElement("span");
      armorValueSpan.textContent = stats.armor;
      const armorPerLvlSpan = document.createElement("span");
      armorPerLvlSpan.textContent = ` ( +${stats.armorperlevel} per Level )`;
      armorDiv.append(armorH4, armorValueSpan, armorPerLvlSpan);

      const mrDiv = document.createElement("div");
      mrDiv.className = "stat";
      const mrH4 = document.createElement("h4");
      mrH4.textContent = "Magic Resist";
      const mrValueSpan = document.createElement("span");
      mrValueSpan.textContent = stats.spellblock;
      const mrPerLvlSpan = document.createElement("span");
      mrPerLvlSpan.textContent = ` ( +${stats.spellblockperlevel} per Level )`;
      mrDiv.append(mrH4, mrValueSpan, mrPerLvlSpan);

      const adDiv = document.createElement("div");
      adDiv.className = "stat";
      const adH4 = document.createElement("h4");
      adH4.textContent = "Attack Damage";
      const adValueSpan = document.createElement("span");
      adValueSpan.textContent = stats.attackdamage;
      const adPerLvlSpan = document.createElement("span");
      adPerLvlSpan.textContent = ` ( +${stats.attackdamageperlevel} per Level )`;
      adDiv.append(adH4, adValueSpan, adPerLvlSpan);

      const asDiv = document.createElement("div");
      asDiv.className = "stat";
      const asH4 = document.createElement("h4");
      asH4.textContent = "Attack Speed: ";
      const asValueSpan = document.createElement("span");
      asValueSpan.textContent = stats.attackspeed;
      const asPerLevelSpan = document.createElement("span");
      asPerLevelSpan.textContent = ` ( +${stats.attackspeedperlevel}% per Level )`;
      asDiv.append(asH4, asValueSpan, asPerLevelSpan);

      const movespdDiv = document.createElement("div");
      movespdDiv.className = "stat";
      const movespdH4 = document.createElement("h4");
      movespdH4.textContent = "Movement Speed: ";
      const movespdValueSpan = document.createElement("span");
      movespdValueSpan.textContent = stats.movespeed;
      movespdDiv.append(movespdH4, movespdValueSpan);

      const atkrngDiv = document.createElement("div");
      atkrngDiv.className = "stat";
      const atkrngH4 = document.createElement("h4");
      atkrngH4.textContent = "Attack Range: ";
      const atkrngValueSpan = document.createElement("span");
      atkrngValueSpan.textContent = stats.attackrange;
      atkrngDiv.append(atkrngH4, atkrngValueSpan);

      const statsContainerDiv = document.createElement("div");
      statsContainerDiv.id = "stats-container";
      statsContainerDiv.append(
        statsH2,
        hpDiv,
        hpregenDiv,
        mpDiv,
        mpregenDiv,
        armorDiv,
        mrDiv,
        adDiv,
        asDiv,
        movespdDiv,
        atkrngDiv
      );
      statsSection.append(statsContainerDiv);

      const infoContainerDiv = document.createElement("div");
      infoContainerDiv.id = "champion-info";
      infoContainerDiv.append(
        imageSection,
        loreSection,
        statsSection,
        dataSection
      );

      descriptionDiv.append(
        nameTitleSection,
        infoContainerDiv,
        closeDescriptionButton
      );
      descriptionDiv.className = "";
    });
}

displayCards();
