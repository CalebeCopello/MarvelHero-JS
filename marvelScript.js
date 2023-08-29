const INPUT = document.getElementById('marvelInputBox')
const BUTTON = document.getElementById('marvelButton')
const MARVELDISPLAYCONTAINER = document.getElementById('marvelDisplayContainer')
const MARVELLIST = document.getElementById('marvelList')

const TIMESTAMP = '1693330665170'
const PUBLICKEY = '691b8c03ff6ba103c4ceecb6814e6c07'
const HASHVALUE = '8ca2582c55219e5864e4448bc9922299'


BUTTON.addEventListener(
    'click',
    (getResults = async () =>{
        if (INPUT.value.trim().length < 1) {
            alert("A procura não pode ser nula!")
        }
        MARVELDISPLAYCONTAINER.innerHTML = ''
        const URL = `https://gateway.marvel.com:443/v1/public/characters?name=${INPUT.value}&ts=${TIMESTAMP}&apikey=${PUBLICKEY}&hash=${HASHVALUE}`
        const response = await fetch(URL)
        const JSONDATA = await response.json()
        console.log(JSONDATA.results)
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
            console.log(e.name)
        });
    })
)
window.onload = () => {
    getResults()
}