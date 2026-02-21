const steps = document.querySelectorAll('.step')
const continueButtons = document.querySelectorAll('.continue-btn')
const prevButtons = document.querySelectorAll('.prev-btn')
const dotGroups = document.querySelectorAll('.step-dots')
const topicButtons = document.querySelectorAll('.topic-btn')

const nameInput = document.querySelector('#name')
const emailInput = document.querySelector('#email')
const nameError = document.querySelector('#name-error')
const emailError = document.querySelector('#email-error')
const topicError = document.querySelector('#topic-error')

const summaryName = document.querySelector('#summary-name')
const summaryEmail = document.querySelector('#summary-email')
const summaryTopics = document.querySelector('#summary-topics')
const successModal = document.querySelector('#success-modal')
const successCloseButton = document.querySelector('#success-close')

let currentStep = 0
const stepsCount = steps.length

function setError (element, errorElement, message) {
  element.classList.toggle('invalid', Boolean(message))
  errorElement.textContent = message
}

function getSelectedTopics () {
  return [...topicButtons]
		.filter(button => button.classList.contains('active'))
		.map(button => button.dataset.topic)
}

function validateStep (stepIndex) {
  if (stepIndex === 0) {
    const name = nameInput.value.trim()
    const email = emailInput.value.trim()
    let isValid = true

    if (!name) {
      setError(nameInput, nameError, 'Name is required.')
      isValid = false
    } else {
      setError(nameInput, nameError, '')
    }

    if (!email) {
      setError(emailInput, emailError, 'Email is required.')
      isValid = false
    } else if (!emailInput.checkValidity()) {
      setError(
				emailInput,
				emailError,
				'Please enter a valid email address.'
			)
      isValid = false
    } else {
      setError(emailInput, emailError, '')
    }

    return isValid
  }

  if (stepIndex === 1) {
    const selectedTopics = getSelectedTopics()
    const hasTopic = selectedTopics.length > 0

    topicButtons.forEach(button => {
      button.classList.toggle('invalid', !hasTopic)
    })
    topicError.textContent = hasTopic
			? ''
			: 'Please select at least one topic.'

    return hasTopic
  }

  return true
}

function updateSummary () {
  const selectedTopics = getSelectedTopics()

  summaryName.textContent = nameInput.value.trim()
  summaryEmail.textContent = emailInput.value.trim()
  summaryTopics.innerHTML = ''

  selectedTopics.forEach(topic => {
    const li = document.createElement('li')
    const strong = document.createElement('strong')
    strong.textContent = topic
    li.appendChild(strong)
    summaryTopics.appendChild(li)
  })
}

function setActiveStep (stepIndex) {
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === stepIndex)
  })

  dotGroups.forEach(group => {
    const dots = group.querySelectorAll('.dot')
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === stepIndex)
    })
  })

  currentStep = stepIndex
}

function openSuccessPopup () {
  successModal.classList.add('show')
  successModal.setAttribute('aria-hidden', 'false')
}

function closeSuccessPopup () {
  successModal.classList.remove('show')
  successModal.setAttribute('aria-hidden', 'true')
}

function goToNextStep () {
  if (!validateStep(currentStep)) {
    return
  }

  if (currentStep === 1) {
    updateSummary()
  }

  if (currentStep < stepsCount - 1) {
    setActiveStep(currentStep + 1)
    return
  }

  openSuccessPopup()
}

function goToPrevStep () {
  if (currentStep > 0) {
    setActiveStep(currentStep - 1)
  }
}

continueButtons.forEach(button => {
  button.addEventListener('click', goToNextStep)
})

prevButtons.forEach(button => {
  button.addEventListener('click', goToPrevStep)
})

topicButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active')
    button.setAttribute(
			'aria-pressed',
			String(button.classList.contains('active'))
		)

    topicError.textContent = ''
    topicButtons.forEach(topicButton =>
			topicButton.classList.remove('invalid')
		)
  })
})

dotGroups.forEach(group => {
  const dots = group.querySelectorAll('.dot')
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (index <= currentStep) {
        setActiveStep(index)
        return
      }

      let canMove = true
      for (
				let stepIndex = currentStep;
				stepIndex < index;
				stepIndex += 1
			) {
        if (!validateStep(stepIndex)) {
          canMove = false
          break
        }
      }

      if (canMove) {
        if (index === 2) {
          updateSummary()
        }
        setActiveStep(index)
      }
    })
  })
})

successCloseButton.addEventListener('click', closeSuccessPopup)

successModal.addEventListener('click', event => {
  if (event.target === successModal) {
    closeSuccessPopup()
  }
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && successModal.classList.contains('show')) {
    closeSuccessPopup()
  }
})

setActiveStep(currentStep)
