const play = document.getElementById('play')
const playImg = play.querySelector('img')
const videoEl = document.getElementById('video')
const title = document.getElementById('title')
const next = document.getElementById('forward')
const back = document.getElementById('back')

const videosList = [
  {
    id: 1,
    title: 'How to reach peak performance in anything you do',
    source:
			'./resources/how to reach peak performance in anything you do. [18Nh2H0RwLM].mp4'
  },
  {
    id: 2,
    title: 'The cost of greatness',
    source: './resources/The cost of greatness [61rmMkEdySM].mp4'
  }
]

let index = 0

videoEl.src = videosList[index].source
title.textContent = videosList[index].title

play.addEventListener('click', () => playVideo(videoEl))
next.addEventListener('click', goNext)
back.addEventListener('click', goBack)

function playVideo (video) {
  if (video.paused) {
    video
			.play()
			.then(() => {
  playImg.src = './resources/pause.png'
})
			.catch(error => {
  console.log(error)
})
  } else {
    video.pause()
    playImg.src = './resources/play.png'
  }
}

function goNext () {
  index++
  if (index >= videosList.length) {
    index = 0
  }

  videoEl.src = videosList[index].source
  title.textContent = videosList[index].title

  videoEl.play()
  playImg.src = './resources/pause.png'
}

function goBack () {
  index--
  if (index < 0) {
    index = videosList.length - 1
  }

  videoEl.src = videosList[index].source
  title.textContent = videosList[index].title

  videoEl.play()
  playImg.src = './resources/pause.png'
}
