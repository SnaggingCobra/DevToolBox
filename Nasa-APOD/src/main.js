import './style.css'


const app = document.querySelector('#app')
// this is for async //
async function getApod() {
  console.log('Getting APOD...')

  const response = await fetch(
  'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
)
  const data = await response.json()
  console.log(data.date)
  console.log(data.title)

//-----------//

  app.innerHTML = `
  <h1>${data.title}</h1>

  <img src="${data.url}" alt="${data.title}">

  <p>${data.explanation}</p>
`
}

getApod()

