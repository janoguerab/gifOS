const API_KEY_Base64 = 'OVg0d1NYSTVETDA4UUhRcUNJMGI4MWhMSjI0NXVUbFg=' //Encoded Key
const SEARCH_URL     = 'http://api.giphy.com/v1/gifs/search'
const TRENDING_URL   = 'http://api.giphy.com/v1/gifs/trending'
const RANDOM_URL     = 'http://api.giphy.com/v1/gifs/random'
const SEARCH_TAG     = 'http://api.giphy.com/v1/tags/related/'
const UPLOAD_URL     = 'http://upload.giphy.com/v1/gifs'
const limitTrending  = 16
const limitSearch    = 16
const constraints    = { audio: false, video: { width: 838, height: 440 } }; 

function search(value = document.getElementById('search').value){
    getTags(value);
    let found = fetch( SEARCH_URL +'?q=' + value + '&api_key=' + window.atob(API_KEY_Base64))
        .then(response => {
            return response.json()
        })
        .then(data => { // Get Searched images, puts into results
            if(data.data.length > 0){
                var list = document.getElementById('search-result')
                list.innerHTML='' //Remove before results
                for (let index = 0; index < data.data.length; index++) {
                   
                    let result = document.createElement('li')
                    result.setAttribute("class",(index+1) % 5 == 0 ? 'resultLarge':'result')  //Evalues if puts a size Large or normal         

                    let image = document.createElement('img')
                    image.setAttribute('class',(index+1) % 5 == 0 ? 'imageLarge':'image') //Evalues if puts a image Large or normal            
                    image.setAttribute('src',data.data[index].images.downsized.url)

                    let imageInfo = document.createElement('span')
                    imageInfo.setAttribute('class','bar')
                    imageInfo.innerHTML=''

                    result.appendChild(image)
                    result.appendChild(imageInfo)
                    list.appendChild(result)
                }
            }
            
            return data
        })
        .catch(error => {
            return error
        })
    return found
}

function suggest(){
    
    var list = document.getElementById('suggest')
    list.innerHTML='' //Remove before results
      
    var index = 1;
    var title;
   for (let index = 1; index < 5; index++) {
        createSuggest(index,list)
       
   }

    
}
function createSuggest(index,list){

        let found = fetch( RANDOM_URL + '?api_key=' + window.atob(API_KEY_Base64))
        .then(response => {
            return response.json()
        })
        .then(data => { // Get Searched images, puts into results.
            if(data.data.title.length>1){
                let result = document.createElement('div')
                result.setAttribute("class",'suggestResutl')  
                let resultBar = document.createElement('div')
                resultBar.setAttribute("class",'upBar bar') 

                let resultTitle = document.createElement('span')
                resultTitle.setAttribute("class",'title')   
                resultTitle.innerText = '#'+data.data.title.replace(/\s/g,'').split('GIF')[0]
                
                let closeButton = document.createElement('div')
                closeButton.setAttribute("class",'close') 
                closeButton.setAttribute("id",'close-'+index) 

                resultBar.appendChild(resultTitle)
                resultBar.appendChild(closeButton)

                let image = document.createElement('img')
                image.setAttribute('class','suggestImage') //Evalues if puts a image Large or normal            
                image.setAttribute('src',data.data.images.downsized.url)

                let seeMoreButton = document.createElement('div')
                seeMoreButton.setAttribute("class",'seeMore')
                seeMoreButton.addEventListener("click",() =>{
                    search(data.data.title.split('GIF')[0])
                    document.getElementById('searchResult').scrollIntoView();  // Desplaze to result
                    })
                seeMoreButton.setAttribute("id",'seeMore-'+index) 
                seeMoreButton.innerText="Ver más..."

                result.appendChild(resultBar)
                result.appendChild(image)
                result.appendChild(seeMoreButton)
    
                list.appendChild(result)
                index++;
            }else
            {
                createSuggest(index,list)
            }
            return data
        })
        .catch(error => {
            return error
        })
        
}
function trending(){
    let found = fetch( TRENDING_URL +'?limit=' + limitTrending + '&api_key=' + window.atob(API_KEY_Base64))
        .then(response => {
            return response.json()
        })
        .then(data => { // Get Searched images, puts into results
            if(data.data.length > 0){
                var list = document.getElementById('list-result')
                list.innerHTML='' //Remove before results
                for (let index = 0; index < data.data.length; index++) {
                   
                    let result = document.createElement('li')
                    result.setAttribute("class",(index+1) % 5 == 0 ? 'resultLarge':'result')  //Evalues if puts a size Large or normal         

                    let image = document.createElement('img')
                    image.setAttribute('class',(index+1) % 5 == 0 ? 'imageLarge':'image') //Evalues if puts a image Large or normal            
                    image.setAttribute('src',data.data[index].images.downsized.url)

                    let imageInfo = document.createElement('span')
                    imageInfo.setAttribute('class','bar')
                    imageInfo.innerHTML=''

                    result.appendChild(image)
                    result.appendChild(imageInfo)
                    list.appendChild(result)
                }
            }
            
            return data
        })
        .catch(error => {
            return error
        })
    return found
}
let stream;
let recorder;
 
function getCamera(){
    document.getElementById('createGif').style.display="none";
    document.getElementById('camera').style.display="flex";
    var video = document.querySelector('video');
    stream = navigator.mediaDevices.getUserMedia(constraints)
        .then(function(mediaStream) {
            video.srcObject = mediaStream;
            video.onloadedmetadata = function(e) {
                video.play(); // Starting reproduce video cam
            };
            recorder = RecordRTC(mediaStream, { 
                // disable logs
                disableLogs: true,
                type: "gif",
                frameRate: 1,
                width: 360,
                hidden: 240,
                quality: 10});
        })
        .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.

        
}

let seconds = 0;
function setTime(){
    var d = new Date(1000*seconds++);
    d.setHours(0);
    var t = "0"+d.toLocaleTimeString();
    document.getElementById('timer').innerHTML = t;
    
}

let interval;

// Stop Interval
function stopInterval(){
    document.getElementById("cam").style.display = "none";
    document.getElementById("capture").style.display = "none";

    let repetir = document.createElement("div");
    repetir.setAttribute("class","mainButton");
    repetir.setAttribute("id","repetir");
    repetir.setAttribute("onclick","repeat()");
    repetir.innerHTML="Repetir Captura";
    let subir   = document.createElement("div");
    subir.setAttribute("class","mainButton");
    subir.setAttribute("onclick","upload()");
    subir.setAttribute("id","subir");
    subir.innerHTML="Subir Guifo";
    let recorded= document.getElementById("recorded");
    recorded.appendChild(repetir);
    recorded.appendChild(subir);

    clearInterval(interval);
    seconds=0;
    recorder.stopRecording(function() {
        var blob = this.getBlob();
        document.getElementById("videocamera").style.display="none";
        var gif = document.getElementById("gif");
        gif.style.display="flex";
        gif.src = URL.createObjectURL(blob);
    });
}
//Repeat Gifo
function repeat(){
    recorder.destroy();
    getCamera();
    document.getElementById("videocamera").style.display="flex";
    var gif = document.getElementById("gif");
    gif.style.display="none";
    gif.src="";
    
    document.getElementById("cam").style.display="flex";
    document.getElementById("capture").style.display="flex";
    recorded = document.getElementById("recorded");
    recorded.innerHTML="";
    let timer = document.createElement("div");
    timer.setAttribute("class","timer box");
    timer.setAttribute("id","timer");
    timer.innerHTML="00:00:00"
    recorded.appendChild(timer);
    record();
    
}
//Upload gif
function upload(){
    let form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    let params = {
        method: "POST",
        body: form,
        json: true
    };
    let data = fetch(UPLOAD_URL+'?api_key=' + window.atob(API_KEY_Base64), params)
        .then(response => {
            return response.json()
            .then(data =>{
                let ids = JSON.parse(localStorage.getItem('IDs'));
                if(ids){
                    localStorage.setItem('IDs', ids.appendChild(data.data.id))
                }else{
                    localStorage.setItem('IDs',  JSON.parse(data.data.id).stringify());
                }
            });
        })
        .catch(error => {
            return console.log(error)
        });
    repeat();
    
}

function record(){  
    if (document.getElementById("capture").innerHTML != "Listo"){
        document.getElementById("cameraIcon").src="../assets/recording.svg"
        document.getElementById("capture").innerHTML="Listo"
        document.getElementById("cam").setAttribute("onclick","stopInterval()");
        document.getElementById("capture").setAttribute("onclick","stopInterval()")
        interval = setInterval(setTime, 1000 );
        

        recorder.startRecording();
    }else{
        document.getElementById("cameraIcon").src="../assets/camera.svg"
        document.getElementById("capture").innerHTML="Capturar"
        document.getElementById("cam").setAttribute("onclick","record()");
        document.getElementById("capture").setAttribute("onclick","record()");
        clearInterval(interval);
        seconds=0;
    }
    
}

// Autocomplete
function autocomplete(){
    var delayTimer;
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
    }, 1000); // Will do the ajax stuff after 1000 ms, or 1 s   
}

//search suggestions
function getTags(value){
        let found = fetch( SEARCH_TAG + value + '?api_key=' + window.atob(API_KEY_Base64))
        .then(response => {
            return response.json()
        })
        .then(data => { // Get Searched images, puts into results
            if(data.data.length > 0){
                var list = document.getElementById('tags')
                list.innerHTML='' //Remove before results
                
                for (let index = 0; index < data.data.length; index++) {
                   
                    let seeMoreButton = document.createElement('div')
                    seeMoreButton.setAttribute("class",'tag')
                    seeMoreButton.addEventListener("click",() =>{
                        search(data.data.name)
                        document.getElementById('searchResult').scrollIntoView();  // Desplaze to result
                        })
                    seeMoreButton.setAttribute("id",'tag-'+index) 
                    seeMoreButton.innerText=data.data.name
                    list.appendChild(seeMoreButton)
                }
                
            }
            
            return data
        })
        .catch(error => {
            return error
        })
    return found;
}

// starting when all render page is done!
window.onload = () =>{
    if(document.getElementById('suggest')){
        suggest()
    }
    if(document.getElementById('list-result')){
        trending()
    }
}

// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}// function to toggle between day and night theme
function toggleTheme() {
   if (localStorage.getItem('theme') === 'theme-night'){
       setTheme('theme-day');
   } else {
       setTheme('theme-night');
   }
}// Immediately invoked function to set the theme on initial load
(function () {
   if (localStorage.getItem('theme') === 'theme-night') {
       setTheme('theme-night');
   } else {
       setTheme('theme-day');
   }
})();

