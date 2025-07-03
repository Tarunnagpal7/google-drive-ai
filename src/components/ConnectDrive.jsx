import React, { useState } from 'react';
import { FiLink, FiLoader, FiAlertCircle } from 'react-icons/fi';
export default function ConnectDrive({ token }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = () => {
    setLoading(true);
    setError(null);

    try {
      // Simply redirect the user to backend's /authorize endpoint
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/authorize`;
      
    } catch (err) {
      setError('Failed to start authorization flow.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-900/30 border border-blue-700 p-6 rounded-xl shadow mb-8">
      <h2 className="text-xl font-semibold mb-2">🔐 Connect to Google Drive</h2>
      <p className="text-gray-300 mb-4">Grant access to your Drive so AI can organize your files.</p>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        {loading ? <FiLoader className="animate-spin" /> : <FiLink />}
        {loading ? 'Connecting...' : 'Connect to Drive'}
      </button>

      {error && (
        <div className="mt-4 flex items-center text-red-400 gap-2">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
