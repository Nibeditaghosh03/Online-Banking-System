import { useState } from 'react'
import './App.css'

function App() {

  // ==========================
  // STATES
  // ==========================

  const [screen, setScreen] = useState('home')

  // Login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Register
  const [fullName, setFullName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Account
  const [balance, setBalance] = useState(0)
  const [accountNumber, setAccountNumber] = useState('')

  // Banking
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('')
  const [transferAmount, setTransferAmount] = useState('')

  // Transactions
  const [transactions, setTransactions] = useState([])


  // ==========================
  // REGISTER
  // ==========================

  const handleRegister = async () => {

    try {

      if (
        !fullName.trim() ||
        !registerEmail.trim() ||
        !registerPassword ||
        !phoneNumber.trim()
      ) {
        alert('Please fill in all fields')
        return
      }

      if (registerPassword.length < 6) {
        alert('Password must contain at least 6 characters')
        return
      }
      const response = await fetch(
      'https://online-banking-system-6wey.onrender.com/auth/register',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          fullName: fullName.trim(),
          email: registerEmail.trim(),
          password: registerPassword,
          phoneNumber: phoneNumber.trim(),
        }),
      }
    )
      if (!response.ok) {

        let message = 'Registration failed'

        try {
          const errorData = await response.json()
          message = errorData.message || message
        } catch {
          // Keep fallback message
        }

        throw new Error(message)
      }

      await response.json()

      alert('Account created successfully! Please login.')

      setFullName('')
      setRegisterEmail('')
      setRegisterPassword('')
      setPhoneNumber('')

      setScreen('login')

    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        'Could not create account'
      )
    }
  }


  // ==========================
  // LOGIN
  // ==========================

  const handleLogin = async () => {

    try {

      if (!email.trim() || !password) {

        alert('Please enter email and password')

        return
      }

      const response = await fetch(
        'https://online-banking-system-6wey.onrender.com/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      )

      if (!response.ok) {

        let message = 'Invalid email or password'

        try {

          const errorData = await response.json()

          message =
            errorData.message || message

        } catch {
          // Keep fallback
        }

        throw new Error(message)
      }

      const token = await response.text()

      localStorage.setItem(
        'token',
        token
      )

      localStorage.setItem(
        'email',
        email.trim()
      )

      setPassword('')

      alert('Login successful!')

      setScreen('dashboard')

    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        'Invalid email or password'
      )
    }
  }


  // ==========================
  // CHECK BALANCE
  // ==========================

  const handleCheckBalance = async () => {

    try {

      const token =
        localStorage.getItem('token')

      if (!token) {

        alert('Please login again')

        setScreen('login')

        return
      }

      const response = await fetch(
        'https://online-banking-system-6wey.onrender.com/api/account/balance',
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {

        throw new Error(
          'Could not fetch balance'
        )
      }

      const data =
        await response.json()

      setBalance(data.balance)

      setAccountNumber(
        data.accountNumber
      )

    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        'Could not fetch balance'
      )
    }
  }


  // ==========================
  // DEPOSIT
  // ==========================

  const handleDeposit = async () => {

    try {

      const amount =
        Number(depositAmount)

      if (
        !depositAmount ||
        amount <= 0
      ) {

        alert(
          'Please enter a valid deposit amount'
        )

        return
      }

      const token =
        localStorage.getItem('token')

      if (!token) {

        alert('Please login again')

        setScreen('login')

        return
      }

      const response = await fetch(
        'https://online-banking-system-6wey.onrender.com/api/account/deposit',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            amount: amount,
          }),
        }
      )

      if (!response.ok) {

        let message =
          'Could not deposit money'

        try {

          const errorData =
            await response.json()

          message =
            errorData.message ||
            message

        } catch {
          // Keep fallback
        }

        throw new Error(message)
      }

      const data =
        await response.json()

      setBalance(data.balance)

      setAccountNumber(
        data.accountNumber
      )

      setDepositAmount('')

      alert('Deposit successful!')

    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        'Could not deposit money'
      )
    }
  }


  // ==========================
  // WITHDRAW
  // ==========================

  const handleWithdraw = async () => {

    try {

      const amount =
        Number(withdrawAmount)

      if (
        !withdrawAmount ||
        amount <= 0
      ) {

        alert(
          'Please enter a valid withdrawal amount'
        )

        return
      }

      const token =
        localStorage.getItem('token')

      if (!token) {

        alert('Please login again')

        setScreen('login')

        return
      }

      const response = await fetch(
        'https://online-banking-system-6wey.onrender.com/api/account/withdraw',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            amount: amount,
          }),
        }
      )

      if (!response.ok) {

        let message =
          'Could not withdraw money'

        try {

          const errorData =
            await response.json()

          message =
            errorData.message ||
            message

        } catch {
          // Keep fallback
        }

        throw new Error(message)
      }

      const data =
        await response.json()

      setBalance(data.balance)

      setAccountNumber(
        data.accountNumber
      )

      setWithdrawAmount('')

      alert(
        'Withdrawal successful!'
      )

    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        'Could not withdraw money'
      )
    }
  }


  // ==========================
  // TRANSFER
  // ==========================

  const handleTransfer = async () => {

    try {

      const amount =
        Number(transferAmount)

      if (
        !receiverAccountNumber.trim()
      ) {

        alert(
          'Please enter receiver account number'
        )

        return
      }

      if (
        !transferAmount ||
        amount <= 0
      ) {

        alert(
          'Please enter a valid transfer amount'
        )

        return
      }

      const token =
        localStorage.getItem('token')

      if (!token) {

        alert('Please login again')

        setScreen('login')

        return
      }

      const response = await fetch(
        'https://online-banking-system-6wey.onrender.com/api/account/transfer',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({

            receiverAccountNumber:
              receiverAccountNumber.trim(),

            amount: amount,
          }),
        }
      )

      if (!response.ok) {

        let message =
          'Could not transfer money'

        try {

          const errorData =
            await response.json()

          message =
            errorData.message ||
            message

        } catch {
          // Keep fallback
        }

        throw new Error(message)
      }

      const data =
        await response.json()

      setBalance(data.balance)

      setAccountNumber(
        data.accountNumber
      )

      setReceiverAccountNumber('')

      setTransferAmount('')

      alert(
        'Transfer successful!'
      )

    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        'Could not transfer money'
      )
    }
  }


  // ==========================
  // TRANSACTION HISTORY
  // ==========================

  const handleTransactions = async () => {

    try {

      const token =
        localStorage.getItem('token')

      if (!token) {

        alert('Please login again')

        setScreen('login')

        return
      }

      const response = await fetch(
        'https://online-banking-system-6wey.onrender.com/api/account/transactions',
        {
          method: 'GET',

          headers: {

            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {

        throw new Error(
          'Could not load transactions'
        )
      }

      const data =
        await response.json()

      setTransactions(data)

    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        'Could not load transactions'
      )
    }
  }


  // ==========================
  // LOGOUT
  // ==========================

  const handleLogout = () => {

    localStorage.removeItem(
      'token'
    )

    localStorage.removeItem(
      'email'
    )

    setEmail('')
    setPassword('')

    setBalance(0)

    setAccountNumber('')

    setDepositAmount('')

    setWithdrawAmount('')

    setReceiverAccountNumber('')

    setTransferAmount('')

    setTransactions([])

    setScreen('home')
  }


  // ==========================
  // HOME SCREEN
  // ==========================

  if (screen === 'home') {

    return (

      <div className="page">

        <div className="home-card">

          <div className="logo-circle">
            ₹
          </div>

          <h1>
            Online Banking System
          </h1>

          <p>
            Secure, simple and convenient banking.
            Manage your money anytime from one place.
          </p>


          <div>

            <button
              onClick={() =>
                setScreen('login')
              }
            >
              Login
            </button>


            <button
              className="secondary-button"

              onClick={() =>
                setScreen('register')
              }
            >
              Create Account
            </button>

          </div>

        </div>

      </div>
    )
  }


  // ==========================
  // REGISTER SCREEN
  // ==========================

  if (screen === 'register') {

    return (

      <div className="page">

        <div className="auth-card">

          <div className="logo-circle">
            ₹
          </div>

          <h1>
            Create Account
          </h1>

          <p>
            Register for secure online banking
          </p>


          <form
            autoComplete="on"

            onSubmit={(e) => {

              e.preventDefault()

              handleRegister()
            }}
          >


            <label
              htmlFor="register-name"
            >
              Full Name
            </label>


            <input
              id="register-name"

              type="text"

              name="name"

              placeholder="Enter your full name"

              value={fullName}

              autoComplete="name"

              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }

              required
            />


            <label
              htmlFor="register-email"
            >
              Email
            </label>


            <input
              id="register-email"

              type="email"

              name="email"

              placeholder="Enter your email"

              value={registerEmail}

              autoComplete="email"

              onChange={(e) =>
                setRegisterEmail(
                  e.target.value
                )
              }

              required
            />


            <label
              htmlFor="register-password"
            >
              Password
            </label>


            <input
              id="register-password"

              type="password"

              name="new-password"

              placeholder="Minimum 6 characters"

              value={registerPassword}

              autoComplete="new-password"

              minLength="6"

              onChange={(e) =>
                setRegisterPassword(
                  e.target.value
                )
              }

              required
            />


            <label
              htmlFor="phone-number"
            >
              Phone Number
            </label>


            <input
              id="phone-number"

              type="tel"

              name="tel"

              placeholder="Enter your phone number"

              value={phoneNumber}

              autoComplete="tel"

              onChange={(e) =>
                setPhoneNumber(
                  e.target.value
                )
              }

              required
            />


            <button
              type="submit"
              className="full-button"
            >
              Create Account
            </button>

          </form>


          <p>

            Already have an account?{' '}

            <span
              className="link"

              onClick={() =>
                setScreen('login')
              }
            >
              Login
            </span>

          </p>

        </div>

      </div>
    )
  }


  // ==========================
  // LOGIN SCREEN
  // ==========================

  if (screen === 'login') {

    return (

      <div className="page">

        <div className="auth-card">

          <div className="logo-circle">
            ₹
          </div>


          <h1>
            Welcome Back
          </h1>


          <p>
            Login to access your banking dashboard
          </p>


          <form
            autoComplete="on"

            onSubmit={(e) => {

              e.preventDefault()

              handleLogin()
            }}
          >


            <label
              htmlFor="login-email"
            >
              Email
            </label>


            <input
              id="login-email"

              type="email"

              name="email"

              placeholder="Enter your email"

              value={email}

              autoComplete="username"

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

              required
            />


            <label
              htmlFor="login-password"
            >
              Password
            </label>


            <div className="password-wrapper">

              <input
                id="login-password"

                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }

                name="password"

                placeholder="Enter your password"

                value={password}

                autoComplete="current-password"

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                required
              />


              <span
                className="eye-icon"

                role="button"

                tabIndex="0"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                onKeyDown={(e) => {

                  if (
                    e.key === 'Enter' ||
                    e.key === ' '
                  ) {

                    e.preventDefault()

                    setShowPassword(
                      !showPassword
                    )
                  }
                }}
              >
                👁️
              </span>

            </div>


            <button
              type="submit"
              className="full-button"
            >
              Login
            </button>

          </form>


          <p>

            Don't have an account?{' '}

            <span
              className="link"

              onClick={() =>
                setScreen('register')
              }
            >
              Register
            </span>

          </p>

        </div>

      </div>
    )
  }


  // ==========================
  // DASHBOARD
  // ==========================

  return (

    <div className="dashboard">


      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <h1>
            Banking Dashboard
          </h1>

          <p>
            Manage your account securely.
          </p>

        </div>


        <button
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>


      {/* ======================
          BALANCE
      ====================== */}

      <div className="balance-card">

        <p>
          Available Balance
        </p>


        <h1>

          ₹{Number(balance).toLocaleString(
            'en-IN',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}

        </h1>


        {accountNumber && (

          <p>
            Account: {accountNumber}
          </p>

        )}


        <button
          onClick={handleCheckBalance}
        >
          Refresh Balance
        </button>

      </div>


      <h2 className="section-title">
        Banking Services
      </h2>


      <div className="services">


        {/* =====================
            DEPOSIT
        ===================== */}

        <div className="service-card">

          <div className="service-icon">
            ↓
          </div>

          <h2>
            Deposit
          </h2>

          <p>
            Add money to your account.
          </p>


          <form
            onSubmit={(e) => {

              e.preventDefault()

              handleDeposit()
            }}
          >

            <input
              type="number"

              min="0"

              step="0.01"

              placeholder="Enter amount"

              value={depositAmount}

              onChange={(e) =>
                setDepositAmount(
                  e.target.value
                )
              }
            />


            <button type="submit">
              Deposit Money
            </button>

          </form>

        </div>


        {/* =====================
            WITHDRAW
        ===================== */}

        <div className="service-card">

          <div className="service-icon">
            ↑
          </div>


          <h2>
            Withdraw
          </h2>


          <p>
            Withdraw money from your balance.
          </p>


          <form
            onSubmit={(e) => {

              e.preventDefault()

              handleWithdraw()
            }}
          >

            <input
              type="number"

              min="0"

              step="0.01"

              placeholder="Enter amount"

              value={withdrawAmount}

              onChange={(e) =>
                setWithdrawAmount(
                  e.target.value
                )
              }
            />


            <button type="submit">
              Withdraw Money
            </button>

          </form>

        </div>


        {/* =====================
            TRANSFER
        ===================== */}

        <div className="service-card">

          <div className="service-icon">
            ⇄
          </div>


          <h2>
            Transfer
          </h2>


          <p>
            Send money to another account.
          </p>


          <form
            onSubmit={(e) => {

              e.preventDefault()

              handleTransfer()
            }}
          >

            <input
              type="text"

              placeholder="Receiver account number"

              value={receiverAccountNumber}

              onChange={(e) =>
                setReceiverAccountNumber(
                  e.target.value
                )
              }
            />


            <input
              type="number"

              min="0"

              step="0.01"

              placeholder="Transfer amount"

              value={transferAmount}

              onChange={(e) =>
                setTransferAmount(
                  e.target.value
                )
              }
            />


            <button type="submit">
              Transfer Money
            </button>

          </form>

        </div>

      </div>


      {/* ======================
          TRANSACTIONS
      ====================== */}

      <div className="transaction-section">

        <div className="transaction-header">

          <div>

            <h2>
              Transaction History
            </h2>

            <p>
              View your recent account activity.
            </p>

          </div>


          <button
            onClick={
              handleTransactions
            }
          >
            Load Transactions
          </button>

        </div>


        {transactions.length === 0 ? (

          <div className="empty-transactions">

            <p>
              No transactions loaded yet.
            </p>

            <p>
              Click "Load Transactions" to view
              your transaction history.
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

                {transactions.map(
                  (transaction) => (

                    <tr
                      key={
                        transaction.id
                      }
                    >

                      <td>
                        {
                          transaction.transactionType
                        }
                      </td>


                      <td>

                        ₹{Number(
                          transaction.amount
                        ).toLocaleString(
                          'en-IN',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}

                      </td>


                      <td>

                        {
                          transaction.senderAccountNumber ||
                          '-'
                        }

                      </td>


                      <td>

                        {
                          transaction.receiverAccountNumber ||
                          '-'
                        }

                      </td>


                      <td>

                        {
                          transaction.timestamp

                            ? new Date(
                                transaction.timestamp
                              ).toLocaleString(
                                'en-IN'
                              )

                            : '-'
                        }

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}

export default App