import { useState } from 'react'
import './App.css'
import SwapCurrencyForm from './pages/SwapFormControl'

function App() {
  const [count, setCount] = useState(0)

  return <SwapCurrencyForm />
}

export default App
