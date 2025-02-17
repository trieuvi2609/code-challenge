import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { WalletPage } from './pages/WalletPage'
import SwapCurrencyForm from './pages/SwapFormControl'

function App() {
  const [count, setCount] = useState(0)

  return <SwapCurrencyForm />
}

export default App
