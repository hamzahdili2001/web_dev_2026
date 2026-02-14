const btn = document.getElementById('flip-button')
const coin = document.querySelector('.coin')
const resultEl = document.getElementById('result')

const inner = document.querySelector('.coin-inner')

let isFlipping = false
let currentRotation = 0

coin.addEventListener('click', () => btn.click())
coin.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    btn.click()
  }
})

btn.addEventListener('click', () => {
  if (isFlipping) return
  isFlipping = true

  const isHeads = Math.random() < 0.5
  const result = isHeads ? 'Heads' : 'Tails'
  resultEl.textContent = result

	// add multiple spins for realism
  const spins = 4 * 360
  const targetAngle = isHeads ? 0 : 180
  const normalizedCurrent = (currentRotation % 360 + 360) % 360
  const adjustment = (targetAngle - normalizedCurrent + 360) % 360

  currentRotation += spins + adjustment
  inner.style.transform = `rotateY(${currentRotation}deg)`

  const onEnd = () => {
    isFlipping = false
    inner.removeEventListener('transitionend', onEnd)
  }

  inner.addEventListener('transitionend', onEnd)
})
