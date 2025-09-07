import React from 'react';
import { Users, DollarSign, Clock, Vote, AlertTriangle } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  members: number;
  funding: number;
  status: 'active' | 'pending' | 'completed';
  isOwner: boolean;
  pendingVotes: number;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>;
      case 'pending':
        return <Clock className="h-3 w-3 text-amber-500" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(project.status)}`}>
          {getStatusIcon(project.status)}
          <span className="capitalize">{project.status}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{project.members}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>{(project.funding / 1000).toFixed(1)}K</span>
          </div>
        </div>
        
        {project.isOwner && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            Owner
          </span>
        )}
      </div>

      {project.pendingVotes > 0 && (
        <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-800">
            {project.pendingVotes} pending vote{project.pendingVotes > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};