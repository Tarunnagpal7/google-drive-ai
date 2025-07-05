import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

import ConnectDrive from '../components/ConnectDrive';
import FileTree from '../components/FileTree';
import StatusLog from '../components/StatusLog';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(API_BASE_URL);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [files, setFiles] = useState(null);
  const [status, setStatus] = useState([]);

  const [isLoading, setIsLoading] = useState({
    files: false,
    suggestions: false,
    execution: false
  });

  // Receive logs from socket
  useEffect(() => {
    socket.on('status', (data) => {
      setStatus(prev => [...prev.slice(-99), data.message]);
    });
    return () => socket.off('status');
  }, []);

   useEffect(() => {
    const checkDriveStatus = async () => {
    setStatus(prev => [...prev, '🔍 Checking Drive connection status...']);
  try {
    const res = await fetch( `${API_BASE_URL}/drive/status`, {
      credentials: 'include'
    });
    const data = await res.json();
    setIsDriveConnected(data.connected);
    if (data.connected) {
      setStatus(prev => [...prev, '✅ Google Drive is already connected.']);
      await fetchFiles();
    } else {
      setStatus(prev => [...prev, '⚠️ Google Drive is not connected.']);
    }
  } catch (e) {
    console.error('Drive status error', e);
    setIsDriveConnected(false);
    setStatus(prev => [...prev, '❌ Error checking Google Drive status.']);
  }
};
    checkDriveStatus();

  }, []);


  const handleDriveConnect = async () => {
  setStatus(prev => [...prev, '🔗 Connecting to Google Drive...']);
  setIsDriveConnected(true);
  await fetchFiles();
};


 const fetchFiles = async () => {
  setIsLoading(prev => ({ ...prev, files: true }));
  setStatus(prev => [...prev, '📁 Fetching files from Google Drive...']);
  try {
    const res = await fetch(`${API_BASE_URL}/report`, {
      credentials: "include",
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setFiles(data);
    setStatus(prev => [...prev, '✅ Files successfully fetched.']);
  } catch (e) {
    setStatus(prev => [...prev, '❌ Failed to fetch files']);
  } finally {
    setIsLoading(prev => ({ ...prev, files: false }));
  }
};

  const steps = [
    { id: 0, label: 'Connect Drive ', description: 'Connect your Google Drive', icon: '🔗' },
    { id: 1, label: 'Select Files', description: 'Select the files, and give name suggestion', icon: '📁' },
    { id: 2, label: 'Analyze ', description: 'Let our AI analyze your files', icon: '🤖' },
    { id: 3, label: 'Review', description: 'Review suggested organization', icon: '👀' },
    { id: 4, label: 'Execute', description: 'Execute changes with one click', icon: '✨' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-xl mb-8 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 shadow-lg"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              👋 Welcome {user?.given_name || user?.name}
            </h1>
            <p className="text-gray-300">Organize your Drive files with AI</p>
          </div>
        </div>
      </motion.div>

      {/* Step-by-step Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-3 rounded-xl mb-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 shadow-lg"
      >
        <div className="mb-3 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30">
            <span className="text-white text-sm font-medium">
              Follow the steps to organize your files
            </span>
          </div>
        </div>
        
        {/* Mobile view - Vertical */}
        <div className="flex flex-col md:hidden space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/20 border border-gray-600/30"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full text-lg bg-gray-600 text-gray-300">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-100">
                  {step.label}
                </div>
                {/* <div className="text-sm text-gray-100">
                  {step.description}
                </div> */}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop view - Horizontal */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Step Circle */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium bg-gray-600 text-gray-300">
                {step.icon}
              </div>
              
              {/* Step Label */}
              <div className="mt-3 text-center text-gray-100">
                <div className="font-medium text-sm">{step.label}</div>
                {/* <div className="text-xs mt-1 px-2 max-w-24 leading-tight">
                  {step.description}
                </div> */}
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 bg-gray-600" style={{ left: 'calc(50% + 24px)', width: 'calc(100% - 48px)' }} />
              )}
            </motion.div>
          ))}
        </div>

      </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
        {/* Left panel: Status log */}

        {/* Right panel: ConnectDrive or FileTree */}
        <div className="md:w-3/4 w-full">
          {!isDriveConnected ? (
            <ConnectDrive token={token} onConnect={handleDriveConnect} />
          ) : (
            <FileTree
              files={files}
              isLoading={isLoading.files}
              onRefresh={fetchFiles}
              disableButtons={isLoading.suggestions || isLoading.execution}
              setStatus={setStatus}
            />
          )}
        </div>
        <div className="md:w-1/4 w-full">
          <StatusLog messages={status} />
        </div>
        </div>
    </div>
  );
}