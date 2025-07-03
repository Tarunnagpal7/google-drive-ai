export default function StatusLog({ messages }) {
  return (
    <div>

      <h2 className="text-white font-bold mb-2">📋 Status Log</h2>
      <div className="bg-black bg-opacity-30 rounded-lg p-4 h-[500px] overflow-y-auto font-mono text-sm">

        {messages.length === 0 ? (
          <div className="text-gray-500">No activity yet</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span>{' '}
              <span>{msg}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}