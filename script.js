let currentSong = new Audio();
let previous = document.getElementById("previous");
let play = document.getElementById("play");
let next = document.getElementById("next");
let timer = document.querySelector('.timer');
let dura = document.querySelector('.duration');
let info = document.querySelector('.songInfo');
let infoImg = document.querySelector('.hid');
let soundMute = document.querySelector('.mute');
let currentFolder;
var songs;
async function getSongs(folder) {
    currentFolder = folder;
    let fetchsong = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await fetchsong.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let a = div.getElementsByTagName('a');
    songs = [];
    for (let i = 0; i < a.length; i++) {
        const element = a[i];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href);
        }
    }

    let libSonglist = document.getElementsByClassName('songLists');
    libSonglist[0].innerHTML = '';
    for (const song of songs) {
        let songName = song.split(`/${currentFolder}/`)[1].replaceAll("%20", " ");
        libSonglist[0].appendChild(createsongCard(songName));
    }

    // playing the music if user clicks on the library songs 
    let songLists = Array.from(document.querySelector('.songLists').getElementsByClassName("song-card"));
    songLists.forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.getElementsByTagName("h4")[0].innerText);
        })
    })

    return songs;
}

let createsongCard = (title) => {
    let songCard = document.createElement("div");
    songCard.classList.add('song-card');

    let img = document.createElement("img");
    img.src = "./assets/songCard.jpg";
    img.alt = "song-card";

    let txtcont = document.createElement("div");
    txtcont.classList.add("desc");

    let h4 = document.createElement("h4");
    h4.innerText = title;

    let playhover = document.createElement("div");
    playhover.classList.add('play-hover');
    playhover.innerHTML = '<svg data-encore-id="icon" role="img" aria-hidden="true" class="e-9640-icon" viewBox="0 0 24 24"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" fill="#ffffff"></path></svg>';

    songCard.appendChild(img);
    songCard.appendChild(txtcont);
    txtcont.appendChild(h4);
    songCard.appendChild(playhover);

    return songCard;
}

// MAKE SURE YOUR SONGS FILE DONT HAVE ANY EXTRA SPACE SONG NAMES
let playmusic = (track, pause = false) => {
    currentSong.src = `/${currentFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.getElementsByTagName("img")[0].src = 'https://img.icons8.com/?size=100&id=61012&format=png&color=000000';
    }
    info.innerHTML = `<img class="hid" src="https://img.icons8.com/?size=100&id=74354&format=png&color=ffffff" alt="musicIcon"> ${(decodeURIComponent(track.split(".mp3")[0]))}`;
}

let secondsToMin = (time) => {
    if (isNaN(time) || time < 0) {
        return '0 : 00'
    }

    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min} : ${sec < 10 ? "0" + sec : sec}`;
}

let displayAlbums = async () => {
    let fetchAlbum = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await fetchAlbum.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');
    let cardContainer = document.querySelector('.card-container')
    let a = Array.from(anchors);
    for (let i = 0; i < a.length; i++) {
        const e = a[i];
        if (e.href.includes('/songs')) {
            let folder = e.href.split("/").slice(-2)[0];
            // get the meta deta
            let fetchAlbum = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await fetchAlbum.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <img src="https://img.icons8.com/?size=100&id=59862&format=png&color=000000"
                                alt="play-icon">
                        </div>
                        <img src="/songs/${folder}/cover.jpg"
                            alt="album-photo">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
        }
    }

    // Load the playlist when user clicks the playlist card 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0].split(`/${currentFolder}/`)[1].replaceAll("%20", " "));
        })
    })
}


(async () => {
    // fetching albums from a folder
    displayAlbums();


    // adding songs in the library song list
    await getSongs("songs/desi");
    playmusic(songs[0].split(`/${currentFolder}/`)[1].replaceAll("%20", " "), true);

    // play pause logic buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.getElementsByTagName("img")[0].src = 'https://img.icons8.com/?size=100&id=61012&format=png&color=000000';
        } else {
            currentSong.pause();
            play.getElementsByTagName("img")[0].src = 'https://img.icons8.com/?size=100&id=59862&format=png&color=000000';
        }
    })

    // time updatation
    currentSong.addEventListener("timeupdate", () => {
        timer.innerText = secondsToMin(currentSong.currentTime);
        dura.innerText = secondsToMin(currentSong.duration);
        document.querySelector('.prog').style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // event listener on seek bar and volume bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.prog').style.width = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })
    document.querySelector(".volume-bar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.drag').style.width = percent + "%";
        currentSong.volume = 0.0 + (percent / 100) * (1.0 - 0.0);
        if(currentSong.volume > 0){
            soundMute.src = "./assets/sound.png";
        }
    })

    // hamBurger show up
    document.querySelector('.hamBurger').addEventListener("click", () => {
        document.querySelector('.left').style.left = 0 + "%";
    })

    // HamBurger close up
    document.querySelector('.closeHamBurger').addEventListener("click", () => {
        document.querySelector('.left').style.left = -100 + "%";
    })

    // song next
    document.getElementById('next').addEventListener("click", () => {
        console.log(songs);

        let index = songs.indexOf(`http://127.0.0.1:3000/${currentFolder}/` + currentSong.src.split('/').slice(-1)[0]);

        if ((index + 1) <= songs.length - 1) {
            playmusic(songs[index + 1].split(`/${currentFolder}/`)[1]);
        }
    })

    // song previous
    document.getElementById('previous').addEventListener("click", () => {
        let index = songs.indexOf(`http://127.0.0.1:3000/${currentFolder}/` + currentSong.src.split('/').slice(-1)[0]);

        if ((index - 1) >= 0) {
            playmusic(songs[index - 1].split(`/${currentFolder}/`)[1]);
        }
    })

    // mute volume 
    soundMute.addEventListener("click", () => {
        // console.log(soundMute.src.split('/').slice(-2)[1] == "sound.png");

        if (soundMute.src.split('/').slice(-2)[1] == "sound.png") {
            soundMute.src = "./assets/mute.png";
            document.querySelector('.drag').style.width = 0 + "%";
            currentSong.volume = 0.0;
        } else {
            soundMute.src = "./assets/sound.png";
            document.querySelector('.drag').style.width = 100 + "%";
            currentSong.volume = 1.0;
        }
    })


})()