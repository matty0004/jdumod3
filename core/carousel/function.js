const { CloneObject, readDatabaseJson } = require('../function')
const fs = require('fs')
const cClass = require("./classList.json");
const songdb = require("../../database/Platforms/jdparty-all/songdbs.json")
var carousel = {};
var mostPlayed = require(`${__dirname}/../../database/carousel/mostplayed.json`)

function updateMostPlayed(maps) {
  if (mostPlayed[`${getWeekNumber()}`] == undefined) mostPlayed[`${getWeekNumber()}`] = Object.assign({})
  var week = mostPlayed[`${getWeekNumber()}`]
  if (week[maps]) {
    week[maps]++;
  } else {
    week[maps] = 1;
  }
  mostPlayed[`${getWeekNumber()}`] = week
  //backing up to avoid server restarted
  fs.writeFileSync(`${__dirname}/../../database/carousel/mostplayed.json`, JSON.stringify(mostPlayed, null, 2));
}

function addCategories(categories) {
  const a = Object.assign({}, categories);
  carousel.categories.push(a);
}

function generateCategories(name, items, type = "partyMap") {
  var g = Object.assign({}, cClass.categoriesClass);
  g.title = name;
  g.items = generatePartymap(items, type);
  g.items.push(cClass.itemSuffleClass)
  return g;
}

function generatePartymap(arrays, type = "partyMap") {
  var i = [];
  for (let n = 0; n < arrays.length; n++) {
    const m = Object.assign({}, cClass.itemClass);
    const a = JSON.parse(JSON.stringify(cClass.itemClass.components))
    a[0].mapName = arrays[n]
    m.components = a
    m.actionList = type
    i.push(m);

  }
  return i;
}

function filterSongsByFirstLetter(songdbs, filter) {
  const filteredSongdbs = songdbs.filter((song, index) => {
    const title = songdb[song].title.toLowerCase();
    const regex = new RegExp(`^[${filter}].*`);
    return regex.test(title);
  });

  // Custom sorting: Sort by title first, then by special suffixes
  filteredSongdbs.sort((a, b) => {
    const titleA = (songdb[a].title + songdb[a].mapName).toLowerCase();
    const titleB = (songdb[b].title + songdb[b].mapName).toLowerCase();
    const specialSuffixes = ["alt", "vip", "ext", "swt", "fan", "osc"];

    const suffixIndexA = specialSuffixes.findIndex(suffix => titleA.endsWith(suffix));
    const suffixIndexB = specialSuffixes.findIndex(suffix => titleB.endsWith(suffix));

    if (suffixIndexA !== -1) {
      if (suffixIndexB !== -1) {
        return titleA.localeCompare(titleB);
      } else {
        return 1; // Special suffix comes after other titles
      }
    } else if (suffixIndexB !== -1) {
      return -1; // Other titles come before special suffix
    } else {
      return titleA.localeCompare(titleB);
    }
  });

  return filteredSongdbs;
}

function filterSongsByJDVersion(songdbs, filter) {
  const filteredSongdbs = songdbs.filter((song, index) => {
    const version = songdb[song].originalJDVersion;
    return version === filter;
  });

  // Custom sorting: Sort by title first, then by special suffixes
  filteredSongdbs.sort((a, b) => {
    const titleA = (songdb[a].title + songdb[a].mapName).toLowerCase();
    const titleB = (songdb[b].title + songdb[b].mapName).toLowerCase();
    const specialSuffixes = ["alt", "vip", "ext", "swt", "fan", "osc"];

    const suffixIndexA = specialSuffixes.findIndex(suffix => titleA.endsWith(suffix));
    const suffixIndexB = specialSuffixes.findIndex(suffix => titleB.endsWith(suffix));

    if (suffixIndexA !== -1) {
      if (suffixIndexB !== -1) {
        return titleA.localeCompare(titleB);
      } else {
        return 1; // Special suffix comes after other titles
      }
    } else if (suffixIndexB !== -1) {
      return -1; // Other titles come before special suffix
    } else {
      return titleA.localeCompare(titleB);
    }
  });

  return filteredSongdbs;
}

function getGlobalPlayedSong() {
  try {
  const obj = Object.entries(mostPlayed[`${getWeekNumber()}`])
    .sort((a, b) => b[1] - a[1])
    .map(item => item[0]);
  return obj; }
  catch(err) {
    return [];
  }
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(0, 24);
}
function processPlaylists(playlists) {
  playlists.forEach(playlist => {
    var playlistName = playlist.name;
    var songList = playlist.songlist;
    if (!playlistName.startsWith("DFRecommendedFU")) addCategories(generateCategories(`[icon:PLAYLIST] ${playlistName}`, songList));
  });
}
function generateWeeklyRecommendedSong(playlists) {
  playlists.forEach(playlist => {
    var playlistName = playlist.name;
    var songList = playlist.songlist;
    var RecommendedName = playlist.RecommendedName || "";
    if (playlistName == `DFRecommendedFU${getWeekNumber()}`) addCategories(generateCategories(`[icon:PLAYLIST] Weekly: ${RecommendedName}`, songList));
  });
}
function getWeekNumber() {
  const now = new Date();
  const startOfWeek = new Date(now.getFullYear(), 0, 1);
  const daysSinceStartOfWeek = Math.floor(
    (now - startOfWeek) / (24 * 60 * 60 * 1000)
  );
  const weekNumber = Math.ceil((daysSinceStartOfWeek + 1) / 7);
  return weekNumber;
}
function addJDVersion(songdbs) {
  addCategories(generateCategories("Just Dance 2024 Edition", filterSongsByJDVersion(songdbs, 2024)))
  addCategories(generateCategories("Just Dance 2023 Edition", filterSongsByJDVersion(songdbs, 2023)))
  addCategories(generateCategories("Just Dance 2022", filterSongsByJDVersion(songdbs, 2022)))
  addCategories(generateCategories("Just Dance 2021", filterSongsByJDVersion(songdbs, 2021)))
  addCategories(generateCategories("Just Dance 2020", filterSongsByJDVersion(songdbs, 2020)))
  addCategories(generateCategories("Just Dance 2019", filterSongsByJDVersion(songdbs, 2019)))
  addCategories(generateCategories("Just Dance 2018", filterSongsByJDVersion(songdbs, 2018)))
  addCategories(generateCategories("Just Dance 2017", filterSongsByJDVersion(songdbs, 2017)))
  addCategories(generateCategories("Just Dance 2016", filterSongsByJDVersion(songdbs, 2016)))
  addCategories(generateCategories("Just Dance 2015", filterSongsByJDVersion(songdbs, 2015)))
  addCategories(generateCategories("Just Dance 2014", filterSongsByJDVersion(songdbs, 2014)))
  addCategories(generateCategories("Just Dance 4", filterSongsByJDVersion(songdbs, 4)))
  addCategories(generateCategories("Just Dance 3", filterSongsByJDVersion(songdbs, 3)))
  addCategories(generateCategories("Just Dance 2", filterSongsByJDVersion(songdbs, 2)))
  addCategories(generateCategories("Just Dance 1", filterSongsByJDVersion(songdbs, 1)))
  addCategories(generateCategories("Just Dance Kids", filterSongsByJDVersion(songdbs, 123)))
  addCategories(generateCategories("ABBA: You Can Dance", filterSongsByJDVersion(songdbs, 4884)))
  addCategories(generateCategories("Just Dance Vitality School", filterSongsByJDVersion(songdbs, 4514)))
}

function generateCoopCarousel() {
  return generateRivalCarousel()
}

function generateRivalCarousel() {
  carousel = {};
  carousel = CloneObject(cClass.rootClass);
  carousel.actionLists = cClass.actionListsClass
  var songdbs = Object.keys(songdb)
  var songfbs2 = CloneObject(songdbs)
  const songs2023 = filterSongsByJDVersion(songdbs, 2023); // Ensure 2023 is the correct JD version

  // Log a specific song from the filtered list to check its details
  //Home Section
  addCategories(generateCategories("Recommended For You", CloneObject(shuffleArray(songdbs))))
  generateWeeklyRecommendedSong(readDatabaseJson("carousel/playlist.json"))
  processPlaylists(readDatabaseJson("carousel/playlist.json"));
  addCategories(generateCategories(`Weekly Popular ${getWeekNumber()}`, getGlobalPlayedSong()))
  addCategories(generateCategories("Just Dance Next", songfbs2))
  //Add Original JD Songs
  addJDVersion(songdbs)
  //Playlist Section
  addCategories(Object.assign({}, cClass.searchCategoryClass))
  return carousel
}

module.exports = {
  generateRivalCarousel, generateCoopCarousel, updateMostPlayed
}