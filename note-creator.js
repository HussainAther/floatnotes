import { updateData, getData } from 'firebase-realtime-database';

const MyApp = {};

const colors =
  ['#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#5ac8fa', '#007aff', '#5856d6', '#ff2d55']

let lastDisplayedQuote = null;

// Function to fetch notes data from Firebase
async function fetchNotesFromFirebase() {
  try {
    const notesData = await getData('notes');
    if (notesData) {
      const notes = Object.values(notesData);
      notes.forEach((noteData) => {
        const { text, color, position, rotation } = noteData;
        createNote({
          text,
          color,
          position: new THREE.Vector3().fromArray(position),
          rotation: new THREE.Quaternion().fromArray(rotation),
        });
      });
    }
  } catch (error) {
    console.error('Error loading notes from Firebase:', error);
  }
}

// Function to load notes from Firebase on page load
async function loadNotesFromFirebase() {
  try {
    // Firebase is ready, set the Firestore reference
    // MyApp.db = getFirestore();
    // Call the function to fetch and load notes from Firebase on page load
    await fetchNotesFromFirebase();
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

const getWorldPosition = (object) => {
  const position = new THREE.Vector3()
  position.setFromMatrixPosition(object.matrixWorld)
  return position
}

const getWorldQuaternion = (object) => {
  const position = new THREE.Vector3()
  const scale = new THREE.Vector3()
  const target = new THREE.Quaternion()
  object.matrixWorld.decompose(position, target, scale)
  return target
}
function showSignUpForm() {
  const signUpForm = document.getElementById('signUpForm');
  const signInForm = document.getElementById('signInForm');
  signUpForm.style.display = 'block';
  signInForm.style.display = 'none';
}

function showSignInForm() {
  const signUpForm = document.getElementById('signUpForm');
  const signInForm = document.getElementById('signInForm');
  signUpForm.style.display = 'none';
  signInForm.style.display = 'block';
}

function showSignOutButton() {
  const signUpForm = document.getElementById('signUpForm');
  const signInForm = document.getElementById('signInForm');
  const signOutButton = document.getElementById('signOutButton');
  signUpForm.style.display = 'none';
  signInForm.style.display = 'none';
  signOutButton.style.display = 'block';
}

function hideSignOutButton() {
  const signOutButton = document.getElementById('signOutButton');
  signOutButton.style.display = 'none';
}

function hideQuoteButton() {
  const quoteButton = document.getElementById('getQuoteButton');
  quoteButton.style.display = 'none';
}

function showQuoteButton() {
  const quoteButton = document.getElementById('getQuoteButton');
  quoteButton.style.display = 'block';
}

// Add the checkAndHideForm function
function checkAndHideForm(event, formId) {
  if (event.keyCode === 13) {
    hideForm(formId);
  }
}

// Hide the form with the specified formId
function hideForm(formId) {
  const form = document.getElementById(formId);
  form.style.display = 'none';
}

const noteCreatorComponent = {
  schema: {
    type: 'array',
    default: [],
  },

  // Assign the functions to the properties of the noteCreatorComponent object
  showSignUpForm,
  showSignInForm,
  showSignOutButton,
  hideSignOutButton,

  // Define the functions as properties of the noteCreatorComponent object
  showSignUpForm() {
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');
    signUpForm.style.display = 'block';
    signInForm.style.display = 'none';
  },

  showSignInForm() {
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');
    signUpForm.style.display = 'none';
    signInForm.style.display = 'block';
  },

  showSignOutButton() {
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');
    const signOutButton = document.getElementById('signOutButton');
    signUpForm.style.display = 'none';
    signInForm.style.display = 'none';
    signOutButton.style.display = 'block';
  },

  hideSignOutButton() {
    const signOutButton = document.getElementById('signOutButton');
    signOutButton.style.display = 'none';
  },

  init() {
    this.noteInput = document.getElementById('noteInput')
    const overlay = document.getElementById('overlay')
    const initialHeight = overlay.offsetHeight
    const initialWidth = overlay.offsetWidth

    const dropBtn = document.getElementById('dropButton')

    const newNote = document.getElementById('createNoteButton')

    // const getQuoteButton = document.getElementById('getQuoteButton');

    document.getElementById('getQuoteButton').addEventListener('click', () => {
      getAndDisplayRandomQuote();
    });

    // const signUp = document.getElementById('signUpButton'); 
    // const signIn = document.getElementById('signInButton'); 
    const signOutButton = document.getElementById('signOutButton');
    signOutButton.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent the default touch event behavior
      noteCreatorComponent.showSignOutButton();
    });

    document.getElementById('signUpButton').addEventListener('click', () => {
      noteCreatorComponent.showSignUpForm();
    });

    document.getElementById('signInButton').addEventListener('click', () => {
      noteCreatorComponent.showSignInForm();
    });

    let currentText = ''

    const holdAnchor = document.getElementById('holdAnchor')

    let isEditing = false

    const scene = this.el.sceneEl

    let currentNote = null

    const getNoteText = note => note.children[0].getAttribute('text').value

    const setNoteText = (note, text) => note.children[0].setAttribute('text', {
      value: text,
      wrapCount: Math.min(15, text.length),
      color: 'black',
      baseline: 'top',
      font: 'https://cdn.aframe.io/fonts/Roboto-msdf.json', // Update the font URL here
    });

    const startEditing = () => {
      if (isEditing) {
        return
      }
      isEditing = true

      this.noteInput.value = currentText

      this.noteInput.style.display = 'block'
      this.noteInput.focus()
      this.noteInput.style.opacity = '1'
      this.noteInput.style.pointerEvents = 'auto'
    }

    const createNote = ({text, color, position, rotation}) => {
      const note = document.createElement('a-entity')
      const noteText = document.createElement('a-entity')
      note.appendChild(noteText)
      scene.appendChild(note)

      note.classList.add('note')
      position && note.object3D.position.copy(position)
      rotation && note.object3D.quaternion.copy(rotation)
      color && note.setAttribute('material', `color:${color}`)
      note.setAttribute('geometry', 'primitive: box; width: 2; height: 2; depth: 0.1;')
      note.setAttribute('shadow', '')

      noteText.setAttribute('position', '0 0.5 0.065')
      noteText.setAttribute('geometry', 'primitive: plane; width: 1.75; height: 1.75;')
      noteText.setAttribute('material', 'transparent: true; opacity: 0')
      noteText.setAttribute('text', 'value: placeholder; color: black; baseline: top;')
      setNoteText(note, text)

      note.addEventListener('click', () => {
        currentNote = note
        currentText = getNoteText(currentNote)
        startEditing()
      })

      // Save the note data to Firebase
      updateData('notes/' + note.id, {
        text,
        color: color || '',
        position: position ? position.toArray() : [],
        rotation: rotation ? rotation.toArray() : [],
      });

      return note
    }

    const stopEditing = () => {
      if (!isEditing) {
        return
      }
      isEditing = false
      this.noteInput.style.opacity = '0.01'
      this.noteInput.style.pointerEvents = 'none'
      this.noteInput.style.display = 'none'

      if (currentNote) {
        setNoteText(currentNote, currentText)
      } else {
        const color = colors[Math.floor(colors.length * Math.random())]
        createNote({
          color,
          text: currentText,
          position: getWorldPosition(holdAnchor.object3D),
          rotation: getWorldQuaternion(holdAnchor.object3D),
        })
      }
      currentNote = null
    }

    window.addEventListener('resize', (e) => {
      setTimeout(() => {
        if (overlay.offsetWidth === initialWidth && initialHeight > 1.5 * overlay.offsetHeight) {
          // Keyboard is likely opened
        } else if (overlay.offsetHeight > 0.8 * initialHeight) {
          // Keyboard is likely closed
          stopEditing()
        }
      }, 500)
    })

    this.noteInput.addEventListener('blur', () => stopEditing())

    newNote.addEventListener('click', (e) => {
      newNote.classList.add('pulse-once')
      setTimeout(() => newNote.classList.remove('pulse-once'), 500)
      currentText = ''
      startEditing()
    })

    this.noteInput.addEventListener('keyup', e => currentText = e.target.value)

    dropBtn.addEventListener('click', (e) => {
      // get all notes
      const notes = Array.from(scene.querySelectorAll('.note'))
      const stickyNotes = Array.from(scene.querySelectorAll('.sticky-note'))

      dropBtn.classList.add('pulse-once')
      setTimeout(() => dropBtn.classList.remove('pulse-once'), 500)

      // Add gravity to all notes
      notes.forEach((el) => {
        if (!el.getAttribute('dynamic-body')) {
          el.setAttribute('body', {type: 'dynamic', mass: 5, shape: 'none'})
          el.setAttribute('shape__main', {shape: 'box', halfExtents: '1 1 0.15', offset: '0 0 0'})
        }
      })

      // Make the notes and sticky notes disappear
      setTimeout(() => {
        notes.forEach(el => el.setAttribute('visible', 'false'))
        stickyNotes.forEach(note => note.remove())
      }, 1500)
    })
  },
}
const optimizeThreejsWorldMatrixUpdates = () => {
  // Just overriding this code directly for maximum performance.
  const updateMatrixWorldOnlyIfVisible = function (force) {
    if (!this.visible) return

    // Copied source follows here.
    if (this.matrixAutoUpdate) {
      this.updateMatrix()
    }
    if (this.matrixWorldNeedsUpdate || force) {
      if (this.parent === null) {
        this.matrixWorld.copy(this.matrix)
      } else {
        this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)
      }
      this.matrixWorldNeedsUpdate = false
      force = true
    }
    // update children
    const {children} = this
    const l = children.length
    for (let i = 0; i < l; i++) {
      children[i].updateMatrixWorld(force)
    }
  }

  AFRAME.THREE.Object3D.prototype.updateMatrixWorld = updateMatrixWorldOnlyIfVisible
}

async function fetchRandomQuote() {
  const apiUrl = 'https://type.fit/api/quotes';

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (error) {
    console.error('Error fetching random quote:', error);
    return null;
  }
}

function displayQuoteAsStickyNote(quote) {
  // Create a new sticky note entity
  const stickyNote = document.createElement('a-entity');
  stickyNote.setAttribute('geometry', 'primitive: box; width: 4; height: 2.4; depth: 0.01;'); // Doubled width and height
  stickyNote.setAttribute('material', 'color: yellow');
  stickyNote.setAttribute('position', '0 1 -3'); // Set the position of the sticky note in the scene
  stickyNote.classList.add('sticky-note');

  // Create a new entity for the text
  const textEntity = document.createElement('a-entity');
  textEntity.setAttribute('text', `value: ${quote.text}; wrapCount: 24; align: center; color: black; width: 3.5; height: 1.5; fontSize: 0.2`); // Adjusted width, height, and font size
  textEntity.setAttribute('position', '0 0 0.01'); // Set the position of the text slightly in front of the sticky note
  stickyNote.appendChild(textEntity);

  // Add the sticky note to the AR scene
  const scene = document.querySelector('a-scene');
  scene.appendChild(stickyNote);
}



function getAndDisplayRandomQuote() {
  const previousNotes = document.querySelectorAll('.sticky-note');
  previousNotes.forEach(note => note.remove());

  // If the lastDisplayedQuote is available, display it again
  if (lastDisplayedQuote) {
    displayQuoteAsStickyNote(lastDisplayedQuote);
  } else {
    fetchRandomQuote().then(quote => {
      if (quote) {
        displayQuoteAsStickyNote(quote);
      }
    });
  }

  // If there are quote notes in the scene, hide the "GetQuote" button
  const quoteNotes = Array.from(document.querySelectorAll('.quote-note'));
  if (quoteNotes.length > 0) {
    hideQuoteButton();
  } else {
    showQuoteButton();
  }
}

export { noteCreatorComponent, optimizeThreejsWorldMatrixUpdates };


// Export functions to the global object (window)
window.noteCreatorComponent = noteCreatorComponent;
window.optimizeThreejsWorldMatrixUpdates = optimizeThreejsWorldMatrixUpdates;
// Attach the functions to the global window object
window.showSignUpForm = noteCreatorComponent.showSignUpForm;
window.showSignInForm = noteCreatorComponent.showSignInForm;
window.showSignOutButton = noteCreatorComponent.showSignOutButton;
window.hideSignOutButton = noteCreatorComponent.hideSignOutButton;

// Call the function to load notes from Firebase on page load
window.addEventListener('load', loadNotesFromFirebase);
