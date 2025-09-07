import React, { useState } from 'react';
import { ArrowLeft, Upload, Hash, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useNotifications } from '../contexts/NotificationContext';

interface ResearchSubmissionProps {
  onNavigate: (view: string) => void;
}

export const ResearchSubmission: React.FC<ResearchSubmissionProps> = ({ onNavigate }) => {
  const { isConnected, signTransaction } = useWallet();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'paper',
    file: null as File | null
  });
  const [fileHash, setFileHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txId, setTxId] = useState('');
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, file }));
    setIsHashing(true);

    // Simulate hash generation
    setTimeout(() => {
      const mockHash = `${Math.random().toString(36).substr(2, 64)}`;
      setFileHash(mockHash);
      setIsHashing(false);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileHash) return;

    setIsSubmitting(true);

    try {
      const transactionId = await signTransaction({
        type: 'timestamp',
        hash: fileHash,
        title: formData.title,
        description: formData.description,
        researchType: formData.type
      });

      setTxId(transactionId);
      setSubmissionComplete(true);

      addNotification({
        type: 'success',
        title: 'Research Timestamped',
        message: `"${formData.title}" has been successfully timestamped on Algorand`
      });

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'Failed to timestamp research. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Submit Research</h2>
        <p className="text-gray-600 mb-6">
          Connect your wallet to submit and timestamp your research on Algorand blockchain.
        </p>
      </div>
    );
  }

  if (submissionComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Research Submitted Successfully</h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {formData.title}
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your research has been successfully timestamped on the Algorand blockchain and is now permanently verifiable.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Transaction ID</p>
                <p className="font-mono text-blue-600 break-all">{txId}</p>
              </div>
              <div>
                <p className="text-gray-500">File Hash</p>
                <p className="font-mono text-gray-900 break-all">{fileHash.slice(0, 20)}...</p>
              </div>
              <div>
                <p className="text-gray-500">Timestamp</p>
                <p className="text-gray-900">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <p className="text-gray-900 capitalize">{formData.type}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              <ExternalLink className="h-4 w-4" />
              <span>View on Algorand Explorer</span>
            </button>
            <button
              onClick={() => {
                setSubmissionComplete(false);
                setFormData({ title: '', description: '', type: 'paper', file: null });
                setFileHash('');
                setTxId('');
              }}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Submit Another Research
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Submit Research</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your research title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Briefly describe your research work"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="paper">Research Paper</option>
              <option value="dataset">Dataset</option>
              <option value="code">Source Code</option>
              <option value="tutorial">Tutorial</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {formData.file ? (
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                  <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                      Click to upload
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt,.zip,.csv,.json"
                      />
                    </label>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, TXT, ZIP up to 10MB</p>
                </>
              )}
            </div>
          </div>

          {fileHash && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Hash className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">File Hash Generated</h4>
                  <p className="text-sm text-blue-700 mt-1 font-mono break-all">{fileHash}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    This SHA-256 hash will be stored on Algorand blockchain as proof of your research integrity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isHashing && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-600">Generating file hash...</span>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">Important Information</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Your file will be hashed locally for privacy</li>
              <li>• Only the hash is stored on blockchain, not the file content</li>
              <li>• This creates immutable proof of existence and integrity</li>
              <li>• Timestamp will be permanently recorded on Algorand</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!fileHash || isSubmitting || isHashing}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                <span>Submitting to Blockchain...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Submit & Timestamp Research</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};