// async function getSongs(){
//     let fetchsong = await fetch('http://127.0.0.1:3000/songs/');
//     let response = await fetchsong.text();
//     console.log(response);
//     let div = document.createElement('div');
//     div.innerHTML = response;
//     let a = div.getElementsByTagName('a');
//     let songs = [];
//     for (let i = 0; i < a.length; i++) {
//         const element = a[i];
//         if(element.href.endsWith('.mp3')){
//             songs.push(element.href);
//         }
//     }   
//     return songs;
// }


// (async () =>{
//     let songs = await getSongs();
//     console.log(songs);
// })()