const INPUT = document.getElementById('marvelInputBox')
const BUTTON = document.getElementById('marvelButton')
const MARVELDISPLAYCONTAINER = document.getElementById('marvelDisplayContainer')
const MARVELLIST = document.getElementById('marvelList')

const TIMESTAMP = '1693330665170'
const PUBLICKEY = '691b8c03ff6ba103c4ceecb6814e6c07'
const HASHVALUE = '8ca2582c55219e5864e4448bc9922299'

fetch(`http://gateway.marvel.com/v1/public/comics?ts=${TIMESTAMP}&apikey=${PUBLICKEY}&hash=${HASHVALUE}`).then((r) => {
    return r.json()
}).then((j) => {
    console.log(j)
})

BUTTON.addEventListener(
    'click',
    (getResult = async () =>{
        if (INPUT.value.trim().length < 1) {
            alert("A procura não pode ser nula!")
        }
    })
)