import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  /* Alustetaan funktio useState avulla tilan notes 
  arvoksi propseina välitettävän alustan muistiinpanojen listan */
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  /* Voitaisiin kirjoittaa
  const hook = () => {
  console.log('effect')
  axios.get('http://localhost:3001/notes').then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
  }
  useEffect(hook, [])  
  */                  
                      
  // myös näin:
  useEffect(() => {
    noteService.getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
    }, [])        // Jos toisena parametrina on tyhjä taulukko [],
                  // suoritetaan efekti ainoastaan komponentin 
                  // ensimmäisen renderöinnin jälkeen.
  
  // do not render anything if notes is still null
  if (!notes) { 
    return null 
  }

  console.log('render', notes.length, 'notes')

  const addNote = event => {
    event.preventDefault()
    const noteObj = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService.create(noteObj).then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }         // Käytännössä { ... note} luo olion, jolla on kenttinään 
                                                                        // kopiot olion note kenttien arvoista. Kun aaltosulkeiden 
                                                                        // sisään lisätään asioita, esim. { ...note, important: true }, 
                                                                        // tulee uuden olion kenttä important saamaan arvon true.
    noteService.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    }).catch(error => {
      setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      setNotes(notes.filter(n => n.id !== id))                          // Olemattoman muistiinpanon poistaminen tapahtuu siis metodilla 
                                                                        // filter, joka muodostaa uuden taulukon, jonka sisällöksi tulee 
                                                                        // alkuperäisen taulukon sisällöstä ne alkiot, joille parametrina 
                                                                        // oleva funktio palauttaa arvon true
    })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div> 
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)} 
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submin">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App