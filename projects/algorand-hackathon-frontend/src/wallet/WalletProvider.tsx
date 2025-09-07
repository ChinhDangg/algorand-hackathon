// src/wallet/WalletProvider.tsx
import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { PropsWithChildren } from 'react'

const manager = new WalletManager({
  defaultNetwork: NetworkId.LOCALNET,
  networks: {
    [NetworkId.LOCALNET]: {
      algod: {
        baseServer: 'http://localhost:4001',
        port: '',
        token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    },
  },
  wallets: [{ id: WalletId.PERA }, { id: WalletId.DEFLY }, { id: WalletId.EXODUS }],
})

export default function AppWalletProvider({ children }: PropsWithChildren) {
  return <WalletProvider manager={manager}>{children}</WalletProvider>
}
