console.log('Client side javascript file is loaded!')

// fetch('http://localhost:3000/weather?address=boston').then((response) => {
//     //response.json() parse:ar allt från browsern. 
//     //callback-funktionen inuti dess then() funktion körs när all data har blivit parse:ad.
//     response.json().then((data) => {
//         if (data.error) {
//             return console.log(data.error)
//         }

//         console.log("Location: " + data.location)
//         console.log("Forecast: " + data.forecast)
//     })
// })

//Programmet hittar form:en och input:en på webbsidan och tar datan som ges från dem.
const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')


//Om knappen i form:en trycks startas denna funktion
weatherForm.addEventListener('submit', (e) => {
    //Hindrar webbsidan från att ladda om och radera datan som form:en ska skicka när form:en skickas
    e.preventDefault()
    messageOne.textContent = 'Loading...'
    messageTwo.textContent = '' //Om det fanns någon text i "messageTwo" tas det bort

    //Vad som än ges för input i dokumentet, genom form:en, blir värdet för "location"
    const location = search.value
    
    //Addressen är "http://localhost:3000..." om man bara kör webbservern som sin egna dator.
    fetch('/weather?address=' + location).then((response) => {
    //response.json() parse:ar allt från browsern. 
    //callback-funktionen inuti dess then() funktion körs när all data har blivit parse:ad.
    response.json().then((data) => {
        if (data.error) {
            return messageOne.textContent = data.error
        }

            messageOne.textContent = "Location: " + data.location
            messageTwo.textContent = "Forecast: " + data.forecast
        })
    })
})