// aiService.js - API service for AI file organization
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

class AIService {
  // Generate AI suggestions for selected files
  static async generateRenameSuggestions(selectedFiles,namingPattern = "") {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/rename-preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookies
        body: JSON.stringify({
          selectedFiles: selectedFiles,
            pattern: namingPattern || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const suggestions = await response.json();
      return suggestions;
    } catch (error) {
      console.error('Error generating rename suggestions:', error);
      throw error;
    }
  }

  // Execute the AI suggestions
  static async executeRename(suggestions) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/execute-rename`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          suggestions: suggestions
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error executing rename:', error);
      throw error;
    }
  }

  // Batch organize entire folder
  static async batchOrganizeFolder(folderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/batch-organize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          folderId: folderId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error batch organizing folder:', error);
      throw error;
    }
  }
}

// Complete FileTree component with AI integration
import React, { useState } from 'react';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown, FiHardDrive, FiSearch, FiEdit3, FiPlay, FiLoader, FiRefreshCw } from 'react-icons/fi';

export default function FileTree({ files, isLoading, onRefresh, setStatus }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isExecutingRename, setIsExecutingRename] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [namingPattern, setNamingPattern] = useState('');


  const log = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setStatus(prev => [...prev.slice(-99), `[${timestamp}] ${message}`]);
  };

  const toggleFolder = (nodeId) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const toggleSelection = (nodeId, event) => {
    event.stopPropagation();

    const isFolder = files[nodeId]?.label?.includes('(folder)');

    // Recursively collect all child nodes of a folder
    const collectChildren = (id, acc = new Set()) => {
      acc.add(id);
      const node = files[id];
      if (node?.children) {
        for (const childId of node.children) {
          collectChildren(childId, acc);
        }
      }
      return acc;
    };

    setSelectedItems(prev => {
      const newSet = new Set(prev);
      const targetSet = isFolder ? collectChildren(nodeId) : new Set([nodeId]);

      const isSelected = newSet.has(nodeId);
      if (isSelected) {
        // Remove node and its children
        targetSet.forEach(id => newSet.delete(id));
      } else {
        // Add node and its children
        targetSet.forEach(id => newSet.add(id));
      }

      return newSet;
    });
  };


  const handleAiRenamePreview = async () => {
    if (selectedItems.size === 0) return;

    setIsGeneratingSuggestions(true);
    setExecutionResults(null);
    log("⚙️ Generating AI rename suggestions...");

    try {
      const selectedFiles = Array.from(selectedItems).map(id => ({
        id,
        name: files[id]?.label?.replace(/\s*\(.*\)$/, ''),
        type: files[id]?.label?.includes('(folder)') ? 'folder' : 'file'
      }));
      
      const suggestions = await AIService.generateRenameSuggestions(selectedFiles, namingPattern);

      setAiSuggestions(suggestions);
      setNamingPattern("")

      if (suggestions.length === 0) {
        log("⚠️ No suggestions generated.");
        alert('No suggestions generated. Please try with different files.');
      } else {
        log(`✅ AI suggested names for ${suggestions.length} items.`);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      log("❌ Failed to generate AI suggestions.");
      alert('Failed to generate AI suggestions. Please try again.');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleExecuteRename = async () => {
    if (!aiSuggestions) return;

    setIsExecutingRename(true);
    log("🚀 Executing rename and folder moves...");

    try {
      const result = await AIService.executeRename(aiSuggestions);
      setExecutionResults(result);

      if (result.success) {
        log(`✅ Executed ${result.successful}/${result.total} successfully.`);
        alert(`Successfully processed ${result.successful}/${result.total} files!`);
        setAiSuggestions(null);
        setSelectedItems(new Set());

        if (onRefresh) {
          onRefresh();
        }
      } else {
        log("⚠️ Some files failed to process.");
        alert('Some files failed to process. Check the results below.');
      }
    } catch (error) {
      console.error('Error executing rename:', error);
      log("❌ Failed to execute rename.");
      alert('Failed to execute rename. Please try again.');
    } finally {
      setIsExecutingRename(false);
    }
  };


  const handleBatchOrganize = async (folderId) => {
    if (!folderId) return;

    setIsGeneratingSuggestions(true);

    try {
      const result = await AIService.batchOrganizeFolder(folderId);
      setAiSuggestions(result.suggestions);

      if (result.suggestions.length === 0) {
        alert('No files found in folder or no suggestions generated.');
      } else {
        alert(`Generated suggestions for ${result.total_files} files!`);
      }
    } catch (error) {
      console.error('Error batch organizing folder:', error);
      alert('Failed to organize folder. Please try again.');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center mb-4">
          <FiHardDrive className="text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Drive Files</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!files || Object.keys(files).length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
        <FiHardDrive className="text-gray-500 mx-auto mb-2 text-2xl" />
        <p className="text-gray-400">No files found. Connect your Google Drive.</p>
      </div>
    );
  }

  const filterTree = (id) => {
    const node = files[id];
    if (!node) return false;
    const name = node.label.replace(/\s*\(.*\)$/, '').toLowerCase();
    const match = name.includes(searchQuery.toLowerCase());
    if (match) return true;
    return node.children?.some(filterTree);
  };

  const renderTree = (nodeId, depth = 0) => {
    const node = files[nodeId];
    if (!node || !node.label) return null;

    const isFolder = node.label?.includes('(folder)');
    const name = node.label.replace(/\s*\(.*\)$/, '');
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedFolders.has(nodeId);
    const isSelected = selectedItems.has(nodeId);
    const shouldDisplay = searchQuery ? filterTree(nodeId) : true;
    if (!shouldDisplay) return null;

    return (
      <div key={nodeId} className={`${depth > 0 ? 'ml-4' : ''}`}>
        <div
          className={`flex items-center py-2 px-3 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer group ${isFolder ? 'hover:bg-blue-900/20' : 'hover:bg-gray-700/30'
            } ${isSelected ? 'bg-purple-900/30 border border-purple-500/50' : ''}`}
          onClick={() => isFolder && toggleFolder(nodeId)}
        >
          <input
            type="checkbox"
            className="mr-2 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-2"
            checked={isSelected}
            onChange={(e) => toggleSelection(nodeId, e)}
          />

          {isFolder ? (
            <div className="mr-1 text-gray-400">
              {hasChildren ? (
                isExpanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </div>
          ) : (
            <div className="w-5 mr-1" />
          )}

          <div className="flex items-center min-w-0 flex-1">
            {isFolder ? (
              <FiFolder className={`mr-2 flex-shrink-0 ${isExpanded ? 'text-blue-400' : 'text-blue-300'}`} />
            ) : (
              <FiFile className="text-gray-400 mr-2 flex-shrink-0" />
            )}
            <span className={`truncate ${isFolder ? 'text-blue-200 font-medium' : 'text-gray-300'} group-hover:text-white transition-colors`}>
              {name}
            </span>
          </div>

          {hasChildren && (
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {node.children.length}
            </span>
          )}
        </div>

        {isFolder && hasChildren && isExpanded && (
          <div className="border-l border-gray-600 ml-2 pl-1 mt-1">
            {node.children.map(childId => renderTree(childId, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const allIds = Object.keys(files);
  const childIds = new Set(Object.values(files).flatMap(n => n.children || []));
  const rootIds = allIds.filter(id => !childIds.has(id));

  const unknownFolder = rootIds.find(id => files[id]?.label?.toLowerCase().includes('unknown'));
  const displayIds = unknownFolder && files[unknownFolder]?.children ? files[unknownFolder].children : rootIds;

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <FiHardDrive className="text-purple-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Drive Files</h3>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="pl-8 pr-3 py-1 rounded bg-gray-900 text-white text-sm border border-gray-600 focus:outline-none focus:border-purple-500"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {selectedItems.size > 0 && (
                <span className="text-sm text-purple-400 bg-purple-900/20 px-2 py-1 rounded">
                  {selectedItems.size} selected
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          <div className="space-y-1">
            {displayIds.map(rootId => renderTree(rootId))}
          </div>
        </div>
      </div>

      

  {selectedItems.size > 0 && (
  <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
    <h4 className="text-white font-medium mb-3 flex items-center">
      <FiEdit3 className="mr-2 text-purple-400" />
      AI File Organization
    </h4>

    {/* Custom Naming Pattern Input */}
    <div className="mb-4 w-full">
      <label htmlFor="namingPattern" className="block text-sm text-gray-300 mb-1">
        Custom File Naming Pattern (optional)
      </label>
      <input
        type="text"
        id="namingPattern"
        value={namingPattern}
        onChange={(e) => setNamingPattern(e.target.value)}
        placeholder="[Company] [Date] [Name]"
        className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
      />
    </div>

    {/* AI Buttons */}
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={handleAiRenamePreview}
        disabled={isGeneratingSuggestions}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
      >
        {isGeneratingSuggestions ? (
          <FiLoader className="w-4 h-4 animate-spin" />
        ) : (
          <FiEdit3 className="w-4 h-4" />
        )}
        {isGeneratingSuggestions ? 'Generating...' : 'AI Rename Preview'}
      </button>

      {aiSuggestions && (
        <button
          onClick={handleExecuteRename}
          disabled={isExecutingRename}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {isExecutingRename ? (
            <FiLoader className="w-4 h-4 animate-spin" />
          ) : (
            <FiPlay className="w-4 h-4" />
          )}
          {isExecutingRename ? 'Executing...' : 'Execute Rename'}
        </button>
      )}

      <button
        onClick={() => {
          setAiSuggestions(null);
          setExecutionResults(null);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
      >
        Clear Results
      </button>
    </div>
  </div>
)}


      {/* Execution Results */}
      {executionResults && (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
          <h4 className="text-white font-medium mb-3">Execution Results</h4>
          <div className="mb-3">
            <span className="text-green-400">{executionResults.successful} successful</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-red-400">{executionResults.failed} failed</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-300">{executionResults.total} total</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {executionResults.results.map((result, index) => (
              <div key={index} className={`p-2 rounded ${result.status === 'success' ? 'bg-green-900/30' :
                  result.status === 'partial' ? 'bg-yellow-900/30' : 'bg-red-900/30'
                }`}>
                <div className="text-sm text-gray-300">{result.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions Preview */}
      {aiSuggestions && (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
          <h4 className="text-white font-medium mb-3">AI Suggestions Preview</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-gray-700/50 rounded p-3 border border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-400 text-sm">Current:</span>
                      <span className="text-gray-300">{suggestion.currentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm">New:</span>
                      <span className="text-green-300 font-medium">{suggestion.newName}</span>
                    </div>
                    {suggestion.newFolder && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-blue-400 text-sm">Folder:</span>
                        <span className="text-blue-300">{suggestion.newFolder}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {suggestion.type === 'folder' ? 'Folder' : 'File'}
                  </div>
                </div>
                {suggestion.reason && (
                  <div className="mt-2 text-xs text-gray-400 italic">
                    {suggestion.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export the service for use in other components
export { AIService };