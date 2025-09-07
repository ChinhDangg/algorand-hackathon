import React, { useState } from 'react';
import { Plus, Users, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';

interface DashboardProps {
  onNavigate: (view: string, projectId?: string) => void;
}

const mockProjects = [
  {
    id: '1',
    title: 'AI Ethics Research',
    description: 'Exploring ethical implications of AI in healthcare and autonomous systems',
    members: 12,
    funding: 5000,
    status: 'active',
    isOwner: true,
    pendingVotes: 2
  },
  {
    id: '2',
    title: 'Climate Change Analysis',
    description: 'Data-driven analysis of climate patterns and environmental impact',
    members: 8,
    funding: 3200,
    status: 'active',
    isOwner: false,
    pendingVotes: 0
  },
  {
    id: '3',
    title: 'Quantum Computing Applications',
    description: 'Research into practical applications of quantum computing in cryptography',
    members: 6,
    funding: 7500,
    status: 'pending',
    isOwner: true,
    pendingVotes: 1
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { isConnected } = useWallet();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    { label: 'Active Projects', value: '3', icon: FileText, color: 'text-blue-600' },
    { label: 'Total Members', value: '26', icon: Users, color: 'text-emerald-600' },
    { label: 'Total Funding', value: '$15.7K', icon: DollarSign, color: 'text-amber-600' },
    { label: 'Research Papers', value: '18', icon: TrendingUp, color: 'text-purple-600' }
  ];

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to ResearchDAO</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to start collaborating on research projects, submit your work, and participate in the academic community.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Projects</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onNavigate('project', project.id)}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('research')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Submit Research</div>
                <div className="text-sm text-gray-500">Timestamp your work on-chain</div>
              </div>
            </button>
            
            <button
              onClick={() => onNavigate('marketplace')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <DollarSign className="h-6 w-6 text-emerald-600" />
              <div>
                <div className="font-medium text-gray-900">Browse Marketplace</div>
                <div className="text-sm text-gray-500">Access premium research content</div>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="h-6 w-6 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">Find Collaborators</div>
                <div className="text-sm text-gray-500">Connect with researchers</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
};