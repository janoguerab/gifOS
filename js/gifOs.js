const API_KEY_Base64 = 'OVg0d1NYSTVETDA4UUhRcUNJMGI4MWhMSjI0NXVUbFg=' //Encoded Key
const SEARCH_URL     = 'http://api.giphy.com/v1/gifs/search'
const TRENDING_URL   = 'http://api.giphy.com/v1/gifs/trending'
const limitTrending  = 4

function search(){
    let value = document.getElementById('search').value
    let found = fetch( SEARCH_URL +'?q=' + value + '&api_key=' + window.atob(API_KEY_Base64))
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

function trending(){
    let found = fetch( TRENDING_URL +'?limit=' + limitTrending + '&api_key=' + window.atob(API_KEY_Base64))
        .then(response => {
            return response.json()
        })
        .then(data => { // Get Searched images, puts into results
            if(data.data.length > 0){
                var list = document.getElementById('suggest')
                list.innerHTML='' //Remove before results
                for (let index = 0; index < data.data.length; index++) {
                   
                    let result = document.createElement('div')
                    result.setAttribute("class",'suggestResutl')  

                    let resultBar = document.createElement('div')
                    resultBar.setAttribute("class",'upBar bar') 

                    let resultTitle = document.createElement('span')
                    resultTitle.setAttribute("class",'title')   
                    resultTitle.innerText = '#'+data.data[index].title.replace(/\s/g,'').split('GIF')[0]
                    
                    let closeButton = document.createElement('div')
                    closeButton.setAttribute("class",'close') 
                    closeButton.setAttribute("id",'close-'+(index+1)) 

                    resultBar.appendChild(resultTitle)
                    resultBar.appendChild(closeButton)

                    let image = document.createElement('img')
                    image.setAttribute('class','suggestImage') //Evalues if puts a image Large or normal            
                    image.setAttribute('src',data.data[index].images.downsized.url)

                    let seeMoreButton = document.createElement('div')
                    seeMoreButton.setAttribute("class",'seeMore') 
                    seeMoreButton.setAttribute("id",'seeMore-'+(index+1)) 
                    seeMoreButton.innerText="Ver más..."

                    result.appendChild(resultBar)
                    result.appendChild(image)
                    result.appendChild(seeMoreButton)
     
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

window.onload = () =>{
    trending()
}

// function to set a given theme/color-scheme
function setTheme(themeName) {
    console.log(themeName)
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