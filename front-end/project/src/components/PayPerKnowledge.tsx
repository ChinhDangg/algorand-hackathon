import React, { useState } from 'react';
import { ArrowLeft, Search, DollarSign, Lock, Unlock, Download, Star } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useNotifications } from '../contexts/NotificationContext';

interface PayPerKnowledgeProps {
  onNavigate: (view: string) => void;
}

const mockContent = [
  {
    id: '1',
    title: 'Advanced Machine Learning Algorithms',
    author: 'Dr. Emily Chen',
    description: 'Comprehensive guide to state-of-the-art ML algorithms with practical implementations',
    price: 2.5,
    category: 'AI/ML',
    rating: 4.8,
    downloads: 1234,
    preview: 'This comprehensive guide covers advanced machine learning algorithms including...',
    isPurchased: false,
    type: 'document'
  },
  {
    id: '2',
    title: 'Climate Data Analysis Dataset',
    author: 'Climate Research Lab',
    description: '10-year comprehensive climate dataset with analysis tools and documentation',
    price: 5.0,
    category: 'Climate Science',
    rating: 4.9,
    downloads: 567,
    preview: 'This dataset contains 10 years of climate data from 200+ weather stations...',
    isPurchased: true,
    type: 'dataset'
  },
  {
    id: '3',
    title: 'Quantum Computing Tutorial Series',
    author: 'Prof. Michael Johnson',
    description: 'Step-by-step tutorial series on quantum computing principles and applications',
    price: 1.8,
    category: 'Quantum Computing',
    rating: 4.7,
    downloads: 890,
    preview: 'Learn quantum computing from the ground up with this comprehensive tutorial...',
    isPurchased: false,
    type: 'tutorial'
  },
  {
    id: '4',
    title: 'Blockchain Security Audit Code',
    author: 'Security Experts Inc',
    description: 'Professional-grade code for conducting comprehensive blockchain security audits',
    price: 7.5,
    category: 'Blockchain',
    rating: 4.9,
    downloads: 234,
    preview: 'This codebase provides tools and frameworks for conducting thorough...',
    isPurchased: false,
    type: 'code'
  }
];

const categories = ['All', 'AI/ML', 'Climate Science', 'Quantum Computing', 'Blockchain', 'Biology', 'Physics'];

export const PayPerKnowledge: React.FC<PayPerKnowledgeProps> = ({ onNavigate }) => {
  const { isConnected, signTransaction } = useWallet();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [purchasingIds, setPurchasingIds] = useState<Set<string>>(new Set());

  const filteredContent = mockContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = async (contentId: string, price: number, title: string) => {
    setPurchasingIds(prev => new Set([...prev, contentId]));

    try {
      await signTransaction({
        type: 'payment',
        amount: price,
        contentId,
        title
      });

      addNotification({
        type: 'success',
        title: 'Content Purchased',
        message: `Successfully purchased "${title}" for ${price} ALGO`
      });

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Purchase Failed',
        message: 'Failed to complete payment. Please try again.'
      });
    } finally {
      setPurchasingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(contentId);
        return newSet;
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dataset':
        return '📊';
      case 'code':
        return '💻';
      case 'tutorial':
        return '🎓';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dataset':
        return 'bg-purple-100 text-purple-800';
      case 'code':
        return 'bg-emerald-100 text-emerald-800';
      case 'tutorial':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Premium Knowledge</h2>
        <p className="text-gray-600 mb-6">
          Connect your wallet to browse and purchase premium research content with micropayments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Marketplace</h1>
          <p className="text-gray-600">Discover and access premium research content</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search content, authors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContent.map((item) => {
          const isPurchasing = purchasingIds.has(item.id);
          
          return (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">by {item.author}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                  {item.type}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

              {/* Preview */}
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <p className="text-sm text-gray-700 italic">"{item.preview}"</p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span>{item.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>{item.downloads}</span>
                </div>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.category}</span>
              </div>

              {/* Purchase Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <span className="text-xl font-semibold text-gray-900">{item.price} ALGO</span>
                </div>

                {item.isPurchased ? (
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <Unlock className="h-5 w-5 text-emerald-600" />
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchase(item.id, item.price, item.title)}
                    disabled={isPurchasing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPurchasing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Purchasing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Purchase Access</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredContent.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No content found matching your search criteria</p>
        </div>
      )}

      {/* Stats Footer */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketplace Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">{mockContent.length}</p>
            <p className="text-sm text-gray-500">Total Content</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-emerald-600">
              {mockContent.reduce((sum, item) => sum + item.downloads, 0)}
            </p>
            <p className="text-sm text-gray-500">Downloads</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-purple-600">
              {mockContent.reduce((sum, item) => sum + item.price, 0).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">Total Value (ALGO)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-amber-600">
              {(mockContent.reduce((sum, item) => sum + item.rating, 0) / mockContent.length).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};