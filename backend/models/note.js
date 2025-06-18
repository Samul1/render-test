const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Koodissa on jonkin verran muutoksia aiempaan. 
// Tietokannan yhteysosoite välitetään sovellukselle 
// nyt MONGODB_URI ympäristömuuttujan kautta, koska 
// sen kovakoodaaminen sovellukseen ei ole järkevää.
// Komentorivillä: MONGODB_URI="osoite_tahan" npm run dev
const url = process.env.MONGODB_URI


console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)