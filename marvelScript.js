const INPUT = document.getElementById('marvelInputBox')
const BUTTON = document.getElementById('marvelButton')
const MARVELDISPLAYCONTAINER = document.getElementById('marvelDisplayContainer')
const MARVELCARDCONTAINER = document.getElementById('marvelCardContainer')
const MARVELCOMICSCONTAINER = document.getElementById('marvelComicsContainer')
const MARVELLIST = document.getElementById('marvelList')
const TIMESTAMP = '1693330665170'
const PUBLICKEY = '691b8c03ff6ba103c4ceecb6814e6c07'
const HASHVALUE = '8ca2582c55219e5864e4448bc9922299'

function displayWords(value) {
    INPUT.value = value
    removeElements()
}

function removeElements() {
    MARVELLIST.innerHTML = ''
}

INPUT.addEventListener(
    'input', 
    async() => {
    removeElements()
    if(INPUT.value.length < 4) {
        return false
    }
    const URL = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${INPUT.value}&ts=${TIMESTAMP}&apikey=${PUBLICKEY}&hash=${HASHVALUE}`
    const RESPONSE = await fetch(URL)
    const JSONDATA = await RESPONSE.json()
    JSONDATA.data['results'].forEach((r) => {
        let name = r.name
        let div = document.createElement('div')
        div.style.cursor = 'pointer'
        div.classList.add('marvelAutoCompleteItems')
        div.setAttribute('onclick','displayWords("'+ name +'")')
        let word = '<strong>' + name.substr(0,INPUT.value.length) +'</strong>'
        word += name.substr(INPUT.value.length)
        div.innerHTML = `
        <p class='marvelItem'>${word}</p>
        `
        MARVELLIST.appendChild(div)
    })
})

BUTTON.addEventListener(
    'click',
    (getResults = async () =>{
        if (INPUT.value.trim().length < 1) {
            alert("A procura não pode ser nula!")
        }
        MARVELCARDCONTAINER.innerHTML = ''
        let url = `https://gateway.marvel.com:443/v1/public/characters?name=${INPUT.value}&ts=${TIMESTAMP}&apikey=${PUBLICKEY}&hash=${HASHVALUE}`
        let response = await fetch(url)
        const JSONDATACHAR = await response.json()


        const ID = JSONDATACHAR.data.results[0].id
        url = `https://gateway.marvel.com:443/v1/public/characters/${ID}/comics?dateRange=1900-01-01%2C2013-01-02&orderBy=onsaleDate&limit=3&ts=${TIMESTAMP}&apikey=${PUBLICKEY}&hash=${HASHVALUE}`
        response = await fetch(url)
        const JSONDATAFIRSTCOMIC = await response.json()
        // console.log(JSONDATAFIRSTCOMIC.data['results'])

        JSONDATACHAR.data['results'].forEach((e) => {
            let description = e.description
            if(description == '') description = 'Description not found.'
            MARVELCARDCONTAINER.innerHTML = `
                <div class="marvelCharacterImageContainer">
                    <img src="${e.thumbnail['path'] + '.' + e.thumbnail['extension']}" />
                </div>
                <div class="marvelCharacterName">
                    ${e.name}
                </div>
                <div class="marvelCharacterDescription">
                ${description}
            </div>
            `
        })
        // console.log(Object.keys(JSONDATAFIRSTCOMIC.data.results).length)
        MARVELCOMICSCONTAINER.innerHTML = ''
        for(i = 0; i < Object.keys(JSONDATAFIRSTCOMIC.data.results).length; i++) {
            MARVELCOMICSCONTAINER.innerHTML += `
            <div class='marvelComicsDisplay${i}'>
            <img src="${JSONDATAFIRSTCOMIC.data.results[i].thumbnail.path}.${JSONDATAFIRSTCOMIC.data.results[i].thumbnail.extension}" />
            </div>
            `
        }
    })
)
window.onload = () => {
    getResults()
}