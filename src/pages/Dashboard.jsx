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
