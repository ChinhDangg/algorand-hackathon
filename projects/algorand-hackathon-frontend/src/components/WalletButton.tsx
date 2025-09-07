// src/components/WalletButton.tsx
import { useWallet } from '@txnlab/use-wallet-react'

export default function WalletButton() {
  const { wallets, activeAddress, activeWallet } = useWallet()

  if (activeAddress && activeWallet) {
    return (
      <div>
        <span className="font-mono">{activeAddress}</span>
        <button onClick={() => activeWallet.disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {wallets.map((w) => (
        <button key={w.id} onClick={() => w.connect()}>
          Connect {w.metadata.name}
        </button>
      ))}
    </div>
  )
}
