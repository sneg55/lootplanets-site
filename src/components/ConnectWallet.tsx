import React from 'react'

interface IConnectWalletProps {
  onConnectClick: () => void
}
export function ConnectWallet({ onConnectClick }: IConnectWalletProps): React.ReactElement {
  return <button onClick={onConnectClick}>Connect Wallet</button>
}
