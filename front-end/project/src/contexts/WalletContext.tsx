import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: number;
  connectWallet: (type: 'algosigner' | 'pera') => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (txData: any) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  const connectWallet = async (type: 'algosigner' | 'pera') => {
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = type === 'algosigner' 
        ? 'ALGO7XYZ123ABC456DEF789GHI012JKL345MNO678PQR901STU234VWX567YZ890'
        : 'PERA4ABC567DEF890GHI123JKL456MNO789PQR012STU345VWX678YZ901ABC234';
      
      setAddress(mockAddress);
      setBalance(Math.random() * 1000 + 100);
      setIsConnected(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', mockAddress);
      localStorage.setItem('wallet_type', type);
    }, 1000);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(0);
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_type');
  };

  const signTransaction = async (txData: any) => {
    // Simulate transaction signing
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const txId = `TX${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        resolve(txId);
      }, 1500);
    });
  };

  // Check for existing connection on mount
  useEffect(() => {
    const connected = localStorage.getItem('wallet_connected');
    const storedAddress = localStorage.getItem('wallet_address');
    
    if (connected && storedAddress) {
      setIsConnected(true);
      setAddress(storedAddress);
      setBalance(Math.random() * 1000 + 100);
    }
  }, []);

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      balance,
      connectWallet,
      disconnectWallet,
      signTransaction
    }}>
      {children}
    </WalletContext.Provider>
  );
};