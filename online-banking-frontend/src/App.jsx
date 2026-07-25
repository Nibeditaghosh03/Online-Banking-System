import { useState } from 'react'
import './App.css'

function App() {

  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [balance, setBalance] = useState(0)

  // Amount states
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')


  // ==========================
  // LOGIN FUNCTION
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
  // DASHBOARD SCREEN
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

        <button>
          Transfer Money
        </button>

        <br />
        <br />


        {/* LOGOUT */}

        <button
          onClick={() => {

            localStorage.removeItem('token')
            localStorage.removeItem('email')

            setIsLoggedIn(false)
            setShowLogin(false)

            setEmail('')
            setPassword('')
            setBalance(0)
          }}
        >
          Logout
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

      <button onClick={() => setShowLogin(true)}>
        Login
      </button>

      <button>
        Register
      </button>

    </div>
  )
}

export default App