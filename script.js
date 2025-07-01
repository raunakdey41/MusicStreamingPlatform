// A set of commonly used music tags
const musicTags = [
  // Core genres
  "pop", "rock", "hiphop", "rap", "jazz", "blues", "metal", "punk", "classical", "country",
  "reggae", "funk", "disco", "soul", "rnb", "edm", "house", "techno", "trance", "dubstep",
  "trap", "lo-fi", "acoustic", "instrumental", "indie", "alternative", "grunge", "ambient", "chillout", "experimental",

  // Moods & energy
  "happy", "sad", "energetic", "calm", "dark", "romantic", "aggressive", "dreamy", "epic", "relaxing",
  "uplifting", "melancholic", "funky", "groovy", "peaceful",

  // Use-cases
  "workout", "background", "party", "cinematic", "travel", "vlog", "gaming", "meditation", "intro", "trailer",
  "documentary", "nature", "action", "corporate", "fashion",

  // Instruments & production
  "guitar", "piano", "synth", "drums", "violin", "bass", "vocal", "beat", "strings", "saxophone",

  // Modern/Niche subgenres
  "phonk", "hyperpop", "glitch", "synthwave", "drill", "shoegaze", "folk", "tech house", "afrobeats", "future bass",

  // Production descriptors
  "lofi beats", "clean vocals", "heavy bass", "dry mix", "808", "analog", "distorted", "layered", "live", "studio",

  // Cultural/Regional styles
  "k-pop", "j-pop", "latin", "reggaeton", "bhangra", "bollywood", "celtic", "arabic", "afrobeat", "tropical",

  // English & Western Pop/Rock/Rap
  "taylor swift", "selena gomez", "billie eilish", "dua lipa", "bruno mars", "justin bieber", "ed sheeran",  "rihanna", "drake", "weeknd", "charlie puth", "shawn mendes", "post malone", "kanye west", "beyoncé", "avicii", "lil nas x", "eminem",

  // Indian Playback (Hindi/Bollywood)
  "atif aslam", "udit narayan", "alka yagnik", "neha kakkar", "jubin nautiyal", "palak muchhal", "sunidhi chauhan", "kishore kumar", "lata mangeshkar", "mohit chauhan", "arijit singh", "sonu nigam","shreya ghoshal", 

  // South Indian + Regional
  "sid sriram", "anirudh ravichander", "shankar mahadevan", "karthik", "chinmayi sripada",

  // K-pop & Asian Artists
  "iu", "jungkook", "taeyeon", "blackpink", "stray kids",

  // Indie / International / Folk
  "prateek kuhad", "anish sasha", "adele", "lorde", "norah jones", "john mayer",
  "hozier", "lewis capaldi", "sigrid", "aurora"
];
const id = `da69b01d`;
const main_url = `https://api.jamendo.com/v3.0/tracks/?client_id=${id}&format=json&limit=35&search=${musicTags[Math.ceil(Math.random()*35)]}` // URL to fetch songs for the main section
const queue_url = `https://api.jamendo.com/v3.0/tracks/?client_id=${id}&format=json&limit=20&search=${musicTags[Math.floor(Math.random()*15)]}`// URL to fetch songs for the queue section

// Storage variable for the searchbar

let dropdown = document.getElementById("dropdown"); // To store the dropdown elements
let searchBar = document.getElementById("searchbar"); // To store the input and appearance of search bar
const searchButton = document.getElementById("searchButton"); // To store the search button 

// Storage variables for the display bar items

let currentState; // To access the current state of any attribute
let displayBar = document.getElementById("display"); // The sign for showing/hiding the bar
let bar = document.getElementById("music-control");// The footer section
let playPause = document.getElementById("play"); // Play button on the media control bar

// Storage variables for volume

let musicCursor = document.getElementById("musicCircleCursor"); // To store the cursor
let volumeIcon = document.getElementById("VolumeIcon"); // TO store the volume icon and change it

// Storage variables for song and its elements

let songContainer = document.querySelectorAll(".song-container"); // Store the entire box of songs
let songTiles = document.querySelectorAll(".song-tiles") // Store arrays for the entire tiles
let singerNames = document.querySelectorAll(".singer-name") // Store arrays of the singers' name
let songNames = document.querySelectorAll(".song-name"); // Store arrays of the song tiles
let songTileImages = document.querySelectorAll(".song-tile-images"); // Store the images of the songs
let queueTiles = document.querySelectorAll(".queue-song"); // Store the tiles of the queue
let NextSongID; // To store the ID of the first song in the upcoming queue list
let currentAudio = null; // To store the audio of the current song
let currentSongID; // To store the ID of the current song
const autoplay = document.getElementById("autoplay"); // To store the control of autoplay button

const shareLink = {}; // To store the shareable link of the songs stored
const songAudio = {}; // To store the audio tracks of the songs stored
const playingSongName = {} // To store the names of the songs stored

const current = document.getElementById("displayBar-playing"); // To access the footer div
const currentSongImage = document.getElementById("playing"); // To access the image div in footer
const currentSong = document.getElementById("CurrentSong"); // To access the current song area in footer
const currentSinger = document.getElementById("CurrentSinger"); // To access the current singer area in footer

// Fetch songs from Jamendo as soon as window loads
document.addEventListener("DOMContentLoaded", () => {
    fetchMainSongs();
    document.getElementById("displayBar-playing").style.display = "none";
})

// Handle clicking of logo
document.getElementById("logo").addEventListener("click", () => {
    fetchMainSongs();
})

// Place songs in the main section both from DOMLoad and search
function placeMainSongs(content){
    console.log(content);

    content.forEach((song, index) => {
        if (index >= songTiles.length) return; // Prevent overflow

        // Set image src and tile id
        songTileImages[index].setAttribute("src", song.image);
        songTiles[index].setAttribute("id", song.id);

        // Set song name and artist name
        songNames[index].textContent = song.name;
        singerNames[index].textContent = song.artist_name;

        // Set the share link
        shareLink[song.id] = song.shareurl;
        songAudio[song.id] = song["audio"];
        playingSongName[song.id] = song["name"];
    });
}

// Fetch songs from Jamendo only for the main songs section
async function fetchMainSongs() {
    let fetchedMainsongs = await fetch(main_url);
    fetchedMainsongs = await fetchedMainsongs.json();
    const content = fetchedMainsongs.results;

    placeMainSongs(content);
}

// Fetch songs from Jamendo only for the queue section
async function fetchQueueSongs() {
    document.getElementById("queue-heading").textContent = "Upcoming Tracks";

    let fetchedQueuesongs = await fetch(queue_url);
    fetchedQueuesongs = await fetchedQueuesongs.json();
    const content = fetchedQueuesongs.results;

    const queueContainer = document.getElementById("queue-songs");

    queueContainer.innerHTML = ""; // Clear previous content if needed

    content.forEach(song => {

        songAudio[song.id] = song.audio;
        playingSongName[song.id] = song.name;

        // Create the tile container
        const tile = document.createElement("div");
        tile.className = "queue-song flexbox border manrope selected";
        tile.setAttribute("id", song.id);

        // Create and set up the image
        const image = document.createElement("img");
        image.className = "queue-song-image border";
        image.setAttribute("src", song.image);
        image.setAttribute("alt", "Upcoming song");

        // Create the details container
        const details = document.createElement("div");
        details.className = "queue-song-details";

        // Create and set song name
        const songName = document.createElement("p");
        songName.className = "queue-song-name white";
        songName.textContent = song.name;

        // Create and set artist name
        const artistName = document.createElement("p");
        artistName.className = "queue-singer-name gray";
        artistName.textContent = song.artist_name;

        // Append name and artist to details container
        details.appendChild(songName);
        details.appendChild(artistName);
        details.style.overflow = "hidden";

        // Append image and details to tile
        tile.appendChild(image);
        tile.appendChild(details);

        // Finally, append tile to the main container
        queueContainer.appendChild(tile);
    });

    NextSongID = queueContainer.firstChild.getAttribute("id");
}

// Fetch songs from Jamendo only for the artist(library) section
async function fetchAlbumSongs(artist_name) {
    console.log(`Called ${artist_name}`);
    document.getElementById("library-heading").textContent = `More from ${artist_name}`;

    const album_url = `https://api.jamendo.com/v3.0/tracks/?client_id=${id}&format=json&limit=20&search=${artist_name}`// URL to fetch songs for the artist section
    let fetchedAlbumsongs = await fetch(album_url);
    fetchedAlbumsongs = await fetchedAlbumsongs.json();
    const content = fetchedAlbumsongs.results;

    const queueContainer = document.getElementById("library-songs");

    queueContainer.innerHTML = ""; // Clear previous content if needed

    content.forEach(song => {

        if(song.artist_name === artist_name){

            songAudio[song.id] = song.audio;
            playingSongName[song.id] = song.name;

            // Create the tile container
            const tile = document.createElement("div");
            tile.className = "queue-song flexbox border manrope selected";
            tile.setAttribute("id", song.id);

            // Create and set up the image
            const image = document.createElement("img");
            image.className = "queue-song-image border";
            image.setAttribute("src", song.image);
            image.setAttribute("alt", "Upcoming song");

            // Create the details container
            const details = document.createElement("div");
            details.className = "queue-song-details";

            // Create and set song name
            const songName = document.createElement("p");
            songName.className = "queue-song-name white";
            songName.textContent = song.name;

            // Create and set artist name
            const artistName = document.createElement("p");
            artistName.className = "queue-singer-name gray";
            artistName.textContent = song.artist_name;

            // Append name and artist to details container
            details.appendChild(songName);
            details.appendChild(artistName);
            details.style.overflow = "hidden";

            // Append image and details to tile
            tile.appendChild(image);
            tile.appendChild(details);

            // Finally, append tile to the main container
            queueContainer.appendChild(tile);
        }
    });
}

// Handling the searchbar and dropdown appearance
{
    // Handling the searchbar appearance
    searchBar.addEventListener("mouseover", function(){
        searchBar.style.cssText =
        `filter: opacity(1);
        `
    });
    searchBar.addEventListener("keydown", function(){
        searchBar.style.cssText =
        `filter: opacity(1);
        `
    });
    searchBar.addEventListener("mouseleave", function(){
        searchBar.style.cssText =
        `filter: opacity(0.4);
        `
    });

    // Handling the dropdown menu appearance
    dropdown.addEventListener("click", function(){
        dropdown.style.cssText =
        `filter: opacity(1);
        `
    });
    dropdown.addEventListener("mouseover", function(){
        dropdown.style.cssText =
        `filter: opacity(1);
        `
    });
    dropdown.addEventListener("mouseleave", function(){
        dropdown.style.cssText =
        `filter: opacity(0.4);
        `
    });
}

// Handling search operations
{
    async function search(name, type) {
        const Today = new Date().toISOString().split("T")[0];// fetching current date

        document.getElementById("queue-songs").textContent = "";
        document.getElementById("library-songs").textContent = "";

        let searchUrl;
        if (type === "artist")
            searchUrl = `https://api.jamendo.com/v3.0/artists/?client_id=${id}&format=jsonpretty&limit=35&namesearch=${name}&album_datebetween=0000-00-00_${Today}`; // Artist
        else if (type === "album")
            searchUrl = `https://api.jamendo.com/v3.0/artists/albums/?client_id=${id}&order=album_releasedate_desc&format=jsonpretty&limit=35&album_name=${name}&album_datebetween=0000-00-00_${Today}`; // Album
        else
            searchUrl = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${id}&limit=35&format=jsonpretty&order=track_name_desc&track_name=${name}&album_datebetween=0000-00-00_${Today}`; // Track

        let content = await fetch(searchUrl);
        content = await content.json();

        placeMainSongs(content["results"]);
    }
    function dropdownValue(search_term){
        console.log(search_term);
        const dropdown_value = dropdown.value;
        search(search_term, dropdown_value);
    }
    searchBar.addEventListener("keydown", function(event){
        if(event.key === "Enter")
            dropdownValue(searchBar.value);
    })
    searchButton.addEventListener("click", () => {
        dropdownValue(searchBar.value);
    })
}

// Handling music volume
musicCursor.addEventListener("drag", function(){
    if(musicCursor.style.left === "0%"){
        volumeIcon.setAttribute("src", "icons/no-volume.svg");
        volumeIcon.setAttribute("title", "Muted");
    }
    if(musicCursor.style.left === "100%"){
        volumeIcon.setAttribute("src", "icons/fullvolume.svg");
        volumeIcon.setAttribute("title", "Full Volume");
    }
})

// Toggling between autoplay-on and autoplay-off
function autoPlayControl(){
    currentState = autoplay.getAttribute("src")

    if(currentState.includes("off")){
        autoplay.setAttribute("title", "Autoplay-on");
        autoplay.setAttribute("src", "icons/autoplay-on.svg");
    }
    else{
        autoplay.setAttribute("title", "Autoplay-off");
        autoplay.setAttribute("src", "icons/autoplay-off.svg");
    }

    console.log(currentSongID);
    console.log(songAudio[currentSongID]);
}
autoplay.addEventListener("click", autoPlayControl);


// Toggling between play and pause for songs
{
    function playPauseSong(){
        if(!currentSongID)
            return; // No song selected

        const songSrc = songAudio[currentSongID];

        // In case of playing a new song
        if(!currentAudio || currentAudio.src != songSrc){
            if(currentAudio)
                currentAudio.pause();
            currentAudio = new Audio(songSrc);
        }

        currentState = playPause.getAttribute("src");

        if(currentState.includes("play")){
            currentAudio.pause();
            playPause.setAttribute("src", "icons/pause.svg");
        }
        else{
            currentAudio.play();
            playPause.setAttribute("src", "icons/play.svg");
        }
    }
    playPause.addEventListener("click", playPauseSong);
}

// Toggling between show and hide for the display bar
displayBar.addEventListener("click", function(){
    currentState = displayBar.getAttribute("title"); //Current condition of the display bar

    let playBarElements = document.getElementsByClassName("dp-bar-elements");

    if (currentState.includes("Hide")) {
        bar.style.height = "4vh";
        displayBar.setAttribute("title", "Show Bar");
        displayBar.setAttribute("src", "icons/arrow-up.svg");
        for(let i = 0; i < playBarElements.length; i++){
            playBarElements[i].style.cssText = 
            `
            width: 0;
            height: 0; 
            display: none;
            `
        }
        bar.style.transitionDuration = "500ms";
    }
    else{
        bar.style.height = "11vh";
        displayBar.setAttribute("title", "Hide Bar");
        displayBar.setAttribute("src", "icons/arrow-down.svg");
        for(let i = 0; i < playBarElements.length; i++){
            playBarElements[i].style.cssText = "";
        }
        document.getElementById("playing").style.cssText=
            `aspect-ratio: 1 / 0.55;
            width: 5vw;
            object-fit: cover; `
        bar.style.transitionDuration = "500ms";
    }
});

// Selecting the song to be played and its after events
function playSong(songId, tile){
    currentSongID = songId;

    let songName, songArtist, songImage;
    const childNodes = tile.childNodes;
    console.log(childNodes);

    if(childNodes.length === 7){
        songImage = childNodes[1].getAttribute("src"); // Image of the song
        songName = childNodes[3].textContent; // Name of the song
        songArtist = childNodes[5].textContent; // Singer of the song
    }
    if(childNodes.length === 2){
        songImage = childNodes[0].getAttribute("src") // Image of the song
        songName = childNodes[1].firstChild.textContent; // Name of the song
        songArtist = childNodes[1].lastChild.textContent; // Singer of the song
    }

    if (displayBar.getAttribute("title") === "Hide Bar") {
        document.getElementById("displayBar-playing").style.cssText =
        `display: flex;
        width: 30vh;
        height: 5vh;`;
        document.getElementById("playing").style.cssText=
        `aspect-ratio: 1 / 0.55;
        width: 5vw;
        object-fit: cover; `
        document.getElementById("CurrentSong").style.cssText=
        `height: 2vh;
        overflow: hidden;`
        document.getElementById("CurrentSinger").style.cssText=
        `height: 2vh;
        overflow: hidden;`
    }

    // Assigning the values to the footer container
    current.setAttribute("data-song-id", songId);
    currentSongImage.setAttribute("src", songImage);
    currentSong.textContent = songName;
    currentSinger.textContent = songArtist;

    // Playing the song immediately on selection

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    const songSrc = songAudio[currentSongID];
    if (!songSrc) {
        alert("Missing audio source for ", songName,"\nReload the website");
        return;
    }
    const thisAudio = new Audio(songSrc); 

    thisAudio.play()
        .then(() => {
            currentAudio = thisAudio; // only now set it
            console.log("Now playing:", songName);

            const duration = thisAudio.duration;
            let currentTime = thisAudio.currentTime;
            console.log(currentTime,"\t",duration);
            if(thisAudio.ended)
                console.log(`${thisAudio} ended`);
        })
        .catch(err => {
            alert(`${String(err).split(":")[1]}\nReload the website`);
        });


    console.log(`Played ${songName}`);

    fetchAlbumSongs(songArtist);
    console.log(`Call sent for ${songArtist}`);
    fetchQueueSongs();
}

// Handling clicking of songtiles
document.addEventListener("click", function (event) {
    const tile = event.target.closest(".selected");
    if (!tile) return;
    playSong(tile.getAttribute("id"), tile);
})

// Generating the share link for the song playing
document.getElementById("share").addEventListener("click", function () {
    const link = shareLink[currentSongID];

    // Remove any existing popup
    const existing = document.getElementById("share-popup");
    if (existing) 
        existing.remove();

    // Create popup div comprising the link and copy icon
    const show = document.createElement("div");
    show.id = "share-popup";

    show.style.cssText =
    `position: absolute;
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 6px 10px;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 1000;
    `

    // Create input with link
    const input = document.createElement("input");
    input.type = "text";
    input.value = link;
    input.readOnly = true;

    input.style.cssText =
    `border: none;
    background: transparent;
    outline: none;
    width: 10vw;
    font-size: 1em;
    `
    input.addEventListener("click", () => input.select());

    // Create copy icon for the link
    const copy = document.createElement("img");
    copy.src = "icons/copy-icon.svg";
    copy.alt = "Copy";
    copy.title = "Copy Link";

    copy.style.cssText = 
    `width: 1em;
    height: 1em;
    cursor: pointer
    `
    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(link)
            .then(() => {
                copy.title = "Copied to clipboard";
                copy.src = "icons/tick.svg";
                copy.style.transitionDuration = "500ms";
                setTimeout(() => copy.title = "Copy Link", 2000);
            })
            .catch(() => {
                copy.title = "Failed!";
            });
    });

    // Append input and icon
    show.appendChild(input);
    show.appendChild(copy);
    document.body.appendChild(show);

    // Position popup above the share icon
    const rect = this.getBoundingClientRect();
    show.style.top = `${rect.top + window.scrollY - 40}px`;  // 40px above
    show.style.left = `${rect.left + window.scrollX}px`;

    // Close if user clicks outside
    document.addEventListener("click", function outsideClick(e) {
        if (!show.contains(e.target) && e.target !== document.getElementById("share")) {
            show.remove();
            document.removeEventListener("click", outsideClick);
        }
    });
});