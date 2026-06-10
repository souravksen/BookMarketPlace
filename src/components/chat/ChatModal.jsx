import { useState, useEffect, useRef } from 'react';
import { Send, X, User } from 'lucide-react';
import Modal from '../ui/Modal';
import { formatDate } from '../../utils/helpers';

export default function ChatModal({ isOpen, onClose, sellerName, sellerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize with some mock messages when opened
  useEffect(() => {
    if (isOpen) {
      setMessages([
        { id: 1, senderId: sellerId, text: `Hi there! Thanks for your order. Let me know if you have any questions.`, timestamp: new Date(Date.now() - 3600000).toISOString() }
      ]);
    }
  }, [isOpen, sellerId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const newMsg = {
      id: Date.now(),
      senderId: 'me',
      text: input.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Simulate seller response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        senderId: sellerId,
        text: 'Thanks for your message! I will look into it and get back to you shortly.',
        timestamp: new Date().toISOString()
      }]);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Chat with ${sellerName}`} size="md">
      <div className="flex flex-col h-[60vh] sm:h-[400px]">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-950/50 rounded-xl border border-dark-800 mb-4 custom-scrollbar">
          {messages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[80%]">
                  {!isMe && (
                    <div className="w-6 h-6 rounded-full bg-dark-800 flex items-center justify-center flex-shrink-0">
                      <User size={12} className="text-dark-400" />
                    </div>
                  )}
                  <div className={`px-4 py-2 rounded-2xl ${isMe ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-dark-800 text-dark-100 rounded-bl-sm'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
                <span className="text-[10px] text-dark-500 mt-1 mx-8">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </Modal>
  );
}
