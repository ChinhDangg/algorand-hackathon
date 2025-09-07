import React, { useState } from 'react';
import { Vote, ThumbsUp, ThumbsDown, Clock, CheckCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useNotifications } from '../contexts/NotificationContext';

interface VotingPanelProps {
  projectId: string;
}

const mockVotes = [
  {
    id: '1',
    type: 'join_request',
    title: 'Join Request - Alice Johnson',
    description: 'PhD candidate in AI Ethics requesting to join the project',
    proposer: 'Alice Johnson',
    yesVotes: 7,
    noVotes: 2,
    totalVoters: 12,
    userVoted: false,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 48),
    status: 'active'
  },
  {
    id: '2',
    type: 'proposal',
    title: 'Budget Allocation for Data Collection',
    description: 'Proposal to allocate 2000 ALGO for additional data collection and analysis tools',
    proposer: 'Dr. Sarah Chen',
    yesVotes: 8,
    noVotes: 1,
    totalVoters: 12,
    userVoted: true,
    userVote: 'yes',
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
    status: 'active'
  }
];

export const VotingPanel: React.FC<VotingPanelProps> = ({ projectId }) => {
  const { signTransaction } = useWallet();
  const { addNotification } = useNotifications();
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({});

  const handleVote = async (voteId: string, vote: 'yes' | 'no') => {
    setVotingStates(prev => ({ ...prev, [voteId]: true }));

    try {
      await signTransaction({
        type: 'vote',
        voteId,
        vote,
        projectId
      });

      addNotification({
        type: 'success',
        title: 'Vote Submitted',
        message: `Your ${vote} vote has been recorded on-chain`
      });

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Vote Failed',
        message: 'Failed to submit vote. Please try again.'
      });
    } finally {
      setVotingStates(prev => ({ ...prev, [voteId]: false }));
    }
  };

  const getVotePercentage = (yesVotes: number, noVotes: number) => {
    const total = yesVotes + noVotes;
    if (total === 0) return { yes: 0, no: 0 };
    return {
      yes: Math.round((yesVotes / total) * 100),
      no: Math.round((noVotes / total) * 100)
    };
  };

  const formatTimeLeft = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Active Votes</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Vote className="h-4 w-4" />
          <span>{mockVotes.length} active votes</span>
        </div>
      </div>

      {mockVotes.map((vote) => {
        const percentages = getVotePercentage(vote.yesVotes, vote.noVotes);
        const isVoting = votingStates[vote.id];

        return (
          <div key={vote.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{vote.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{vote.description}</p>
                <p className="text-xs text-gray-500">Proposed by {vote.proposer}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                vote.type === 'join_request' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {vote.type.replace('_', ' ')}
              </span>
            </div>

            {/* Vote Progress */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Yes ({vote.yesVotes})</span>
                <span className="text-gray-600">{percentages.yes}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentages.yes}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">No ({vote.noVotes})</span>
                <span className="text-gray-600">{percentages.no}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentages.no}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeLeft(vote.endTime)}</span>
                </div>
                <span>{vote.yesVotes + vote.noVotes} of {vote.totalVoters} voted</span>
              </div>

              <div className="flex items-center space-x-3">
                {vote.userVoted ? (
                  <div className="flex items-center space-x-2 text-sm text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>You voted {vote.userVote}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVote(vote.id, 'yes')}
                      disabled={isVoting}
                      className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{isVoting ? 'Voting...' : 'Yes'}</span>
                    </button>
                    <button
                      onClick={() => handleVote(vote.id, 'no')}
                      disabled={isVoting}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      <span>{isVoting ? 'Voting...' : 'No'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {mockVotes.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <Vote className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No active votes at the moment</p>
        </div>
      )}
    </div>
  );
};