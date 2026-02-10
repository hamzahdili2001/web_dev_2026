// ==============================
// 1️⃣ SELECT DOM ELEMENTS
// ==============================

// Get all lists (columns) where cards can be dropped
const lists = document.querySelectorAll('.list')

// Input field where the user types the card text
const cardInput = document.getElementById('new-card-input')

// Button that creates a new card
const addCardBtn = document.getElementById('add-card-btn')

// ==============================
// 2️⃣ CREATE A NEW CARD
// ==============================

// When the "Add Card" button is clicked
addCardBtn.addEventListener('click', () => {
	// Get the input value and remove extra spaces
  const cardText = cardInput.value.trim()

	// Only create a card if the input is NOT empty
  if (cardText) {
		// Create a new <div> element
    const newCard = document.createElement('div')

		// Add the "card" CSS class
    newCard.classList.add('card')

		// Set the card text
    newCard.textContent = cardText

		// Make the card draggable (required for drag & drop)
    newCard.setAttribute('draggable', 'true')

		// Give the card a unique ID (used during drag & drop)
    newCard.id = `card-${Date.now()}`

		// Add the card to the first list
    document.getElementById('list1').appendChild(newCard)

		// Clear the input after adding the card
    cardInput.value = ''

		// Add drag event listeners to the new card
    newCard.addEventListener('dragstart', dragStart)
    newCard.addEventListener('dragend', dragEnd)
  }
})

// ==============================
// 3️⃣ LIST EVENT LISTENERS
// ==============================

// Add drag & drop listeners to each list
for (const list of lists) {
  list.addEventListener('dragover', dragOver)
  list.addEventListener('dragenter', dragEnter)
  list.addEventListener('dragleave', dragLeave)
  list.addEventListener('drop', drop)
}

// ==============================
// 4️⃣ DRAG FUNCTIONS
// ==============================

// Fired when the user starts dragging a card
function dragStart (e) {
	// Store the dragged card ID so we can retrieve it on drop
  e.dataTransfer.setData('text/plain', this.id)

	// Add a class for visual feedback (opacity, border, etc.)
  this.classList.add('dragging')
}

// Fired when the user stops dragging the card
function dragEnd () {
	// Remove the dragging visual effect
  this.classList.remove('dragging')
}

// ==============================
// 5️⃣ DROP ZONE FUNCTIONS
// ==============================

// Required to allow dropping
function dragOver (e) {
  e.preventDefault()
}

// Fired when a draggable item enters a list
function dragEnter () {
  this.classList.add('over')
}

// Fired when a draggable item leaves a list
function dragLeave () {
  this.classList.remove('over')
}

// Fired when the card is dropped into a list
function drop (e) {
	// Prevent default browser behavior
  e.preventDefault()

	// Get the ID of the dragged card
  const id = e.dataTransfer.getData('text/plain')

	// Find the dragged card using its ID
  const draggable = document.getElementById(id)

	// Add the card to the current list
  this.appendChild(draggable)

	// Remove the visual highlight from the list
  this.classList.remove('over')
}
