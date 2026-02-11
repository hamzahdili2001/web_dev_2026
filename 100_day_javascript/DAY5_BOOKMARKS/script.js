// ==============================
// 1️⃣ DOM ELEMENTS
// ==============================
// We store DOM references once instead of querying multiple times.
// This improves performance and keeps code cleaner.

const form = document.querySelector('form')
const nameInput = document.getElementById('name')
const linkInput = document.getElementById('link')
const list = document.getElementById('bookmarks')
const emptyMessage = document.querySelector('p')

// ==============================
// 2️⃣ STORAGE HELPERS
// ==============================
// These functions centralize localStorage logic.
// If we ever change storage method, we only change it here.

function getBookmarks () {
	// Parse stored data or return empty array if nothing exists
  return JSON.parse(localStorage.getItem('bookmarks')) || []
}

function saveBookmarks (data) {
	// Always stringify before saving to localStorage
  localStorage.setItem('bookmarks', JSON.stringify(data))
}

// ==============================
// 3️⃣ RENDER FUNCTION
// ==============================
// This function clears the UI and rebuilds it from storage.
// This avoids duplication and keeps UI in sync with state.

function renderBookmarks () {
  const data = getBookmarks()

  list.innerHTML = ''

  let emptyMessage = document.querySelector('.empty-message')

  if (data.length === 0) {
    if (!emptyMessage) {
      emptyMessage = document.createElement('p')
      emptyMessage.classList.add('empty-message')
      emptyMessage.textContent = 'No bookmarks yet.'
      list.parentElement.insertBefore(emptyMessage, list)
    }
    return
  }

  if (emptyMessage) emptyMessage.remove()

  data.forEach(bookmark => {
    createBookmarkElement(bookmark)
  })
}

// ==============================
// 4️⃣ CREATE BOOKMARK ELEMENT
// ==============================
// Responsible only for creating and appending DOM elements.

function createBookmarkElement ({ name, link, id }) {
  const listItem = document.createElement('li')
  const anchor = document.createElement('a')
  const button = document.createElement('button')

	// Configure anchor safely
  anchor.href = link
  anchor.textContent = name
  anchor.target = '_blank'

	// Security improvement:
	// Prevents new page from accessing window.opener
  anchor.rel = 'noopener noreferrer'

	// Attach bookmark id to element (useful for delegation)
  listItem.dataset.id = id

  button.textContent = 'Delete'

  listItem.appendChild(anchor)
  listItem.appendChild(button)
  list.appendChild(listItem)
}

// ==============================
// 5️⃣ ADD BOOKMARK
// ==============================
// Handles form submission and updates state.

function addBookmark (name, link) {
  const data = getBookmarks()

	// Prevent duplicate links
  const alreadyExists = data.some(bookmark => bookmark.link === link)
  if (alreadyExists) {
    alert('This bookmark already exists!')
    return
  }

  const newBookmark = {
    id: Date.now(),
    name,
    link
  }

  data.push(newBookmark)
  saveBookmarks(data)

  renderBookmarks() // Re-render UI cleanly
}

// ==============================
// 6️⃣ DELETE BOOKMARK
// ==============================
// Removes bookmark from state using its id.

function deleteBookmark (id) {
  const data = getBookmarks()

  const filteredData = data.filter(bookmark => bookmark.id !== id)

  saveBookmarks(filteredData)

  renderBookmarks() // Keep UI and storage synchronized
}

// ==============================
// 7️⃣ EVENT LISTENERS
// ==============================

// Form submission
form.addEventListener('submit', event => {
  event.preventDefault()

  const name = nameInput.value.trim()
  const link = linkInput.value.trim()

  if (!name || !link) return

  addBookmark(name, link)

  form.reset()
})

// Event Delegation for Delete Buttons
// Instead of adding a click listener to every button,
// we attach ONE listener to the parent <ul>.
// This is more scalable and performant.

list.addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    const id = Number(event.target.parentElement.dataset.id)
    deleteBookmark(id)
  }
})

// ==============================
// 8️⃣ INITIAL LOAD
// ==============================
// When the page loads, render stored bookmarks.

renderBookmarks()
