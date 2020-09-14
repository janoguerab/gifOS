const API_KEY_Base64 = 'OVg0d1NYSTVETDA4UUhRcUNJMGI4MWhMSjI0NXVUbFg=' //Encoded Key
const SEARCH_URL     = 'http://api.giphy.com/v1/gifs/search'
const TRENDING_URL   = 'http://api.giphy.com/v1/gifs/trending'
const RANDOM_URL     = 'http://api.giphy.com/v1/gifs/random'
const SEARCH_TAGSUG  = 'http://api.giphy.com/v1/gifs/search/tags'
const UPLOAD_URL     = 'http://upload.giphy.com/v1/gifs'
const GET_ByID       = 'http://api.giphy.com/v1/gifs/'
const limitTrending  = 16
const limitSearch    = 16
const constraints    = { audio: false, video: { width: 838, height: 440 } }; 
let myGifURL         = '';
let color            = '';
async function search(value = document.getElementById('search').value){
    document.getElementById('search').value = value;
    document.getElementById('tags').style.display="none"
    let found = await fetch( SEARCH_URL +'?q=' + value + '&api_key=' + window.atob(API_KEY_Base64))
        .then(response => {
            return response.json()
        })
        .then(data => { // Get Searched images, puts into results
            if(data.data.length > 0){
                var list = document.getElementById('search-result')
                list.innerHTML='' //Remove before results
                for (let index = 0; index < data.data.length; index++) {
                   
                    let result = document.createElement('li')
                    result.setAttribute("class",(index+1) % 5 == 0 ? 'resultLarge largeBox':'result box')  //Evalues if puts a size Large or normal         

                    let anchor = document.createElement('a')
                    anchor.setAttribute('href',data.data[index].bitly_url)
                    anchor.setAttribute('target','_blank')

                    let image = document.createElement('img')
                    image.setAttribute('class',(index+1) % 5 == 0 ? 'imageLarge':'image') //Evalues if puts a image Large or normal            
                    image.setAttribute('src',data.data[index].images.downsized.url)

                    let imageInfo = document.createElement('span')
                    imageInfo.setAttribute('class','bar')
                    imageInfo.innerHTML=''


                    let slugs = data.data[index].slug.split("-")
                    let showSlug = ''
                    let charCount = 0
                    for (let index = 0; index <slugs.length-1; index++) {
                        charCount += 1+slugs[index].length
                        if(charCount < 30){
                            showSlug += `#${slugs[index]} `
                        }
                    }
                    if(showSlug==''){
                        showSlug="#Gif"
                    }

                    imageInfo.innerHTML=showSlug
                    anchor.appendChild(image)
                    anchor.appendChild(imageInfo)
                    result.appendChild(anchor)
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

// Search autocomplete suggest
async function sugerencia(){
    document.getElementById('searchResult').style.display="inline-block"
    let value = document.getElementById('search').value
    let tags = document.getElementById('tags')
    let found = await fetch( SEARCH_TAGSUG +'?q=' + value + '&api_key=' + window.atob(API_KEY_Base64))
    .then(response => {
        tags.innerHTML=''
        return response.json()
    })
    .then(data => { // Get Searched images, puts into results
        if(data.data.length > 0){
            document.getElementById('suregimosContent').style.display="none"
            document.getElementById('Treding').style.display="none"
            tags.innerHTML=''
            tags.style.display="block"
            for (let index = 0; index < (data.data.length > 3 ? 3 : data.data.length); index++) {
                let tag = document.createElement('div')
                let insideContent = document.createElement('div')
                tag.setAttribute('class','tag')
                insideContent.setAttribute('class','insidecontent')
                insideContent.setAttribute('onClick','search("'+data.data[index].name+'")')
                insideContent.innerText = data.data[index].name
                tag.appendChild(insideContent)
                tags.appendChild(tag)
            }
        }else{
            tags.style.display="none"
            document.getElementById('suregimosContent').style.display="inline-block"
            document.getElementById('Treding').style.display="inline-block"

        }
    }).catch({})
    .catch({})
}

// Suggest Gifs
function suggest(){
    
    var list = document.getElementById('suggest')
    list.innerHTML='' //Remove before results
      
    var index = 1;
    var title;
   for (let index = 1; index < 5; index++) {
        createSuggest(index,list)
       
   }
   
}
async function createSuggest(index,list){

        let found = await fetch( RANDOM_URL + '?api_key=' + window.atob(API_KEY_Base64))
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
                    document.getElementById('searchResult').style.display="inline-block"
                    document.getElementById('Treding').style.display="none"
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
async function trending(){
    let found = await fetch( TRENDING_URL +'?limit=' + limitTrending + '&api_key=' + window.atob(API_KEY_Base64))
        .then(response => {
            return response.json()
        })
        .then(data => { // Get Searched images, puts into results
            if(data.data.length > 0){
                var list = document.getElementById('list-result')
                list.innerHTML='' //Remove before results
                for (let index = 0; index < data.data.length; index++) {
                   
                    let result = document.createElement('li')
                    result.setAttribute("class",(index+1) % 5 == 0 ? 'resultLarge largeBox':'result box')  //Evalues if puts a size Large or normal       

                    let anchor = document.createElement('a')
                    anchor.setAttribute('href',data.data[index].bitly_url)
                    anchor.setAttribute('target','_blank')

                    let image = document.createElement('img')
                    image.setAttribute('class',(index+1) % 5 == 0 ? 'imageLarge':'image') //Evalues if puts a image Large or normal            
                    image.setAttribute('src',data.data[index].images.downsized.url)

                    let imageInfo = document.createElement('span')
                    imageInfo.setAttribute('class','bar')

                    let slugs = data.data[index].slug.split("-")
                    let showSlug = ''
                    let charCount = 0
                    for (let index = 0; index <slugs.length-1; index++) {
                        charCount += 1+slugs[index].length
                        if(charCount < 30){
                            showSlug += `#${slugs[index]} `
                        }
                    }
                    if(showSlug==''){
                        showSlug="#Gif"
                    }
                    imageInfo.innerHTML=showSlug
                    anchor.appendChild(image)
                    anchor.appendChild(imageInfo)
                    result.appendChild(anchor)
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
 
//Get video from webcam
function getCamera(){
    document.getElementById('ownGifs').style.display="none"
    document.getElementById('createGif').style.display="none";
    document.getElementById('camera').style.display="inline-block";
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
        .catch(function(err) { 

        }); // always check for errors at the end.

        
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
function stopInterval(camara){
    document.getElementById("title").innerHTML = "Vista Previa";
    document.getElementById("cam").style.display = "none";
    document.getElementById("capture").style.display = "none";
    document.getElementById("cam").style.background=color;
    document.getElementById("capture").style.background=color;
    document.getElementById("cameraIcon").src=camara;
    let repetir = document.createElement("div");
    repetir.setAttribute("class","mainButton repButton");
    repetir.setAttribute("id","repetir");
    repetir.setAttribute("onclick","repeat()");
    repetir.innerHTML="Repetir Captura";
    let subir   = document.createElement("div");
    subir.setAttribute("class","mainButton repButton");
    subir.setAttribute("onclick","upload()");
    subir.setAttribute("id","subir");
    subir.innerHTML="Subir Guifo";
    let recorded= document.getElementById("recorded");
    recorded.appendChild(repetir);
    recorded.appendChild(subir);
    document.getElementById("timer").style.display = "flex";
    clearInterval(interval);
    seconds=0;
    try{
        recorder.stopRecording(function() {
            var blob = this.getBlob();
            document.getElementById("videocamera").style.display="none";
            var gif = document.getElementById("gif");
            gif.style.display="flex";
            gif.src = URL.createObjectURL(blob);
        });
    }catch(e){}
}
//Repeat Gifo
function repeat(){
    document.getElementById("cam").style.background=color;
    document.getElementById("capture").style.background=color;
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

//Load all gif from LocalStorage
function showMyGifs(){
    let ids = JSON.parse(localStorage.getItem('IDs'));
    let myGifs = document.getElementById("myGifs");
    if(myGifs){
        myGifs.innerHTML="";
        if(ids){
            ids.forEach( gif => {
             fetch(GET_ByID + gif + '?api_key=' + window.atob(API_KEY_Base64))
                    .then(async response=>{
                        const data = await response.json()
                        let anchor = document.createElement('a')
                        anchor.setAttribute('target','_blank')
                        anchor.setAttribute('href',data.data.url)
                        let image = document.createElement('img')
                        image.setAttribute('class', "myGif")
                        image.setAttribute('src', data.data.images.downsized.url)
                        image.setAttribute('alt','myGif')

                        anchor.appendChild(image)
                        
                        myGifs.appendChild(anchor)
                    })
                    .catch(error => {
                    });
            });
        }
    }
    
}
//Upload gif
async function upload(){
    document.getElementById("cam").style.background=color;
    document.getElementById("capture").style.background=color;
    let form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    let params = {
        method: "POST",
        body: form,
        json: true
    };
    progressBar();
    let data = await fetch(UPLOAD_URL+'?api_key=' + window.atob(API_KEY_Base64), params)
        .then(async response => {
            const data = await response.json()
            let id = data.data.id;
            fetch(GET_ByID + id + '?api_key=' + window.atob(API_KEY_Base64))
                    .then(async response=>{
                        const data = await response.json()
                        document.getElementById('downloadGif').setAttribute('href',data.data.images.downsized.url)
                        document.getElementById('uploadedGif').setAttribute('src',data.data.images.downsized.url)
                        myGifURL = data.data.url
                    })
                    .catch(error => {
                    });
           
            
            let ids = JSON.parse(localStorage.getItem('IDs'))
            if (ids) {
                ids.push(data.data.id)
                localStorage.setItem('IDs', JSON.stringify(ids))
            }
            else {
                let newIds = [data.data.id]
                localStorage.setItem('IDs', JSON.stringify(newIds))
            }
            repeat()
            showMyGifs()
            uploaded()
        })
        .catch(error => {
        });
   
}

// Copy Link of ownGif
function copyLink(){
    const el = document.createElement('textarea');
    el.value = myGifURL;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Se copio el gif: '+myGifURL);

}

//Uploaded screen
function uploaded(){
    document.getElementById('title').innerHTML="Gif Subido Con Éxito"
    document.getElementById("uploaded").style.display="inline-block";
    document.getElementById("uploadInfo").style.display="none";
    document.getElementById("buttons").style.display="none";
    let camera = document.getElementById("camera");
    camera.style.width="820px";
    camera.style.height="310px";
}

//Uploaded screen
function ok(){
    document.getElementById('title').innerHTML="Un Chequeo antes de Comenzar";
    document.getElementById("video").style.display="block";
    document.getElementById("uploaded").style.display="none";
    document.getElementById("uploadInfo").style.display="none";
    document.getElementById("buttons").style.display="flex";
    document.getElementById("cam").style.background=color;
    document.getElementById("capture").style.background=color;
    let camera = document.getElementById("camera");
    camera.style.width="920px";
    camera.style.height="548px";
}


// stop interval bar
function stopBarInterval(barInterval){
    clearInterval(barInterval);
}
// Upload Bar
function progressBar() {
    document.getElementById("title").innerHTML = "Subiendo Guifo";
    document.getElementById("video").style.display="none";
    document.getElementById("uploadInfo").style.display="inline-block";
    let bar = document.getElementById('uploadBar');
    let index = 1
    let barInterval = setInterval(()=>{
        const section = document.createElement('div');
        section.setAttribute('class','section');
        bar.appendChild(section);
        index++;
        if(index>27){
            stopBarInterval(barInterval)
        }
    },200)        
    
  }

//record gif from camera
function record(){  
    document.getElementById("title").innerHTML = "Capturando Tu Guifo";
    
    color=document.getElementById("cam").style.background;
    let camara= document.getElementById("cameraIcon").src;
    if (document.getElementById("capture").innerHTML != "Listo"){
        document.getElementById("capture").style.background="#FF6161";
        document.getElementById("cam").style.background="#FF6161";
        document.getElementById("cameraIcon").src="../assets/recording.svg"
        document.getElementById("capture").innerHTML="Listo"
        document.getElementById("cam").setAttribute("onclick","stopInterval('"+camara+"')");
        document.getElementById("cam").setAttribute("onclick","stopInterval('"+camara+"')");
        document.getElementById("capture").setAttribute("onclick","stopInterval('"+camara+"')");
        document.getElementById("timer").style.display = "flex";
        interval = setInterval(setTime, 1000 );
    
        recorder.startRecording();
    }else{
        document.getElementById("title").innerHTML = "Un Chequeo antes de Comenzar";
        document.getElementById("capture").style.background=color;
        document.getElementById("cam").style.background=color;
        document.getElementById("cameraIcon").src=camara;
        document.getElementById("capture").innerHTML="Capturar"
        document.getElementById("cam").setAttribute("onclick","record()");
        document.getElementById("cam").style.background=color;
        document.getElementById("capture").style.background=color;
        document.getElementById("capture").setAttribute("onclick","record()");
        document.getElementById("timer").style.display = "none";
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


// starting when all render page is done!
window.onload = () =>{
    if(document.getElementById('suggest')){
        suggest();
    }
    if(document.getElementById('list-result')){
        trending();
    }
    showMyGifs();
}

function themer(){
    let list = document.getElementById("theme-list");
    list.style.display = list.style.display == "none" ? "flex": "none";
}

// function to set a given theme color
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}
function themeDay() {
    setTheme('theme-day');
    themer();
}
function themeNight(){
    setTheme('theme-night');
    themer();
}
// Immediately invoked function to set the theme on initial load
(function () {
   if (localStorage.getItem('theme') === 'theme-night') {
       setTheme('theme-night');
   } else {
       setTheme('theme-day');
   }
})();
//Enter Key eventListener on Input (search)
try{
document.getElementById('search')
  .addEventListener('keyup', function(event) {
    if (event.code === 'Enter') {
	  search()
    }
  });
}catch(e){};