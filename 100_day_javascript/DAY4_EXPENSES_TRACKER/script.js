// ==============================
// 1️⃣ DOM ELEMENTS
// ==============================
// Here we select all the HTML elements we need to interact with.
// This allows JavaScript to read and update the UI dynamically.

// Displays the total balance
const balanceEl = document.getElementById('balance')

// Displays total income amount
const incomeAmountEl = document.getElementById('income-amount')

// Displays total expense amount
const expenseAmountEl = document.getElementById('expense-amount')

// <ul> element where transactions will be listed
const transactionListEl = document.getElementById('transaction-list')

// The form used to add a new transaction
const transactionFormEl = document.getElementById('transaction-form')

// Input field for transaction description
const descriptionEl = document.getElementById('description')

// Input field for transaction amount
const amountEl = document.getElementById('amount')

// ==============================
// 2️⃣ APPLICATION STATE
// ==============================
// Transactions are stored in localStorage so data is not lost
// when the page refreshes.
//
// If localStorage is empty, we start with an empty array.

let transactions = JSON.parse(localStorage.getItem('transactions')) || []

// ==============================
// 3️⃣ EVENT LISTENERS
// ==============================

// Listen for form submission
transactionFormEl.addEventListener('submit', addTransaction)

// ==============================
// 4️⃣ ADD TRANSACTION FUNCTION
// ==============================
// This function runs when the form is submitted.

function addTransaction (e) {
	// Prevent page refresh (default form behavior)
  e.preventDefault()

	// Get and clean user input
  const description = descriptionEl.value.trim()
  const amount = parseFloat(amountEl.value.trim())

	// Create a transaction object
  const data = {
    id: Date.now(), // unique ID
    description, // text description
    amount // positive = income, negative = expense
  }

	// Add the transaction to the state array
  transactions.push(data)

	// Save updated data to localStorage
  localStorage.setItem('transactions', JSON.stringify(transactions))

	// Update UI
  updateTransactionsList()
  updateSummary()

	// Clear the form inputs
  transactionFormEl.reset()
}

// ==============================
// 5️⃣ UPDATE TRANSACTION LIST
// ==============================
// This function renders all transactions in the UI.

function updateTransactionsList () {
	// Show a message if there are no transactions
  if (transactions.length === 0) {
    transactionListEl.innerHTML =
			'<li class="empty-message">No transactions yet.</li>'
    return
  }

	// Clear existing list
  transactionListEl.innerHTML = ''

	// Clone and reverse the array so newest transactions appear first
  const sortedTransactions = [...transactions].reverse()

	// Create and append each transaction item
  sortedTransactions.forEach(transaction => {
    const transactionElement = createTransactionElement(transaction)
    transactionListEl.appendChild(transactionElement)
  })
}

// ==============================
// 6️⃣ CREATE TRANSACTION ELEMENT
// ==============================
// This function creates a single <li> element for a transaction.

function createTransactionElement (transaction) {
  const li = document.createElement('li')

	// Add base class
  li.classList.add('transaction')

	// Add income or expense class based on amount
  li.classList.add(transaction.amount < 0 ? 'expense' : 'income')

	// Insert transaction content
  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>
      ${formatCurrency(transaction.amount)}
      <button 
        class="delete-btn" 
        onClick="removeTransaction(${transaction.id})">
        x
      </button>
    </span>
  `

  return li
}

// ==============================
// 7️⃣ UPDATE SUMMARY
// ==============================
// Calculates balance, income, and expenses and updates the UI.

function updateSummary () {
	// Calculate total balance
  const balance = transactions.reduce(
		(acc, transaction) => acc + transaction.amount,
		0
	)

	// Calculate total income
  const income = transactions
		.filter(transaction => transaction.amount > 0)
		.reduce((acc, transaction) => acc + transaction.amount, 0)

	// Calculate total expense
  const expense = transactions
		.filter(transaction => transaction.amount < 0)
		.reduce((acc, transaction) => acc + transaction.amount, 0)

	// Update UI elements
  balanceEl.textContent = formatCurrency(balance)
  incomeAmountEl.textContent = formatCurrency(income)
  expenseAmountEl.textContent = formatCurrency(Math.abs(expense))
}

// ==============================
// 8️⃣ FORMAT CURRENCY
// ==============================
// Converts a number into a formatted currency string.

function formatCurrency (amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}

// ==============================
// 9️⃣ REMOVE TRANSACTION
// ==============================
// Deletes a transaction using its ID.

function removeTransaction (id) {
	// Remove the transaction from the array
  transactions = transactions.filter(transaction => transaction.id !== id)

	// Save updated list to localStorage
  localStorage.setItem('transactions', JSON.stringify(transactions))

	// Update UI
  updateTransactionsList()
  updateSummary()
} // ============================== // Render data when the page first loads.

// ==============================
// 🔟 INITIAL RENDER
updateTransactionsList()
updateSummary()
