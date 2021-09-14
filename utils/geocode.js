const request = require('request')

//Tar addressen och tar fram latituden och longituden. 
//Callback-funktionen är den vi kör när vi faktiskt har latituden och longituden.
//encodeURIComponent() ser till att, om man söker på en plats med specialkaraktärer i namnet, så kommer det ändå funka 
const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoibWluaW1lMG8wbyIsImEiOiJja3RlOXA3bTMwNXR5MnBxbmEzcm56a3J2In0.SEoZ7WqWEln4C6tTtvsbGA&limit=1'

    request({ url, json: true }, (error, {body}) => {
        if (error){
            //Ger ett värde för "error", inte för "data"
            //Låter callback-funktionen ta hand om vad som händer om något går fel
            callback('Unable to connect to location services!', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            //Ger ett värde för "data", inte "error"
            callback(undefined, {
                longitude: body.features[0].center[1],
                latitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode