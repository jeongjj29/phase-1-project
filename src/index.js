fetch("https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/champion.json")
.then(res => res.json())
.then(lol => {
    const champions = lol.data;
    console.log(champions);
})