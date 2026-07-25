import { useState } from 'react'
import './App.css'

function App() {

  // ==========================
  // STATES
  // ==========================

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [balance, setBalance] = useState(0)

  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')

  const [receiverAccountNumber, setReceiverAccountNumber] = useState('')
  const [transferAmount, setTransferAmount] = useState('')

  // Transaction History
  const [transactions, setTransactions] = useState([])


  // ==========================
  // REGISTER
  // ==========================

  const handleRegister = async () => {
    try {

      const response = await fetch(
        'http://localhost:8080/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            fullName: fullName,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const data = await response.json()

      console.log('Register response:', data)

      alert(
        'Registration successful! Your account number is: ' +
        data.accountNumber
      )

      setShowRegister(false)
      setShowLogin(true)

      setFullName('')
      setPassword('')
      setPhoneNumber('')

    } catch (error) {

      console.error(error)
      alert('Could not register user')
    }
  }


  // ==========================
  // LOGIN
  // ==========================

  const handleLogin = async () => {
    try {

      const response = await fetch(
        'http://localhost:8080/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const token = await response.text()

      localStorage.setItem('token', token)
      localStorage.setItem('email', email)

      console.log('JWT Token:', token)

      alert('Login successful!')

      setIsLoggedIn(true)

    } catch (error) {

      console.error(error)
      alert('Invalid email or password')
    }
  }


  // ==========================
  // CHECK BALANCE
  // ==========================

  const handleCheckBalance = async () => {
    try {

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:8080/api/account/balance',
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get balance')
      }

      const data = await response.json()

      console.log('Balance response:', data)

      setBalance(data.balance)

    } catch (error) {

      console.error(error)
      alert('Could not fetch balance')
    }
  }


  // ==========================
  // DEPOSIT
  // ==========================

  const handleDeposit = async () => {
    try {

      const token = localStorage.getItem('token')
      const amount = Number(depositAmount)

      if (amount <= 0) {
        alert('Please enter a valid deposit amount')
        return
      }

      const response = await fetch(
        'http://localhost:8080/api/account/deposit',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            amount: amount,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Deposit failed')
      }

      const data = await response.json()

      console.log('Deposit response:', data)

      setBalance(data.balance)
      setDepositAmount('')

      alert('Deposit successful!')

    } catch (error) {

      console.error(error)
      alert('Could not deposit money')
    }
  }


  // ==========================
  // WITHDRAW
  // ==========================

  const handleWithdraw = async () => {
    try {

      const token = localStorage.getItem('token')
      const amount = Number(withdrawAmount)

      if (amount <= 0) {
        alert('Please enter a valid withdraw amount')
        return
      }

      const response = await fetch(
        'http://localhost:8080/api/account/withdraw',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            amount: amount,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Withdraw failed')
      }

      const data = await response.json()

      console.log('Withdraw response:', data)

      setBalance(data.balance)
      setWithdrawAmount('')

      alert('Withdrawal successful!')

    } catch (error) {

      console.error(error)
      alert('Could not withdraw money')
    }
  }


  // ==========================
  // TRANSFER MONEY
  // ==========================

  const handleTransfer = async () => {
    try {

      const token = localStorage.getItem('token')
      const amount = Number(transferAmount)

      if (!receiverAccountNumber.trim()) {
        alert('Please enter receiver account number')
        return
      }

      if (amount <= 0) {
        alert('Please enter a valid transfer amount')
        return
      }

      const response = await fetch(
        'http://localhost:8080/api/account/transfer',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            receiverAccountNumber: receiverAccountNumber.trim(),
            amount: amount,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Transfer failed')
      }

      const data = await response.json()

      console.log('Transfer response:', data)

      setBalance(data.balance)

      setReceiverAccountNumber('')
      setTransferAmount('')

      alert('Transfer successful!')

    } catch (error) {

      console.error(error)
      alert('Could not transfer money')
    }
  }


  // ==========================
  // TRANSACTION HISTORY
  // ==========================

  const handleTransactionHistory = async () => {
    try {

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:8080/api/account/transactions',
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      const data = await response.json()

      console.log('Transaction history:', data)

      setTransactions(data)

    } catch (error) {

      console.error(error)

      alert('Could not fetch transaction history')
    }
  }


  // ==========================
  // DASHBOARD
  // ==========================

  if (isLoggedIn) {
    return (
      <div>

        <h1>Banking Dashboard</h1>

        <h2>Welcome!</h2>

        <p>
          Account Balance: ${balance.toFixed(2)}
        </p>


        {/* CHECK BALANCE */}

        <button onClick={handleCheckBalance}>
          Check Balance
        </button>

        <br />
        <br />


        {/* DEPOSIT */}

        <input
          type="number"
          placeholder="Enter deposit amount"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />

        <button onClick={handleDeposit}>
          Deposit
        </button>

        <br />
        <br />


        {/* WITHDRAW */}

        <input
          type="number"
          placeholder="Enter withdraw amount"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />

        <button onClick={handleWithdraw}>
          Withdraw
        </button>

        <br />
        <br />


        {/* TRANSFER */}

        <input
          type="text"
          placeholder="Receiver account number"
          value={receiverAccountNumber}
          onChange={(e) =>
            setReceiverAccountNumber(e.target.value)
          }
        />

        <br />

        <input
          type="number"
          placeholder="Enter transfer amount"
          value={transferAmount}
          onChange={(e) =>
            setTransferAmount(e.target.value)
          }
        />

        <button onClick={handleTransfer}>
          Transfer Money
        </button>

        <br />
        <br />


        {/* TRANSACTION HISTORY */}

        <button onClick={handleTransactionHistory}>
          Transaction History
        </button>

        <br />
        <br />


        {/* DISPLAY TRANSACTIONS */}

        {transactions.length > 0 && (
          <div>

            <h2>Transaction History</h2>

            <table border="1">

              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {transactions.map((transaction) => (

                  <tr key={transaction.id}>

                    <td>
                      {transaction.transactionType}
                    </td>

                    <td>
                      ${Number(transaction.amount).toFixed(2)}
                    </td>

                    <td>
                      {transaction.senderAccountNumber || '-'}
                    </td>

                    <td>
                      {transaction.receiverAccountNumber || '-'}
                    </td>

                    <td>
                      {transaction.timestamp
                        ? new Date(transaction.timestamp).toLocaleString()
                        : '-'}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}


        <br />
        <br />


        {/* LOGOUT */}

        <button
          onClick={() => {

            localStorage.removeItem('token')
            localStorage.removeItem('email')

            setIsLoggedIn(false)

            setShowLogin(false)
            setShowRegister(false)

            setFullName('')
            setEmail('')
            setPassword('')
            setPhoneNumber('')

            setBalance(0)

            setDepositAmount('')
            setWithdrawAmount('')

            setReceiverAccountNumber('')
            setTransferAmount('')

            setTransactions([])
          }}
        >
          Logout
        </button>

      </div>
    )
  }


  // ==========================
  // REGISTER SCREEN
  // ==========================

  if (showRegister) {
    return (
      <div>

        <h1>Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <br />

        <button onClick={handleRegister}>
          Register
        </button>

        <button
          onClick={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
        >
          Already have an account? Login
        </button>

      </div>
    )
  }


  // ==========================
  // LOGIN SCREEN
  // ==========================

  if (showLogin) {
    return (
      <div>

        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <button onClick={handleLogin}>
          Login
        </button>

        <button
          onClick={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
        >
          Create Account
        </button>

      </div>
    )
  }


  // ==========================
  // HOME SCREEN
  // ==========================

  return (
    <div>

      <h1>Online Banking System</h1>

      <p>Secure Banking Made Simple</p>

      <button
        onClick={() => {
          setShowLogin(true)
          setShowRegister(false)
        }}
      >
        Login
      </button>

      <button
        onClick={() => {
          setShowRegister(true)
          setShowLogin(false)
        }}
      >
        Register
      </button>

    </div>
  )
}

export default App