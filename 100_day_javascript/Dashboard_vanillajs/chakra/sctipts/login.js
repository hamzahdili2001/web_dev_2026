const navbarEl = document.querySelector('.nav-links-container')
const navIcon = document.querySelector('.nav-burger')

function showNav (navBtn) {
  if (!navBtn || !navbarEl || !navIcon) return

  navBtn.addEventListener('click', () => {
    if (navbarEl.classList.contains('show-navbar')) {
      navbarEl.classList.remove('show-navbar')
      navIcon.firstElementChild.classList.remove('fa-xmark')
      navIcon.firstElementChild.classList.add('fa-bars')
    } else {
      navbarEl.classList.add('show-navbar')
      navIcon.firstElementChild.classList.remove('fa-bars')
      navIcon.firstElementChild.classList.add('fa-xmark')
    }
  })
}

function formValidation (email, password, rememberMe) {
  const errors = {}
  const cleanedEmail = email.trim()
  const cleanedPassword = password.trim()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!cleanedEmail) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(cleanedEmail)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!cleanedPassword) {
    errors.password = 'Password is required.'
  } else if (cleanedPassword.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: {
      email: cleanedEmail,
      password: cleanedPassword,
      rememberMe: Boolean(rememberMe)
    }
  }
}

function renderFieldError (inputEl, message) {
  const inputGroup = inputEl.closest('.input-group')
  if (!inputGroup) return

  let errorEl = inputGroup.querySelector('.field-error')
  if (!errorEl) {
    errorEl = document.createElement('small')
    errorEl.className = 'field-error'
    inputGroup.appendChild(errorEl)
  }

  if (message) {
    inputEl.classList.add('is-invalid')
    errorEl.textContent = message
  } else {
    inputEl.classList.remove('is-invalid')
    errorEl.textContent = ''
  }
}

function handleFormValidation () {
  const formEl = document.querySelector('.form-container form')
  const emailEl = document.querySelector('#email')
  const passwordEl = document.querySelector('#password')
  const rememberEl = document.querySelector('#remember')
  const messageEl = document.getElementById('message')
  let messageTimer

  if (!formEl || !emailEl || !passwordEl || !rememberEl) return

  const rememberedEmail = localStorage.getItem('rememberedEmail')
  if (rememberedEmail) {
    emailEl.value = rememberedEmail
    rememberEl.checked = true
  }

  emailEl.addEventListener('input', () => renderFieldError(emailEl, ''))
  passwordEl.addEventListener('input', () =>
		renderFieldError(passwordEl, '')
	)

  formEl.addEventListener('submit', event => {
    event.preventDefault()

    const result = formValidation(
			emailEl.value,
			passwordEl.value,
			rememberEl.checked
		)

    renderFieldError(emailEl, result.errors.email)
    renderFieldError(passwordEl, result.errors.password)

    if (!result.isValid) return

    if (result.values.rememberMe) {
      localStorage.setItem('rememberedEmail', result.values.email)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    formEl.reset()
    if (messageEl) {
      messageEl.classList.add('valid')
      messageEl.textContent = 'Login Successfully!'

      clearTimeout(messageTimer)
      messageTimer = setTimeout(() => {
        messageEl.textContent = ''
        messageEl.classList.remove('valid')
      }, 1000)
    }
  })
}

export { formValidation, handleFormValidation }
export default showNav
