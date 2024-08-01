const collectionDiv = document.querySelector("#collection");
const descriptionDiv = document.querySelector("#description");
const commentSectionDiv = document.querySelector("#comment-section");
const commentListUl = document.querySelector("#comment-list");
const searchBar = document.querySelector("#search");
const checkboxes = document.querySelectorAll("input[type='checkbox']");

const championsArray = [];
const selectedClasses = new Set();

// INITIAL FETCH
function getChampions() {
  fetch(
    "https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/champion.json"
  )
    .then((res) => res.json())
    .then((lol) => {
      championsArray.push(...Object.values(lol.data));
    })
    .then(() => {
      addSearchListener();
      addCheckBoxListener();
      displayCards();
    });
}

// DISPLAYS CARDS BASED ON SEARCHVALUE AND CHECKBOXES
function displayCards(searchValue) {
  collectionDiv.innerHTML = "";
  const champions = championsArray
    .filter((champion) => {
      if (searchValue) {
        return champion.id.toLowerCase().startsWith(searchValue);
      } else {
        return true;
      }
    })
    .filter((champion) => filterByTags(champion.tags));

  champions.forEach((champion) =>
    createChampionCard(champion.id, champion.name, champion.tags)
  );
}

// CREATES CARDS AND APPENDS THEM TO THE COLLECTION DIV
function createChampionCard(champId, champName, championTags) {
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

  cardDiv.append(champImg, champNameP);
  collectionDiv.append(cardDiv);
}

// CONVERTS URL IMAGES TO BASE64
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

// SENDS GET REQUEST FOR COMMENTS
function getComments(championName) {
  fetch(`http://localhost:3000/champions/${championName}`)
    .then((res) => res.json())
    .then((data) => {
      commentSectionDiv.className = "";
      commentListUl.innerHTML = "";

      const comments = data.comments;
      // const sortedComments = comments.sort(
      //   (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
      // );
      // console.log(sortedComments);
      comments.forEach((element) => {
        appendCommentLi(element, comments, championName);
      });
    });
}

// ADDS NEW-COMMENT-FORM AND APPENDS TO COMMENT SECTION
function addCommentForm(championName) {
  const formExists = document.querySelector("#new-comment-form");
  if (formExists) {
    formExists.remove();
  }
  const usernameLabel = document.createElement("label");
  usernameLabel.textContent = "Username: ";
  usernameLabel.setAttribute("for", "username");

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "username";
  usernameInput.name = "username";

  const commentLabel = document.createElement("label");
  commentLabel.textContent = "Comment: ";
  commentLabel.setAttribute("for", "comment");

  const commentTextArea = document.createElement("textarea");
  commentTextArea.id = "comment";
  commentTextArea.name = "comment";
  commentTextArea.rows = 5;
  commentTextArea.cols = "35";

  const commentInput = document.createElement("input");
  commentInput.type = "submit";
  commentInput.id = "submit-button";
  commentInput.value = "Post Comment";

  const commentForm = document.createElement("form");
  commentForm.id = "new-comment-form";
  commentForm.append(
    usernameLabel,
    usernameInput,
    commentLabel,
    commentTextArea,
    commentInput
  );

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleCommentFormSubmit(championName);
  });

  commentSectionDiv.insertBefore(commentForm, commentListUl);
}

// APPENDS COMMENT TO COMMENT LIST UL
function appendCommentLi(element, comments, championName) {
  const userNameSpan = document.createElement("span");
  userNameSpan.textContent = element.username;

  const dateSpan = document.createElement("span");
  const date = new Date(element.dateCreated);
  const formattedDate =
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  dateSpan.textContent = formattedDate;

  const commentP = document.createElement("p");
  commentP.textContent = element.comment;

  const commentLi = document.createElement("li");
  commentLi.append(userNameSpan, dateSpan, commentP);

  const deleteCommentButton = document.createElement("button");
  deleteCommentButton.textContent = "Delete";
  deleteCommentButton.addEventListener("click", () => {
    const updatedComments = comments.filter((comment) => comment !== element);
    fetch(`http://localhost:3000/champions/${championName}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comments: updatedComments }),
    }).then(() => commentLi.remove());
  });
  commentLi.append(deleteCommentButton);

  if (document.querySelector("li")) {
    commentListUl.insertBefore(commentLi, document.querySelector("li"));
  } else {
    commentListUl.append(commentLi);
  }
}

// RETURNS CLASS CHECKED IN CHECKBOXES
function filterByTags(tags) {
  if (selectedClasses.size === 0) {
    return true;
  } else {
    return [...selectedClasses].every((selectedClass) =>
      tags.includes(selectedClass)
    );
  }
}

// ADDS EVENT LISTENERS
function addSearchListener() {
  searchBar.addEventListener("submit", (e) => {
    e.preventDefault();
    handleCloseButton();
    searchValue = searchBar.query.value.toLowerCase();
    displayCards(searchValue);
    // this.query.value = "";
  });
}
function addCheckBoxListener() {
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
}

// HANDLES EVENTS
function handleChampionClick(championName) {
  handleCloseButton(championName);

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

      console.log(stats);

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
      const loreH3 = document.createElement("h3");
      loreH3.textContent = "Lore";
      const loreP = document.createElement("p");
      loreP.textContent = lore;
      loreSection.append(loreH3, loreP);

      // DATA DIV
      const dataSection = document.createElement("section");
      dataSection.id = "data";

      const classDiv = document.createElement("div");
      classDiv.className = "tag";
      const classH3 = document.createElement("h3");
      classH3.textContent = "Classes";
      classDiv.append(classH3);
      tags.forEach(function (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag;
        classDiv.append(tagP);
      });

      const resourceDiv = document.createElement("div");
      resourceDiv.className = "tag";
      const resourceH3 = document.createElement("h3");
      const resourceP = document.createElement("p");
      resourceH3.textContent = "Resource Type";
      resourceP.textContent = partype;
      resourceDiv.append(resourceH3, resourceP);

      const ratingDiv = document.createElement("div");
      ratingDiv.className = "tag";
      const ratingH3 = document.createElement("h3");
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
      const statsH3 = document.createElement("h3");
      statsH3.textContent = "Stats";

      const statDivs = [
        createStatElement("Health", stats.hp, stats.hpperlevel),
        createStatElement("HP Regen", stats.hpregen, stats.hpregenperlevel),
        createStatElement("Resource", stats.mp, stats.mpperlevel),
        createStatElement(
          "Resource Regen",
          stats.mpregen,
          stats.mpregenperlevel
        ),
        createStatElement("Armor", stats.armor, stats.armorperlevel),
        createStatElement(
          "Magic Resist",
          stats.spellblock,
          stats.spellblockperlevel
        ),
        createStatElement(
          "Attack Damage",
          stats.attackdamage,
          stats.attackdamageperlevel
        ),
        createStatElement(
          "Attack Speed",
          stats.attackspeed,
          stats.attackspeedperlevel
        ),
        createStatElement(
          "Movement Speed",
          stats.movespeed,
          stats.movespeedperlevel
        ),
        createStatElement(
          "Attack Range",
          stats.attackrange,
          stats.attackrangeperlevel
        ),
      ];
      statsSection.append(statsH3, ...statDivs);

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
  addCommentForm(championName);
  getComments(championName);
  window.scrollTo({
    top: 100,
    behavior: "smooth",
  });
}

function createStatElement(statName, baseValue, perLevel) {
  const statDiv = document.createElement("div");
  statDiv.className = "stat";

  const statH4 = document.createElement("h5");
  statH4.textContent = statName;

  const statValueSpan = document.createElement("span");
  statValueSpan.textContent = baseValue ? baseValue : "N/A";

  const statPerLevelSpan = document.createElement("span");
  statPerLevelSpan.textContent = perLevel ? ` ( +${perLevel} per Level )` : "";

  statDiv.append(statH4, statValueSpan, statPerLevelSpan);

  return statDiv;
}

// RETURNS MODIFIED STAT NAME
// function modifyStatName(stat) {
//   switch (stat) {
//     case "hp":
//       return "Health";
//       break;
//     case "hpregen":
//       return "Health Regen";
//       break;
//     case "mp":
//       return "Resource";
//       break;
//     case "mpregen":
//       return "Resource Regen";
//       break;
//     case "armor":
//       return "Armor";
//       break;
//     case "spellblock":
//       return "Magic Resist";
//       break;
//     case "attackdamage":
//       return "Attack Damage";
//       break;
//     case "attackspeed":
//       return "Attack Speed";
//       break;
//     case "movespeed":
//       return "Movement Speed";
//       break;
//     case "attackrange":
//       return "Attack Range";
//       break;
//     default:
//       return "Stat Not Found";
//   }
// }

function handleCommentFormSubmit(championName) {
  fetch(`http://localhost:3000/champions/${championName}`)
    .then((res) => res.json())
    .then((data) => {
      const newComments = data.comments;
      const commentForm = document.querySelector("#new-comment-form");
      const newComment = {
        username: commentForm.username.value,
        dateCreated: new Date(),
        comment: commentForm.comment.value,
      };
      newComments.push(newComment);

      fetch(`http://localhost:3000/champions/${championName}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comments: newComments,
        }),
      }).then(() => {
        commentForm.reset;
        appendCommentLi(newComment);
      });
    });
}

function handleCloseButton() {
  descriptionDiv.innerHTML = "";
  descriptionDiv.className = "hidden";
  commentListUl.innerHTML = "";
  const newCommentForm = document.querySelector("#new-comment-form");
  if (newCommentForm) {
    newCommentForm.remove();
  }
  commentSectionDiv.className = "hidden";
}

getChampions();
