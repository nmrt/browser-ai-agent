import React, { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { AIAgent } from './services/ai-agent';
import { BrowserAutomationService } from './services/browser-automation';

function App() {
  const [command, setCommand] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const browserAutomation = new BrowserAutomationService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !command) return;

    setLoading(true);
    try {
      const agent = new AIAgent(apiKey);
      const actions = await agent.processCommand(command);
      
      setOutput(prev => [...prev, `Processing command: ${command}`]);
      
      for (const action of actions) {
        await browserAutomation.executeAction(action);
        setOutput(prev => [...prev, `Executed action: ${JSON.stringify(action)}`]);
      }
    } catch (error) {
      setOutput(prev => [...prev, `Error: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Browser AI Agent</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="sk-..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Command
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="Enter your command..."
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Processing...' : 'Send'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {output.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Output Log</h2>
            <div className="space-y-2">
              {output.map((line, i) => (
                <div key={i} className="font-mono text-sm bg-gray-50 p-2 rounded">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;