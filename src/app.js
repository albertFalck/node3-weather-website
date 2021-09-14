const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('../utils/forecast')
const geocode = require('../utils/geocode')

//Skapar en ny express applikation
const app = express()

//process.env.PORT tar port:en för den nuvarande miljön, vilket är väldigt användbart om man har webbsidan uppladdad på en webb hosting site.
//Om det inte finns någon "process.env.PORT" då kommer datorn att välja port 3000 istället
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath) //Tar en väg där partials finns

//Används för att customize:a servern
//.static() tar vägen till mappen vi vill ge
// Setup static directory to serve
app.use(express.static(path.join(publicDirectoryPath)))

//Säger vad som händer om användaren vill åt en viss url, exempelvis app.com/help
//app.get('') är för om någon vill åt "app.com". Man skriver sedan en callback-funktion som säger vad som ska ges tillbaks till den som vill åt url:en
//req = request. Objekt som innehåller info om inkommande request från servern
//res = response. Innehåller en del metodet för vad som ska skickas tillbaks till användaren
app.get('', (req, res) => {
    //.render låter en render:a något från "views". Tar emot en parameter, nämligen namnet på filen man ska skickas till
    res.render('index', {
        title: 'Weather App',
        name: 'Albert Falck'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Albert Falck'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Albert Falck',
        message: 'This is the help page :D'
    })
})

//Skapar en directory till "weather"
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'No address given'
        })
    }
    
    //Tar emot en address (t.ex "boston") och uför först en "geocode"-process för att göra om den till longitud och latitud
    //Om ingen giltig address ges blir det fel när vi försöker destructure:a datan in i longitude, latitude och location. Därför ger vi ett default värde för datan på en tom array.
    geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }

        //Tar emot longitud och latitud från geocode och söker upp väderdatan för platsen.
        forecast(longitude, latitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            //Om inget error returneras så returneras istället platsens forecast och vilken plats man sökte på.
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})



app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

//Om användaren skriver in t.ex "app.com/help/info" eller "app.com/help/fnjeifnjid" då kommer denna sida visas.
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Albert Falck',
        errorMessage: 'Help article not found'
    })
})

//Skapar en 404 ERROR NOT FOUND sida. Wildcard-karaktären ( * ) är alla directories som inte redan finns här. 
//Om denna app.get finns någon annanstans än längst ner kommer denna att ta över alla directories under den.
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Albert Falck',
        errorMessage: 'Page not found'
    })
})

//Startar up servern på en viss port. port 3000 är en port som används för utveckling
//http baserad port: port 80
//Andra parametern är en callback-funktion som säger vad som händer när servern startas upp.
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
//När man startar upp denna applikation körs detta program tills man stänger av den.
//Kom åt webbsidan på localhost:3000. Kom åt hjälpsidan på "localhost:3000/help".