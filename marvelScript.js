//constants
const INPUT = document.getElementById('marvelInputBox')
const BUTTON = document.getElementById('marvelButton')
const MARVELHEROIMG = document.getElementById('marvelHeroImg')
const MARVELHERONAME = document.getElementById('marvelHeroName')
const MARVELHERODESC = document.getElementById('marvelHeroDesc')
const MARVELCOMICSCONTAINER = document.getElementById('marvelComicsContainer')
const MARVELSEARCHLIST = document.getElementById('marvelSearchList')
const TIMESTAMP = '1693330665170'
const PUBLICKEY = '691b8c03ff6ba103c4ceecb6814e6c07'
const HASHVALUE = '8ca2582c55219e5864e4448bc9922299'

//variables
let timer
let description = ''
let thumbnail = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'
let comicTitle
let comicIssue
let comicDescription

function displayWords(value) {
    INPUT.value = value
    removeElements()
    getResults()
}

function removeElements() {
    const autocompleteItems = document.querySelectorAll('.marvelAutoCompleteItems')
    autocompleteItems.forEach((item) => {
        item.remove()
    })
}

INPUT.addEventListener('input', () => {
    clearTimeout(timer)
    
    timer = setTimeout(async () => {
        removeElements()
        
        if (INPUT.value.length < 3) {
            return
        }
        
        const URL = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${INPUT.value}&ts=${TIMESTAMP}&apikey=${PUBLICKEY}&hash=${HASHVALUE}`
        const RESPONSE = await fetch(URL)
        const JSONDATA = await RESPONSE.json()

        JSONDATA.data['results'].forEach((r) => {
            //TODO:filter search using comics, series, stories, events
            if (r.description == description && r.thumbnail.path == thumbnail && r.comics.available === 0) {
                return false
            } else { 
                let div = document.createElement('div')
                div.style.cursor = 'pointer'
                div.classList.add('marvelAutoCompleteItems')
                div.setAttribute('onclick', 'displayWords("' + r.name + '")')
                let word = '<strong>' + r.name.substr(0, INPUT.value.length) + '</strong>'
                word += r.name.substr(INPUT.value.length)
                div.innerHTML = `
                    <span class='marvelSearchItem'>${word}</span>
                    <img src="${r.thumbnail['path'] + '.' + r.thumbnail['extension']}" height='20' width='20' class='marvelSearchImg'/>
                `
                MARVELSEARCHLIST.appendChild(div)
            }
        })
    }, 1000)
})

BUTTON.addEventListener(
    'click',
    (getResults = async () =>{
        if (INPUT.value.trim().length < 1) {
            alert("A procura não pode ser nula!")
        }
        let url = `https://gateway.marvel.com:443/v1/public/characters?name=${INPUT.value}&ts=${TIMESTAMP}&apikey=${PUBLICKEY}&hash=${HASHVALUE}`
        let response = await fetch(url)
        const JSONDATACHAR = await response.json()

        const ID = JSONDATACHAR.data.results[0].id
        url = `https://gateway.marvel.com:443/v1/public/characters/${ID}/comics?dateRange=1900-01-01%2C2013-01-02&orderBy=onsaleDate&limit=3&ts=${TIMESTAMP}&apikey=${PUBLICKEY}&hash=${HASHVALUE}`
        response = await fetch(url)
        const JSONDATAFIRSTCOMIC = await response.json()
        // console.log(JSONDATAFIRSTCOMIC.data['results'])

        JSONDATACHAR.data.results.forEach((e) => {
            let description = e.description
            if(description == '') description = 'No description available.'
            MARVELHEROIMG.innerHTML = `
                    <img src="${e.thumbnail.path + '.' + e.thumbnail.extension}" />
                    `
            MARVELHERONAME.innerHTML = `
                    ${e.name}
                    `
            MARVELHERODESC.innerHTML = `
                ${description}
            `
        })
        let issues = 0
        MARVELCOMICSCONTAINER.innerHTML = ''
        for(i = 0; i < Object.keys(JSONDATAFIRSTCOMIC.data.results).length; i++) {
            if (JSONDATAFIRSTCOMIC.data.results[i].title == '') { 
                comicTitle = 'No title'
            } else {
                comicTitle = JSONDATAFIRSTCOMIC.data.results[i].title
            }
            if (JSONDATAFIRSTCOMIC.data.results[i].issueNumber == 0) {
                comicIssue = 'Unknown'
            } else {
                comicIssue = JSONDATAFIRSTCOMIC.data.results[i].issueNumber
            }
            if (JSONDATAFIRSTCOMIC.data.results[i].description == null) {
                comicDescription = 'Not avaiable'
            } else {
                comicDescription = JSONDATAFIRSTCOMIC.data.results[i].description
            }
            
            MARVELCOMICSCONTAINER.innerHTML += `
                <div class="marvelComic${i+1}">
                    <div class="marvelComic${i+1}Inner">
                        <div class="marvelComic${i+1}Front">
                            <img src="${JSONDATAFIRSTCOMIC.data.results[i].thumbnail.path}.${JSONDATAFIRSTCOMIC.data.results[i].thumbnail.extension}" />
                        </div>
                        <div class="marvelComic${i+1}Back">
                            <p class="marvelComicP">Title: ${comicTitle}</p>
                            <p class="marvelComicP">Issue: ${comicIssue}</p>
                            <p class="marvelComicP">Description: ${comicDescription}</p>
                        </div>
                    </div>
                </div>
            `
            issues++
        }
        while(issues < 3){
            MARVELCOMICSCONTAINER.innerHTML += `
                <div class="marvelComic${issues+1}">
                    <div class="marvelComic${issues+1}Inner">
                        <div class="marvelComic${issues+1}Front">
                            <span class='marvelNoComic'> No comic avaiable! <span>
                        </div>
                        <div class="marvelComic${issues+1}Back">
                            <span class='marvelNoComic'> No comic avaiable! <span>
                        </div>
                    </div>
                </div>
            `
            issues++
        }
    })
)
window.onload = () => {
    getResults()
}
{/* <img src="${JSONDATAFIRSTCOMIC.data.results[i].thumbnail.path}.${JSONDATAFIRSTCOMIC.data.results[i].thumbnail.extension}" /> */}
