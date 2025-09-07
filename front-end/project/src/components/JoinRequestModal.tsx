import React, { useState } from 'react';
import { X, Loader, Send } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useNotifications } from '../contexts/NotificationContext';

interface JoinRequestModalProps {
  projectTitle: string;
  onClose: () => void;
}

export const JoinRequestModal: React.FC<JoinRequestModalProps> = ({ projectTitle, onClose }) => {
  const { signTransaction } = useWallet();
  const { addNotification } = useNotifications();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signTransaction({
        type: 'join_request',
        projectTitle,
        message
      });

      addNotification({
        type: 'success',
        title: 'Join Request Submitted',
        message: `Your request to join "${projectTitle}" has been sent to project members for voting`
      });

      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Request Failed',
        message: 'Failed to submit join request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Request to Join Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">{projectTitle}</h3>
          <p className="text-sm text-gray-600">
            Your request will be sent to all project members for voting. A majority approval is required for membership.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Project Members
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell the project members about your background, expertise, and why you'd like to join this research project..."
              required
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This request will be timestamped on Algorand and visible to all project members. Make sure to provide relevant information about your qualifications.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};