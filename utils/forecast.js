const request = require('request')

//callback är en funktion
const forecast = (longitude, latitude, callback) => {
    //Tar fram url:en
    const url = 'http://api.weatherstack.com/current?access_key=8137fd3bbbce36f6c4decd4500c7dad1&query=' + longitude + ',' + latitude

        //Gör en http-request med url:en
    request({ url, json: true}, (error, { body }) => {
        //Om det blir något låg-nivå fel...
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } 
        //Om man lyckas få fram en request men det är fel med request:en
        else if (body.error) {
            callback('Unable to find location.', undefined)
        } 
        //Annars funkar allt
        else {
            const forecast = body.current.weather_descriptions[0] + ". It is currently " + body.current.temperature + " degrees out. It feels like " + body.current.feelslike + " degrees out."
            
            //Skickar tillbaks 
            callback(undefined, forecast)
        }
    })
}

// request({ url: url, json: true}, (error, response) => {
//     //Low-level problem. Om error finns men inte response, då t.ex har datorn ingen uppkoppling
//     if (error) {
//         console.log('Unable to connect to weather service!')
//     } 
//     //response finns, bara det att man kanske har skrivit url:en fel
//     else if(response.body.error){
//         console.log('Unable to find location')
//     }
//     else {
//         //Tar först väderprognosen, sedan hur många grader celsius det är vid platsen, sedan hur varmt det känns
//         console.log(response.body.current.weather_descriptions[0] + ". It is currently " + response.body.current.temperature + " degrees out. It feels like " + response.body.current.feelslike + " degrees out.")
//     }
// })

module.exports = forecast
