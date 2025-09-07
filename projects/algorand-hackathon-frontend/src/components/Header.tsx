import ConnectWallet from '../wallet/ConnectWallet'

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100">
      <h1 className="text-xl font-bold">Voting DApp</h1>
      <ConnectWallet />
    </header>
  )
}
