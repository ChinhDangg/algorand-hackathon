import React, { useState } from 'react';
import { Beaker, Bell, Wallet, ChevronDown, LogOut } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useNotifications } from '../contexts/NotificationContext';
import { WalletModal } from './WalletModal';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { isConnected, address, balance, disconnectWallet } = useWallet();
  const { unreadCount } = useNotifications();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', active: currentView === 'dashboard' },
    { id: 'research', label: 'Research', active: currentView === 'research' },
    { id: 'marketplace', label: 'Marketplace', active: currentView === 'marketplace' }
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onNavigate('dashboard')}
              >
                <Beaker className="h-8 w-8 text-blue-700" />
                <span className="text-xl font-bold text-gray-900">ResearchDAO</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                      item.active
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationPanel onClose={() => setShowNotifications(false)} />
                )}
              </div>

              {/* Wallet */}
              {!isConnected ? (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowWalletMenu(!showWalletMenu)}
                    className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors border border-emerald-200"
                  >
                    <Wallet className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{formatAddress(address || '')}</span>
                      <span className="text-xs text-emerald-600">{balance.toFixed(2)} ALGO</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showWalletMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={() => {
                          disconnectWallet();
                          setShowWalletMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showWalletModal && (
        <WalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </>
  );
};