async function getSongs(){
    let fetchsong = await fetch('http://127.0.0.1:3000/songs/');
    let response = await fetchsong.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let a = div.getElementsByTagName('a');
    let songs = [];
    for (let i = 0; i < a.length; i++) {
        const element = a[i];
        if(element.href.endsWith('.mp3')){
            songs.push(element.href);
        }
    }   
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

(async () =>{
    let songs = await getSongs();
    // console.log(songs);
    // const audio = new Audio(songs[0]);
    // audio.play();
    let libSonglist = document.getElementsByClassName('songLists');

    for (const song of songs) {
        let songName = song.split('/songs/')[1].replaceAll("%20", " ")
        libSonglist[0].appendChild(createsongCard(songName));
    }
})()