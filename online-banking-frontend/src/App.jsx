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

  const [transactions, setTransactions] = useState([])
  const [showPassword, setShowPassword] = useState(false)


  // ==========================
  // REGISTER
  // ==========================

  const handleRegister = async () => {
    try {

      if (
        !fullName.trim() ||
        !email.trim() ||
        !password.trim() ||
        !phoneNumber.trim()
      ) {
        alert('Please fill in all fields')
        return
      }

      const response = await fetch(
        'http://localhost:8080/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
            phoneNumber,
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

      if (!email.trim() || !password.trim()) {
        alert('Please enter email and password')
        return
      }

      const response = await fetch(
        'http://localhost:8080/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
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

      setIsLoggedIn(true)
      setShowLogin(false)

      alert('Login successful!')

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

      if (!depositAmount || amount <= 0) {
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
            amount,
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

      if (!withdrawAmount || amount <= 0) {
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
            amount,
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

      if (!transferAmount || amount <= 0) {
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
            amount,
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
  // LOGOUT
  // ==========================

  const handleLogout = () => {

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
  }


  // ==========================
  // DASHBOARD
  // ==========================

  if (isLoggedIn) {
    return (
      <div className="dashboard">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <h1>Online Banking</h1>
            <p className="dashboard-subtitle">
              Manage your account securely
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>


        {/* BALANCE CARD */}

        <section className="balance-card">

          <p className="balance-label">
            Available Balance
          </p>

          <h2 className="balance-amount">
            ${Number(balance).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

          <button
            className="balance-button"
            onClick={handleCheckBalance}
          >
            Refresh Balance
          </button>

        </section>


        {/* BANKING ACTIONS */}

        <section className="actions-section">

          <h2>Banking Services</h2>

          <div className="action-grid">


            {/* DEPOSIT CARD */}

            <div className="action-card">

              <div className="action-icon">
                ↓
              </div>

              <h3>Deposit</h3>

              <p>
                Add money to your account.
              </p>

              <input
                type="number"
                min="0"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) =>
                  setDepositAmount(e.target.value)
                }
              />

              <button onClick={handleDeposit}>
                Deposit Money
              </button>

            </div>


            {/* WITHDRAW CARD */}

            <div className="action-card">

              <div className="action-icon">
                ↑
              </div>

              <h3>Withdraw</h3>

              <p>
                Withdraw money from your balance.
              </p>

              <input
                type="number"
                min="0"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) =>
                  setWithdrawAmount(e.target.value)
                }
              />

              <button onClick={handleWithdraw}>
                Withdraw Money
              </button>

            </div>


            {/* TRANSFER CARD */}

            <div className="action-card">

              <div className="action-icon">
                ⇄
              </div>

              <h3>Transfer</h3>

              <p>
                Send money to another account.
              </p>

              <input
                type="text"
                placeholder="Receiver account number"
                value={receiverAccountNumber}
                onChange={(e) =>
                  setReceiverAccountNumber(e.target.value)
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Transfer amount"
                value={transferAmount}
                onChange={(e) =>
                  setTransferAmount(e.target.value)
                }
              />

              <button onClick={handleTransfer}>
                Transfer Money
              </button>

            </div>

          </div>

        </section>


        {/* TRANSACTION HISTORY */}

        <section className="transaction-section">

          <div className="transaction-header">

            <div>
              <h2>Transaction History</h2>

              <p>
                View your recent account activity.
              </p>
            </div>

            <button onClick={handleTransactionHistory}>
              Load Transactions
            </button>

          </div>


          {transactions.length === 0 ? (

            <div className="empty-transactions">

              <p>
                No transactions loaded yet.
              </p>

              <p>
                Click "Load Transactions" to view your
                transaction history.
              </p>

            </div>

          ) : (

            <div className="table-container">

              <table>

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
                        <span
                          className={`transaction-type ${String(
                            transaction.transactionType
                          ).toLowerCase()}`}
                        >
                          {transaction.transactionType}
                        </span>
                      </td>

                      <td className="transaction-amount">
                        ${Number(
                          transaction.amount
                        ).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td>
                        {transaction.senderAccountNumber || '-'}
                      </td>

                      <td>
                        {transaction.receiverAccountNumber || '-'}
                      </td>

                      <td>
                        {transaction.timestamp
                          ? new Date(
                              transaction.timestamp
                            ).toLocaleString()
                          : '-'}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>
    )
  }


  // ==========================
  // REGISTER SCREEN
  // ==========================

  if (showRegister) {
    return (
      <div className="auth-page">

        <div className="auth-card">

          <div className="bank-logo">
            $
          </div>

          <h1>Create Account</h1>

          <p className="auth-subtitle">
            Register for secure online banking
          </p>


          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>Phone Number</label>

            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value)
              }
            />

          </div>


          <button
            className="primary-button"
            onClick={handleRegister}
          >
            Create Account
          </button>


          <p className="switch-page">

            Already have an account?

            <button
              className="link-button"
              onClick={() => {
                setShowRegister(false)
                setShowLogin(true)
              }}
            >
              Login
            </button>

          </p>

        </div>

      </div>
    )
  }


  // ==========================
  // LOGIN SCREEN
  // ==========================

  if (showLogin) {
    return (
      <div className="auth-page">

        <div className="auth-card">

          <div className="bank-logo">
            $
          </div>

          <h1>Welcome Back</h1>

          <p className="auth-subtitle">
            Login to access your banking dashboard
          </p>


          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>Password</label>

            <div className="password-wrapper">

  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? '🙈' : '👁️'}
  </button>

</div>

          </div>


          <button
            className="primary-button"
            onClick={handleLogin}
          >
            Login
          </button>


          <p className="switch-page">

            Don't have an account?

            <button
              className="link-button"
              onClick={() => {
                setShowLogin(false)
                setShowRegister(true)
              }}
            >
              Register
            </button>

          </p>

        </div>

      </div>
    )
  }


  // ==========================
  // HOME SCREEN
  // ==========================

  return (
    <div className="home-page">

      <div className="home-content">

        <div className="bank-logo home-logo">
          $
        </div>

        <h1>
          Online Banking System
        </h1>

        <p className="home-description">
          Secure, simple and convenient banking.
          Manage your money anytime from one place.
        </p>


        <div className="home-buttons">

          <button
            className="primary-button"
            onClick={() => {
              setShowLogin(true)
              setShowRegister(false)
            }}
          >
            Login
          </button>

          <button
            className="secondary-button"
            onClick={() => {
              setShowRegister(true)
              setShowLogin(false)
            }}
          >
            Create Account
          </button>

        </div>

      </div>

    </div>
  )
}

export default App