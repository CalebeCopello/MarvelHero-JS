const INPUT = document.getElementById('marvelInputBox')
const BUTTON = document.getElementById('marvelButton')
const MARVELDISPLAYCONTAINER = document.getElementById('marvelDisplayContainer')
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
    'keyup', 
    async() => {
    removeElements()
    if(INPUT.value.length < 3) {
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
        MARVELDISPLAYCONTAINER.innerHTML = ''
        const URL = `https://gateway.marvel.com:443/v1/public/characters?name=${INPUT.value}&ts=${TIMESTAMP}&apikey=${PUBLICKEY}&hash=${HASHVALUE}`
        const RESPONSE = await fetch(URL)
        const JSONDATA = await RESPONSE.json()
        console.log(JSONDATA.data['results'])
        JSONDATA.data['results'].forEach((e) => {
            MARVELDISPLAYCONTAINER.innerHTML = `
            <div class="marvelCardContainer">
                <div class="marvelCharacterImageContainer">
                    <img src="${e.thumbnail['path'] + '.' + e.thumbnail['extension']}" />
                </div>
                <div class="marvelCharacterName">
                    ${e.name}
                </div>
                <div class="marvelCharacterDescription">
                ${e.description}
            </div>
            </div>
            `

        });
    })
)
window.onload = () => {
    getResults()
}