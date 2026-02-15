const author = document.querySelector('.author')
const tagsContainer = document.querySelector('.tags')
const quoteParagraph = document.querySelector('.quote-paragraph')
const randomBtn = document.getElementById('random')
const shareBtn = document.getElementById('share')

let currentIndex = 0
let quotes = []

// Fetch quotes from the API
fetch(
	'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/3-javascript/challenges/group_1/data/random-quotes.json'
)
	.then(response => response.json())
	.then(data => {
  quotes = data

  currentIndex = getRandomIndex(quotes.length)

  displayRandomQuote(currentIndex)

  randomBtn.addEventListener('click', () => {
    currentIndex = getRandomIndex(quotes.length)
    displayRandomQuote(currentIndex)
  })

  shareBtn.addEventListener('click', () => shareQuote(currentIndex))
})
	.catch(error => {
  console.error('Error fetching quotes:', error)
})

function getRandomIndex (length) {
  return Math.floor(Math.random() * length)
}

function displayRandomQuote (index) {
  const quote = quotes[index]
  author.textContent = quote.author
  quoteParagraph.textContent = quote.quote

  tagsContainer.innerHTML = ''

  quote.tags.forEach(tag => {
    let span = document.createElement('span')
    span.textContent = tag

    tagsContainer.appendChild(span)
  })
}

function shareQuote (index) {
  const quote = quotes[index]
  const text = `"${quote.quote}" — ${quote.author}`

  if (navigator.share) {
    navigator.clipboard.writeText(text)

    navigator.share({ text })

    alert('Quote copied!')
  } else {
    navigator.clipboard.writeText(text)
    alert('Quote copied!')
  }
}
