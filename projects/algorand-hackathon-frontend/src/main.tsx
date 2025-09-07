import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppWalletProvider from './wallet/WalletProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWalletProvider>
      <App />
    </AppWalletProvider>
  </React.StrictMode>,
)
