const author = document.querySelector('.author')
const tagsContainer = document.querySelector('.tags')
const quoteParagraph = document.querySelector('.quote-paragraph')
const randomBtn = document.getElementById('random')
const shareBtn = document.getElementById('share')
const status = document.getElementById('status')

let currentIndex = 0
let quotes = []

randomBtn.disabled = true
shareBtn.disabled = true
status.textContent = 'Loading quotes.'

// Fetch quotes from the API
fetch(
	'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/3-javascript/challenges/group_1/data/random-quotes.json'
)
	.then(response => response.json())
	.then(data => {
  quotes = data

  currentIndex = getRandomIndex(quotes.length)

  displayRandomQuote(currentIndex)
  status.textContent = 'Quotes loaded.'
  randomBtn.disabled = false
  shareBtn.disabled = false

  randomBtn.addEventListener('click', () => {
    currentIndex = getRandomIndex(quotes.length)
    displayRandomQuote(currentIndex)
  })

  shareBtn.addEventListener('click', () => shareQuote(currentIndex))
})
	.catch(error => {
  console.error('Error fetching quotes:', error)
  status.textContent =
			'Could not load quotes. Please refresh and try again.'
})

function getRandomIndex (length) {
  return Math.floor(Math.random() * length)
}

function displayRandomQuote (index) {
  const quote = quotes[index]
  author.textContent = quote.author
  quoteParagraph.textContent = quote.quote
  author.setAttribute('aria-label', `Author: ${quote.author}`)

  tagsContainer.innerHTML = ''

  quote.tags.forEach(tag => {
    let span = document.createElement('span')
    span.textContent = tag

    tagsContainer.appendChild(span)
  })

  status.textContent = `Quote updated: ${quote.author}`
}

function shareQuote (index) {
  const quote = quotes[index]
  const text = `"${quote.quote}" — ${quote.author}`

  if (navigator.share) {
    navigator.clipboard.writeText(text)

    navigator.share({ text })

    status.textContent = 'Quote copied and ready to share.'
  } else {
    navigator.clipboard.writeText(text)
    status.textContent = 'Quote copied.'
  }
}
