const playBtn = document.getElementById('play')
const nextBtn = document.getElementById('next')
const prevBtn = document.getElementById('prev')
const audio = document.getElementById('audio')
const title = document.getElementById('title')
const cover = document.getElementById('cover')
const author = document.getElementById('author')

const songs = [
  {
    title: 'Lost in the City Lights',
    author: 'Cosmo Sheldrake',
    cover: 'resources/cover-1.jpg',
    audio: 'resources/lost-in-city-lights-145038.mp3'
  },
  {
    title: 'Forest Lullaby',
    author: 'Lesfm',
    cover: 'resources/cover-2.jpg',
    audio: 'resources/forest-lullaby-110624.mp3'
  }
]

let isPlaying = false
let currentSongIndex = 0

function loadSong (song) {
  title.textContent = song.title
  author.textContent = song.author
  cover.src = song.cover
  audio.src = song.audio
}

function playSong () {
  audio.play()
  isPlaying = true
  playBtn.innerHTML = '| |'
  playBtn.style.fontWeight = '700'
}

function pauseSong () {
  audio.pause()
  isPlaying = false
  playBtn.innerHTML = '<img src="/resources/Play_fill.svg" alt="">'
}

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong()
  } else {
    playSong()
  }
})

nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length
  loadSong(songs[currentSongIndex])
  playSong()
})

prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length
  loadSong(songs[currentSongIndex])
  playSong()
})

function getProgressBarWidth () {
  const progressBar = document.querySelector('.progress-bar')
  const progress = audio.currentTime / audio.duration * 100
  progressBar.style.width = `${progress}%`

	// update current time and duration
  const currentTime = document.getElementById('current-time')
  const duration = document.getElementById('duration')
  currentTime.textContent = formatTime(audio.currentTime)
  duration.textContent = formatTime(audio.duration)

  if (audio.currentTime === audio.duration) {
    nextBtn.click()
  }
}

function formatTime (time) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

audio.addEventListener('timeupdate', getProgressBarWidth)

loadSong(songs[currentSongIndex])
