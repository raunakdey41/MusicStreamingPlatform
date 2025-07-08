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
const offset = Math.floor(Math.random() * 100);
const main_url = `https://api.jamendo.com/v3.0/tracks/?client_id=${id}&format=json&limit=35&search=${musicTags[Math.ceil(Math.random()*35)]}&offset=${offset}` // URL to fetch songs for the main section
const queue_url = `https://api.jamendo.com/v3.0/tracks/?client_id=${id}&format=json&limit=20&search=${musicTags[Math.floor(Math.random()*15)]}&offset=${offset}`// URL to fetch songs for the queue section

// Storage variable for the searchbar

let dropdown = document.getElementById("dropdown"); // To store the dropdown elements
let searchBar = document.getElementById("searchbar"); // To store the input and appearance of search bar
const searchButton = document.getElementById("searchButton"); // To store the search button 

// Storage variables for the display bar items

let currentState; // To access the current state of any attribute
let displayBar = document.getElementById("display"); // The sign for showing/hiding the bar
let bar = document.getElementById("music-control");// The footer section

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

let songsPlayed = {}; // Object to store songs played since the loading of the webpage
let songsPlayed_id = []; // To store the name of the songs played since the loading of the page
let playHistoryIndex = -1; // To store the index of the song being played
let queueIndex; // To store the index of the queue song being played

// Fetch songs from Jamendo as soon as window loads
document.addEventListener("DOMContentLoaded", () => {
    fetchMainSongs();
    document.getElementById("displayBar-playing").style.display = "none";
    queueIndex = 0;
})

// Handle clicking of logo
document.getElementById("logo").addEventListener("click", () => {
    location.reload();
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
{
    const volumeIcon = document.getElementById("VolumeIcon");

    document.getElementById("musicSeekBar").addEventListener("click", (e)=>{
        console.log(e.offsetX , document.getElementById("musicSeekBar").getBoundingClientRect(), document.getElementById("musicSeekBar").getBoundingClientRect().width );

        const width = document.getElementById("musicSeekBar").getBoundingClientRect().width;

        musicCursor.style.left = (e.offsetX/width) * 100 +"%";
        musicCursor.style.transitionDuration = "750ms";
        currentAudio.volume = e.offsetX/width;

        if (width - e.offsetX === 0) {
            volumeIcon.setAttribute("src", "icons/fullvolume.svg");
            volumeIcon.setAttribute("data-state", "Full Volume");
        }
        else if (width - e.offsetX === width){
            volumeIcon.setAttribute("src", "icons/no-volume.svg");
            volumeIcon.setAttribute("data-state", "No Volume");
        }
        else{
            volumeIcon.setAttribute("src", "icons/midvolume.svg");
            volumeIcon.setAttribute("data-state", "Audible");
        }
    })
    volumeIcon.addEventListener("dblclick", () =>{
        currentState = volumeIcon.getAttribute("data-state");

        if(currentState.includes("Full")){
            volumeIcon.setAttribute("src", "icons/no-volume.svg");
            volumeIcon.setAttribute("data-state", "No Volume");
            musicCursor.style.left = "0%";
            musicCursor.style.transitionDuration = "750ms";
            currentAudio.volume = 0;
        }

        if(currentState.includes("No")){
            volumeIcon.setAttribute("src", "icons/fullvolume.svg");
            volumeIcon.setAttribute("data-state", "Full Volume");
            musicCursor.style.left = "100%";
            musicCursor.style.transitionDuration = "750ms";
            currentAudio.volume = 1;
        }
    })
}

// Toggling between autoplay-on and autoplay-off
{
    function autoPlayControl(){
        currentState = autoplay.getAttribute("data-state")

        if(currentState.includes("off")){
            autoplay.setAttribute("title", "Autoplay-on");
            autoplay.setAttribute("data-state", "on");
            autoplay.style.cssText =
            `box-shadow:  0 0 1em rgba(0, 85, 239, 1);
            filter: brightness(1.5);`;
        }
        else{
            autoplay.setAttribute("title", "Autoplay-off");
            autoplay.setAttribute("data-state", "off");
            autoplay.style.cssText = ``;
        }
        autoplay.style.transitionDuration = "500ms";

        console.log(currentSongID);
        console.log(songAudio[currentSongID]);
    }
    autoplay.addEventListener("click", autoPlayControl);
}

// Clicking on a specific time and seeking it
{
    document.getElementById("seekbar").addEventListener("mouseover", e =>{

        const seekTime = formatTime(((e.clientX - document.getElementById("seekbar").getBoundingClientRect().left)/document.getElementById("seekbar").getBoundingClientRect().width) * currentAudio.duration);
        document.getElementById("seekbar").setAttribute("title", seekTime);
    })
    document.getElementById("seekbar").addEventListener("mouseleave", () =>{
        document.getElementById("seekbar").setAttribute("title", "");
    })
    document.getElementById("seekbar").addEventListener("click", e =>{
        document.getElementById("circle-cursor").style.left = (e.offsetX/document.getElementById("seekbar").getBoundingClientRect().width) * 100 + "%";
        document.getElementById("circle-cursor").style.transitionDuration = "750ms";

        currentAudio.currentTime = (e.offsetX/document.getElementById("seekbar").getBoundingClientRect().width) * currentAudio.duration;
        
    })
}

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

        currentState = document.getElementById("playPause").getAttribute("data-id");

        if(currentState.includes("play")){
            currentAudio.pause();
            document.getElementById("playPause").setAttribute("src", "icons/pause.svg");
            document.getElementById("playPause").setAttribute("data-id", "pause");
        }
        else{
            currentAudio.play();
            document.getElementById("playPause").setAttribute("src", "icons/play.svg");
            document.getElementById("playPause").setAttribute("data-id", "play");
            document.getElementById("circle-cursor").style.left = (currentAudio.currentTime/currentAudio.duration) * 100 + "%";
        }
    }
    document.getElementById("playPause").addEventListener("click", playPauseSong);
}

// Playing the previous songs
{
    function prevSong(){
        if(playHistoryIndex <= 0){
            return;
        }

        document.querySelector("#prev-song").setAttribute("title", "Previous Song");

        playHistoryIndex--;
        const prevSongid = songsPlayed_id[playHistoryIndex];
        const prevSongAudio = songsPlayed[prevSongid]["audioSource"];
        const prevSongName = songsPlayed[prevSongid]["name"];
        const prevSongArtist = songsPlayed[prevSongid]["songArtist"];
        const prevSongImage = songsPlayed[prevSongid]["songImage"];

        console.log(prevSongid, prevSongAudio, prevSongArtist, prevSongImage);

        if(songsPlayed_id[songsPlayed_id.length - 1] != currentSongID)
            songsPlayed_id.push(currentSongID);
        if(!(currentSongID in songsPlayed)){
            songsPlayed[currentSongID] = {
                "name": currentSong.textContent,
                "audioSource": songSrc,
                "songArtist": currentSinger.textContent,
                "songImage": currentSongImage.getAttribute("src")
            };
        }

        console.log(prevSongAudio, prevSongName, prevSongArtist, prevSongImage);

        // Assigning the values to the footer container
        current.setAttribute("data-song-id", prevSongid);
        currentSongImage.setAttribute("src", prevSongImage);
        currentSong.textContent = prevSongName;
        currentSinger.textContent = prevSongArtist;

        if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        }

        currentSongID = prevSongid;

        try{
            playSong(prevSongAudio);
        }
        catch{
            alert(`Failed to load ${prevSongName}\nReload the Website`);
        }
    }
    document.querySelector("#prev-song").addEventListener("click", ()=>{
        prevSong();
    })
}

// Playing the next song
{
    function nextSong() {
        let audioSource, name, songArtist, songImage;

        // Check if at the end of play history
        if (playHistoryIndex >= songsPlayed_id.length - 1) {
            // No next history — fallback to queue
            const queueFirst = document.querySelector("#queue-songs").children[queueIndex];

            if (!queueFirst) {
                alert("Queue is empty.");
                return;
            }

            const childNodes = queueFirst.children;

            // Extract data from queue DOM
            songImage = childNodes[0].getAttribute("src");
            name = childNodes[1].firstChild.textContent;
            songArtist = childNodes[1].lastChild.textContent;
            audioSource = songAudio[document.querySelector("#queue-songs").children[queueIndex].id];
            console.log(songImage, name, songArtist, audioSource);

            if (!audioSource) {
                alert("Missing audio source in queue.");
                return;
            }

            const queueSongID = document.getElementById("queue-songs").childNodes[queueIndex].id;

            // Add to history
            songsPlayed_id.push(queueSongID);
            playHistoryIndex = songsPlayed_id.length - 1;

            songsPlayed[queueSongID] = {
                name,
                audioSource,
                songArtist,
                songImage
            };

            currentSongID = queueSongID;
        }
        else {
            // Go to the next song in history
            playHistoryIndex++;
            const nextSongid = songsPlayed_id[playHistoryIndex];
            const nextSongData = songsPlayed[nextSongid];

            if (!nextSongData) {
                alert("Song data missing. Reload the site.");
                return;
            }

            ({ audioSource, name, songArtist, songImage } = nextSongData);
            currentSongID = nextSongid;
        }

        // Update the footer UI
        current.setAttribute("data-song-id", currentSongID);
        currentSongImage.setAttribute("src", songImage);
        currentSong.textContent = name;
        currentSinger.textContent = songArtist;

        // Stop current audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Play the new song
        try {
            playSong(audioSource);
            fetchAlbumSongs(songArtist);
        } 
        catch {
            alert(`Failed to load ${name}. Reload the Website`);
        }
    }
    document.querySelector("#next-song").addEventListener("click", ()=>{
        nextSong();
        queueIndex++;
    })
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

// Fetching the duration and current timestamp for the playing song
function formatTime(seconds) {
    seconds = Math.floor(seconds); // Remove any decimals
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedSecs = secs < 10 ? '0' + secs : secs;
    return `${mins}:${formattedSecs}`;
}

// Playing the song selected
function playSong(songSrc){

    // Playing the song immediately on selection
    const thisAudio = new Audio(songSrc); 

    thisAudio.play()
        .then(() => {
            document.getElementById("playPause").setAttribute("src", "icons/play.svg");
            document.getElementById("playPause").setAttribute("data-id", "play");
            currentAudio = thisAudio; // only now set it

            // Adding in the list of songs played
            if (songsPlayed_id[playHistoryIndex] !== currentSongID) {
                // Remove any forward history
                songsPlayed_id = songsPlayed_id.slice(0, playHistoryIndex + 1);

                // Add new song to history
                songsPlayed_id.push(currentSongID);
                playHistoryIndex = songsPlayed_id.length - 1;
            }

            if(!(currentSongID in songsPlayed)){
                songsPlayed[currentSongID] = {
                    "name": currentSong.textContent,
                    "audioSource": songSrc,
                    "songArtist": currentSinger.textContent,
                    "songImage": currentSongImage.getAttribute("src")
                };
            }

            console.log(songsPlayed);
            console.log(songsPlayed_id);
            console.log("Now playing:", currentSong.textContent);

            document.getElementById("totalDuration").textContent = formatTime(thisAudio.duration);
            thisAudio.addEventListener("timeupdate", () => {
                document.getElementById("currentTime").textContent = formatTime(thisAudio.currentTime);
                document.getElementById("circle-cursor").style.left = (thisAudio.currentTime/thisAudio.duration) * 100 + "%";

                if(thisAudio.ended)
                    document.getElementById("playPause").setAttribute("src", "icons/replay.svg");
            })
        })
        .catch(err => {
            alert(`${String(err).split(":")[1]}\nReload the website`);
        });
}

// Selecting the song to be played and its after events
function selectSong(songId, tile){
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

    
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    const songSrc = songAudio[currentSongID];
    if (!songSrc) {
        alert("Missing audio source for ", currentSong,"\nReload the website");
        return;
    }

    playSong(songSrc);
    
    console.log(`Played ${songName}`);

    fetchAlbumSongs(songArtist);
    console.log(`Call sent for ${songArtist}`);
    fetchQueueSongs();
}

// Handling clicking of songtiles
document.addEventListener("click", function (event) {
    const tile = event.target.closest(".selected");
    if (!tile) return;
    selectSong(tile.getAttribute("id"), tile);
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