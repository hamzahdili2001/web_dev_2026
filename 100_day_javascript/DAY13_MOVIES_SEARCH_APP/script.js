import { API_TOKEN } from './config.js'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`
  }
}

const DISCOVER_URL =
	'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc'
const SEARCH_URL =
	'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query='
const DISCOVER_BY_PAGE_URL =
	'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page='
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original'
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w780'
const YOUTUBE_VIDEO_BASE_URL = 'https://www.youtube.com/watch?v='
const YOUTUBE_SEARCH_URL = 'https://www.youtube.com/results?search_query='
const STREAMING_SEARCH_URL = 'https://www.justwatch.com/us/search?q='

const movieList = document.querySelector('#movie-list')
const searchForm = document.querySelector('#movie-search-form')
const searchInput = document.querySelector('#movie-search-input')
const searchButton = document.querySelector('#movie-search-btn')
const searchStatus = document.querySelector('#search-status')
const moviesLabel = document.querySelector('#movies-label')
const moviesTitle = document.querySelector('#movies-title')

const heroContainer = document.querySelector('.main-movie')
const heroTitle = document.querySelector('.main-movie .title')
const heroDescription = document.querySelector('.main-movie .description')
const heroContent = document.querySelector('.main-movie .main-movie-content')
const heroPlayButton = document.querySelector('#hero-play-btn')
const heroTrailerButton = document.querySelector('#hero-trailer-btn')
const movieModal = document.querySelector('#movie-modal')
const movieModalBackdrop = document.querySelector('#movie-modal-backdrop')
const movieModalClose = document.querySelector('#movie-modal-close')
const movieModalBody = document.querySelector('#movie-modal-body')
const scrollDownButton = document.querySelector('#scroll-down-btn')
const moviesSection = document.querySelector('.movies-section')

let activeController = null
let heroMovies = []
let heroIndex = 0
let currentHeroMovie = null
let currentModalMovie = null

function setStatus (message, tone = 'neutral') {
  searchStatus.textContent = message
  searchStatus.dataset.tone = tone
}

function setListState (message, type = 'neutral') {
  movieList.innerHTML = ''
  const state = document.createElement('p')
  state.className = `list-state ${type}`
  state.textContent = message
  movieList.appendChild(state)
}

function setSearchLoading (isLoading) {
  searchButton.disabled = isLoading
  searchButton.textContent = isLoading ? 'Searching...' : 'Explore'
}

function truncateText (text, limit = 260) {
  if (!text) return 'No overview available yet.'
  if (text.length <= limit) return text
  return `${text.slice(0, limit).trim()}...`
}

function shuffleArray (items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

function preloadImage (url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = reject
    img.src = url
  })
}

async function preloadHeroMovies (candidates, limit = 10) {
  const selected = candidates.slice(0, limit)
  const tasks = selected.map(async movie => {
    const imageUrl = movie.backdrop_path
      ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
      : movie.poster_path
        ? `${POSTER_BASE_URL}${movie.poster_path}`
        : null

    if (!imageUrl) return null

    try {
      await preloadImage(imageUrl)
      return { ...movie, heroImageUrl: imageUrl }
    } catch {
      return null
    }
  })

  const loaded = await Promise.all(tasks)
  return loaded.filter(Boolean)
}

async function fetchMovies (url) {
  if (activeController) {
    activeController.abort()
  }

  activeController = new AbortController()

  const res = await fetch(url, {
    ...options,
    signal: activeController.signal
  })

  if (!res.ok) {
    throw new Error('Failed to fetch movies')
  }

  return res.json()
}

async function fetchHeroMovies () {
  const randomPage = Math.floor(Math.random() * 20) + 1
  const res = await fetch(`${DISCOVER_BY_PAGE_URL}${randomPage}`, options)

  if (!res.ok) {
    throw new Error('Failed to fetch hero movies')
  }

  const data = await res.json()
  return data.results || []
}

async function fetchMovieVideos (movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
    options
  )

  if (!res.ok) {
    throw new Error('Failed to fetch movie videos')
  }

  const data = await res.json()
  return data.results || []
}

async function fetchMovieDetails (movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
    options
  )

  if (!res.ok) {
    throw new Error('Failed to fetch movie details')
  }

  return res.json()
}

async function getTrailerUrl (movie) {
  try {
    const videos = await fetchMovieVideos(movie.id)
    const ranked = videos
      .filter(video => video.site === 'YouTube')
      .sort((a, b) => {
        const score = (video) => {
          if (video.type === 'Trailer' && video.official) return 3
          if (video.type === 'Trailer') return 2
          if (video.type === 'Teaser') return 1
          return 0
        }
        return score(b) - score(a)
      })

    if (ranked.length && ranked[0].key) {
      return `${YOUTUBE_VIDEO_BASE_URL}${ranked[0].key}`
    }
  } catch (err) {
    console.error(err)
  }

  return `${YOUTUBE_SEARCH_URL}${encodeURIComponent(`${movie.title} official trailer`)}`
}

function renderHeroMovie (movie) {
  if (!movie || !heroContainer || !heroTitle || !heroDescription) return

  currentHeroMovie = movie
  heroTitle.textContent = movie.title || 'Featured Movie'
  heroDescription.textContent = truncateText(movie.overview)

  if (movie.heroImageUrl) {
    heroContainer.style.backgroundImage = `linear-gradient(100deg, rgba(0, 0, 0, 0.8) 15%, rgba(0, 0, 0, 0.35) 65%), url('${movie.heroImageUrl}')`
  } else {
    heroContainer.style.backgroundImage = "url('./assets/test-bg.svg')"
  }

  if (heroContent) {
    heroContainer.classList.remove('hero-swipe')
    heroContent.classList.remove('hero-enter')
    void heroContent.offsetWidth
    heroContainer.classList.add('hero-swipe')
    heroContent.classList.add('hero-enter')
  }
}

function formatRuntime (minutes) {
  if (!minutes) return 'N/A'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m}m`
  return `${h}h ${m}m`
}

function formatCurrency (value) {
  if (!value) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
}

function openExternalLink (url) {
  window.open(url, '_blank', 'noopener')
}

function openMovieModalShell () {
  if (!movieModal) return
  movieModal.classList.add('is-open')
  movieModal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
}

function closeMovieModal () {
  if (!movieModal) return
  movieModal.classList.remove('is-open')
  movieModal.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('modal-open')
}

function renderModalContent (movie) {
  if (!movieModalBody) return

  const genres = movie.genres?.map(item => item.name).join(', ') || 'N/A'
  const production = movie.production_companies?.map(item => item.name).join(', ') || 'N/A'
  const countries = movie.production_countries?.map(item => item.name).join(', ') || 'N/A'
  const spokenLanguages = movie.spoken_languages?.map(item => item.english_name).join(', ') || 'N/A'

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : './assets/test-bg.svg'

  movieModalBody.innerHTML = `
    <div class="modal-top">
      <div class="modal-poster">
        <img src="${posterUrl}" alt="${movie.title}">
      </div>
      <div class="modal-main">
        <p class="modal-kicker">Movie Details</p>
        <h2 id="movie-modal-title">${movie.title}</h2>
        <p class="modal-tagline">${movie.tagline || ''}</p>
        <p class="modal-overview">${movie.overview || 'No overview available yet.'}</p>
        <div class="modal-actions">
          <button class="hero-action hero-action-play" id="modal-play-btn" type="button">Play</button>
          <button class="hero-action hero-action-trailer" id="modal-trailer-btn" type="button">Watch Trailer</button>
        </div>
      </div>
    </div>

    <div class="modal-grid">
      <div><span>Original Title</span><p>${movie.original_title || 'N/A'}</p></div>
      <div><span>Release Date</span><p>${movie.release_date || 'N/A'}</p></div>
      <div><span>Runtime</span><p>${formatRuntime(movie.runtime)}</p></div>
      <div><span>Status</span><p>${movie.status || 'N/A'}</p></div>
      <div><span>Genres</span><p>${genres}</p></div>
      <div><span>Original Language</span><p>${movie.original_language?.toUpperCase() || 'N/A'}</p></div>
      <div><span>Spoken Languages</span><p>${spokenLanguages}</p></div>
      <div><span>Rating</span><p>${movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10` : 'N/A'} (${movie.vote_count || 0} votes)</p></div>
      <div><span>Popularity</span><p>${movie.popularity ? movie.popularity.toFixed(1) : 'N/A'}</p></div>
      <div><span>Budget</span><p>${formatCurrency(movie.budget)}</p></div>
      <div><span>Revenue</span><p>${formatCurrency(movie.revenue)}</p></div>
      <div><span>Production Companies</span><p>${production}</p></div>
      <div><span>Production Countries</span><p>${countries}</p></div>
      <div><span>Adult</span><p>${movie.adult ? 'Yes' : 'No'}</p></div>
    </div>
  `

  const modalPlayButton = document.querySelector('#modal-play-btn')
  const modalTrailerButton = document.querySelector('#modal-trailer-btn')

  modalPlayButton?.addEventListener('click', () => {
    openExternalLink(`${STREAMING_SEARCH_URL}${encodeURIComponent(movie.title)}`)
  })

  modalTrailerButton?.addEventListener('click', async () => {
    const url = await getTrailerUrl(movie)
    openExternalLink(url)
  })
}

async function openMovieModal (movieId) {
  if (!movieModalBody || !movieId) return

  openMovieModalShell()
  movieModalBody.innerHTML = '<p class="modal-loading">Loading movie details...</p>'

  try {
    const details = await fetchMovieDetails(movieId)
    currentModalMovie = details
    renderModalContent(details)
  } catch (err) {
    currentModalMovie = null
    movieModalBody.innerHTML = '<p class="modal-loading modal-error">Could not load movie details. Please try again.</p>'
  }
}

async function loadHeroBatch () {
  try {
    const movies = await fetchHeroMovies()
    const shuffled = shuffleArray(
      movies.filter(movie => movie.backdrop_path || movie.poster_path)
    )
    heroMovies = await preloadHeroMovies(shuffled, 10)
    heroIndex = 0
  } catch (err) {
    console.error(err)
  }
}

async function rotateHeroMovie () {
  if (!heroMovies.length) {
    await loadHeroBatch()
  }

  if (!heroMovies.length) return

  if (heroIndex >= heroMovies.length) {
    await loadHeroBatch()
  }

  const movie = heroMovies[heroIndex]
  heroIndex += 1
  renderHeroMovie(movie)
}

function renderMovies (results) {
  movieList.innerHTML = ''

  if (!results.length) {
    setListState('No movies found. Try a different keyword.', 'neutral')
    return
  }

  const fragment = document.createDocumentFragment()

  results.forEach(movie => {
    const movieCard = document.createElement('article')
    movieCard.classList.add('movie-card')
    movieCard.dataset.movieId = String(movie.id)
    movieCard.setAttribute('role', 'button')
    movieCard.setAttribute('tabindex', '0')

    const posterWrap = document.createElement('div')
    posterWrap.classList.add('movie-poster-wrap')

    const movieImage = document.createElement('img')
    movieImage.src = movie.poster_path
			? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
			: './assets/test-bg.svg'
    movieImage.alt = movie.title

    const movieMeta = document.createElement('div')
    movieMeta.classList.add('movie-meta')

    const rating = document.createElement('span')
    rating.classList.add('movie-rating')
    rating.textContent = movie.vote_average
			? `★ ${Number(movie.vote_average).toFixed(1)}`
			: '★ N/A'

    const releaseDate = document.createElement('span')
    releaseDate.classList.add('movie-year')
    releaseDate.textContent = movie.release_date
			? movie.release_date.slice(0, 4)
			: 'TBA'

    const movieTitle = document.createElement('h3')
    movieTitle.classList.add('movie-title')
    movieTitle.textContent = movie.title

    const movieOverview = document.createElement('p')
    movieOverview.classList.add('movie-overview')
    movieOverview.textContent =
			movie.overview || 'No overview available yet.'

    movieMeta.appendChild(rating)
    movieMeta.appendChild(releaseDate)

    posterWrap.appendChild(movieImage)
    movieCard.appendChild(posterWrap)
    movieCard.appendChild(movieMeta)
    movieCard.appendChild(movieTitle)
    movieCard.appendChild(movieOverview)

    fragment.appendChild(movieCard)
  })

  movieList.appendChild(fragment)
}

async function loadPopularMovies () {
  moviesLabel.textContent = 'Now Streaming'
  moviesTitle.textContent = 'Popular Movies'
  setStatus('Type a movie name and press Explore.', 'neutral')
  setListState('Loading popular movies...', 'neutral')
  setSearchLoading(false)

  try {
    const data = await fetchMovies(DISCOVER_URL)
    renderMovies(data.results || [])
  } catch (err) {
    if (err.name === 'AbortError') return

    setListState(
			'Unable to load movies right now. Please try again.',
			'error'
		)
    setStatus('Could not connect to movie service.', 'error')
  }
}

async function searchMovies (query) {
  moviesLabel.textContent = 'Search Results'
  moviesTitle.textContent = query
  setStatus(`Searching for "${query}"...`, 'neutral')
  setListState(`Searching for "${query}"...`, 'neutral')
  setSearchLoading(true)

  try {
    const data = await fetchMovies(
			`${SEARCH_URL}${encodeURIComponent(query)}`
		)
    const results = data.results || []

    renderMovies(results)

    if (results.length) {
      setStatus(
				`${results.length} movie${results.length > 1
					? 's'
					: ''} found.`,
				'success'
			)
    } else {
      setStatus('No matching movies found.', 'neutral')
    }
  } catch (err) {
    if (err.name === 'AbortError') return

    setListState('Search failed. Please try again.', 'error')
    setStatus('Search failed. Check your API token or network.', 'error')
  } finally {
    setSearchLoading(false)
  }
}

searchForm.addEventListener('submit', event => {
  event.preventDefault()

  const query = searchInput.value.trim()

  if (!query) {
    loadPopularMovies()
    return
  }

  searchMovies(query)
})

searchInput.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    searchInput.value = ''
    loadPopularMovies()
  }
})

movieList.addEventListener('click', event => {
  const card = event.target.closest('.movie-card')
  if (!card) return

  openMovieModal(card.dataset.movieId)
})

movieList.addEventListener('keydown', event => {
  const card = event.target.closest('.movie-card')
  if (!card) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openMovieModal(card.dataset.movieId)
  }
})

movieModalBackdrop?.addEventListener('click', closeMovieModal)
movieModalClose?.addEventListener('click', closeMovieModal)

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && movieModal?.classList.contains('is-open')) {
    closeMovieModal()
  }
})

scrollDownButton?.addEventListener('click', () => {
  moviesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

heroPlayButton?.addEventListener('click', () => {
  if (!currentHeroMovie?.title) return

  const url = `${STREAMING_SEARCH_URL}${encodeURIComponent(currentHeroMovie.title)}`
  window.open(url, '_blank', 'noopener')
})

heroTrailerButton?.addEventListener('click', async () => {
  if (!currentHeroMovie) return

  const trailerWindow = window.open('about:blank', '_blank', 'noopener')
  const trailerUrl = await getTrailerUrl(currentHeroMovie)

  if (trailerWindow) {
    trailerWindow.location.href = trailerUrl
    return
  }

  window.open(trailerUrl, '_blank', 'noopener')
})

rotateHeroMovie()
setInterval(rotateHeroMovie, 5000)
loadPopularMovies()
