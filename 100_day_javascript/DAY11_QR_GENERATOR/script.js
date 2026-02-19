const form = document.getElementById('qr-form')
const textInput = document.getElementById('qr-text')
const sizeInput = document.getElementById('qr-size')
const message = document.getElementById('message')
const qrImage = document.getElementById('qr-image')
const downloadBtn = document.getElementById('download-btn')

let currentQrUrl = ''

function setMessage (text = '') {
  message.textContent = text
}

function clearQr () {
  qrImage.src = ''
  qrImage.classList.remove('ready')
  downloadBtn.disabled = true
  currentQrUrl = ''
}

function buildQrUrl (text, size) {
  const encodedText = encodeURIComponent(text)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`
}

function downloadQrImage () {
  if (!currentQrUrl) return

  const link = document.createElement('a')
  link.href = currentQrUrl
  link.download = 'qr-code.png'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

form.addEventListener('submit', event => {
  event.preventDefault()

  const text = textInput.value.trim()
  const size = sizeInput.value

  if (!text) {
    clearQr()
    setMessage('Please enter text or a URL first.')
    return
  }

  setMessage('')
  const qrUrl = buildQrUrl(text, size)

  qrImage.onload = () => {
    qrImage.classList.add('ready')
    downloadBtn.disabled = false
    currentQrUrl = qrUrl
  }

  qrImage.onerror = () => {
    clearQr()
    setMessage('Could not generate QR code. Please try again.')
  }

  qrImage.src = qrUrl
})

downloadBtn.addEventListener('click', downloadQrImage)
