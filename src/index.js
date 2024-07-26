const collectionDiv = document.querySelector("#collection");

fetch("https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/champion.json")
  .then((res) => res.json())
  .then((lol) => {
    const champions = lol.data;
    const championNames = Object.keys(champions);
    championNames.forEach(champion => {
        createChampionCard(champion);
    })
  });

function createChampionCard(champName) {
  const cardDiv = document.createElement("div");
  cardDiv.id = champName;

  const champNameP  = document.createElement("p");
  champNameP.textContent = champName;

  const champImg = document.createElement("img");
  const champImgUrl = `https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${champName}.png`;
  convertImageToBase64(champImgUrl).then((dataUrl) => {
    champImg.src = dataUrl;
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
