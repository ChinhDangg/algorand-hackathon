import React, { useState } from 'react';
import { ArrowLeft, Users, DollarSign, Vote, FileText, Plus, UserPlus } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { VotingPanel } from './VotingPanel';
import { JoinRequestModal } from './JoinRequestModal';

interface ProjectDetailsProps {
  projectId: string;
  onNavigate: (view: string) => void;
}

const mockProject = {
  id: '1',
  title: 'AI Ethics Research',
  description: 'Exploring ethical implications of AI in healthcare and autonomous systems. This comprehensive research project aims to establish guidelines and frameworks for responsible AI development.',
  members: 12,
  funding: 5000,
  status: 'active',
  isOwner: true,
  isMember: true,
  tags: ['AI', 'Ethics', 'Healthcare', 'Autonomous Systems'],
  createdAt: new Date('2024-01-15'),
  owner: 'Dr. Sarah Chen'
};

const mockMembers = [
  { id: '1', name: 'Dr. Sarah Chen', role: 'Owner', avatar: 'SC' },
  { id: '2', name: 'Prof. Michael Johnson', role: 'Co-Lead', avatar: 'MJ' },
  { id: '3', name: 'Alice Wilson', role: 'Researcher', avatar: 'AW' },
  { id: '4', name: 'Bob Smith', role: 'Data Analyst', avatar: 'BS' },
  { id: '5', name: 'Dr. Lisa Zhang', role: 'Ethicist', avatar: 'LZ' }
];

const mockResearch = [
  {
    id: '1',
    title: 'AI Bias in Healthcare Decision Making',
    author: 'Dr. Sarah Chen',
    timestamp: new Date('2024-02-20'),
    txId: 'TX7XYZ123ABC456',
    type: 'paper'
  },
  {
    id: '2',
    title: 'Training Dataset - Medical Ethics Cases',
    author: 'Alice Wilson',
    timestamp: new Date('2024-02-18'),
    txId: 'TX9ABC789DEF012',
    type: 'dataset'
  }
];

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, onNavigate }) => {
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'members', label: 'Members', count: mockMembers.length },
    { id: 'research', label: 'Research', count: mockResearch.length },
    { id: 'voting', label: 'Voting', count: 2 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{mockProject.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {mockProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium text-gray-900">
                    {mockProject.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-emerald-600 capitalize">{mockProject.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Members</p>
                  <p className="font-medium text-gray-900">{mockProject.members}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Funding</p>
                  <p className="font-medium text-gray-900">${mockProject.funding}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Project Members</h3>
              {mockProject.isMember && (
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <UserPlus className="h-4 w-4" />
                  <span>Invite Members</span>
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {mockMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-medium text-blue-700">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'research':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Research Submissions</h3>
              {mockProject.isMember && (
                <button
                  onClick={() => onNavigate('research')}
                  className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Submit Research</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {mockResearch.map((research) => (
                <div key={research.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{research.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">By {research.author}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Timestamped: {research.timestamp.toLocaleDateString()}</span>
                        <span className="text-blue-600">TX: {research.txId}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      research.type === 'paper' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {research.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'voting':
        return <VotingPanel projectId={projectId} />;

      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Connect your wallet to view project details.</p>
      </div>
    );
  }

  return (
    <>
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
            <h1 className="text-3xl font-bold text-gray-900">{mockProject.title}</h1>
            <p className="text-gray-600">by {mockProject.owner}</p>
          </div>
          {!mockProject.isMember && (
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Request to Join</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">{mockProject.members}</p>
              <p className="text-sm text-gray-500">Members</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">${mockProject.funding}</p>
              <p className="text-sm text-gray-500">Funding</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
            <FileText className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">{mockResearch.length}</p>
              <p className="text-sm text-gray-500">Research Items</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {showJoinModal && (
        <JoinRequestModal
          projectTitle={mockProject.title}
          onClose={() => setShowJoinModal(false)}
        />
      )}
    </>
  );
};