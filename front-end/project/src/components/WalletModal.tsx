import React, { useState } from 'react';
import { X, Wallet, Loader } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

interface WalletModalProps {
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const { connectWallet } = useWallet();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (type: 'algosigner' | 'pera') => {
    setConnecting(type);
    try {
      await connectWallet(type);
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleConnect('algosigner')}
            disabled={connecting !== null}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">AlgoSigner</div>
                <div className="text-sm text-gray-500">Official Algorand wallet extension</div>
              </div>
            </div>
            {connecting === 'algosigner' && (
              <Loader className="h-5 w-5 text-blue-600 animate-spin" />
            )}
          </button>

          <button
            onClick={() => handleConnect('pera')}
            disabled={connecting !== null}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Pera Wallet</div>
                <div className="text-sm text-gray-500">Mobile-first Algorand wallet</div>
              </div>
            </div>
            {connecting === 'pera' && (
              <Loader className="h-5 w-5 text-emerald-600 animate-spin" />
            )}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          By connecting a wallet, you agree to ResearchDAO's Terms of Service and acknowledge our Privacy Policy.
        </p>
      </div>
    </div>
  );
};