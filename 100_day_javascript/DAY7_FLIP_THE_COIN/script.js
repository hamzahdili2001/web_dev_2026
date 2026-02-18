// UI elements used by the coin flip interaction.
const btn = document.getElementById('flip-button')
const coin = document.querySelector('.coin')
const resultEl = document.getElementById('result')
const inner = document.querySelector('.coin-inner')

// Guards against starting a second flip while animation is running.
let isFlipping = false
// Stores the total Y rotation (in degrees) applied over time.
let currentRotation = 0

// Mouse/touch: clicking the coin triggers the same action as the button.
coin.addEventListener('click', () => btn.click())

// Keyboard accessibility: Enter/Space on the coin triggers a flip.
coin.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    btn.click()
  }
})

btn.addEventListener('click', () => {
	// Ignore new clicks until the current flip animation finishes.
  if (isFlipping) return
  isFlipping = true

	// Randomly choose the outcome for this flip.
  const isHeads = Math.random() < 0.5
  const result = isHeads ? 'Heads' : 'Tails'

	// Add multiple full spins so the animation looks realistic.
  const spins = 4 * 360
	// Desired final face: heads at 0deg, tails at 180deg.
  const targetAngle = isHeads ? 0 : 180
	// Keep angle in [0, 359] to safely compare/compute direction.
  const normalizedCurrent = (currentRotation % 360 + 360) % 360
	// Smallest forward rotation needed to land on the target face.
  const adjustment = (targetAngle - normalizedCurrent + 360) % 360

	// Total new rotation = full spins + exact landing adjustment.
  currentRotation += spins + adjustment
  inner.style.transform = `rotateY(${currentRotation}deg)`

  const onEnd = () => {
		// Update text after animation completes.
    resultEl.textContent = result
		// Unlock flipping and clean up this one-time event listener.
    isFlipping = false
    inner.removeEventListener('transitionend', onEnd)
  }

  inner.addEventListener('transitionend', onEnd)
})
