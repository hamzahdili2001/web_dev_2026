const generateBtn = document.getElementById('generate-btn')
const paletteContainer = document.querySelector('.palette-container')

generateBtn.addEventListener('click', generatePalette)

paletteContainer.addEventListener('click', e => {
  if (e.target.classList.contains('copy-btn')) {
    const hexValue = e.target.previousElementSibling.textContent
    navigator.clipboard
			.writeText(hexValue)
			.then(() => showCopySuccess(e.target))
			.catch(err => console.log(err))
  } else if (e.target.classList.contains('color')) {
    const hexValue = e.target.nextElementSibling.querySelector('.hex-value')
			.textContent

    navigator.clipboard
			.writeText(hexValue)
			.then(() =>
				showCopySuccess(
					e.target.nextElementSibling.querySelector('.copy-btn')
				)
			)
			.catch(err => console.log(err))
  }
})

function showCopySuccess (target) {
  target.classList.remove('far', 'fa-copy')
  target.classList.add('fas', 'fa-check')
  target.style.color = '#48bb78'

  setTimeout(() => {
    target.classList.remove('fas', 'fa-check')
    target.classList.add('far', 'fa-copy')
    target.style.color = ''
  }, 1000)
}
function generatePalette () {
  const colors = []
  const step = 360 / 5
  const startHue = Math.floor(Math.random() * 360)

  for (let i = 0; i < 5; i++) {
    const hue = (startHue + i * step) % 360
    colors.push(`hsl(${hue}, 70%, 55%)`)
  }

  updatePaletteDisplay(colors)
}

function updatePaletteDisplay (colors) {
  const colorBoxes = document.querySelectorAll('.color-box')

  colorBoxes.forEach((box, index) => {
    const color = colors[index]
    const colorDiv = box.querySelector('.color')
    const hexValue = box.querySelector('.hex-value')

    colorDiv.style.backgroundColor = color
    hexValue.textContent = colorToHex(color)
  })
}

function colorToHex (color) {
  const temp = document.createElement('div')
  temp.style.color = color
  document.body.appendChild(temp)

  const computedColor = getComputedStyle(temp).color
  document.body.removeChild(temp)

  const rgb = computedColor.match(/\d+/g).map(Number)

  return (
		'#' +
		rgb
			.map(value => value.toString(16).padStart(2, '0'))
			.join('')
			.toUpperCase()
  )
}

generatePalette()
