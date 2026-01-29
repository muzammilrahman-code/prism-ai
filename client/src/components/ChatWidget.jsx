import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot } from 'lucide-react'; // Install lucide-react for icons
import { useAuth } from "@clerk/clerk-react";

const ChatWidget = () => {
    const { getToken } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! I am Prism AI, ask me anything about our platform!' }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const typeWriter = (text) => {
    let index = 0;
    // Create an empty bot message first
    setMessages(prev => [...prev, { role: 'bot', text: '' }]);

    const interval = setInterval(() => {
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            const updatedMessages = [...prev.slice(0, -1), { ...lastMessage, text: text.slice(0, index + 1) }];
            return updatedMessages;
        });
        index++;
        if (index >= text.length) {
            clearInterval(interval);
        }
    }, 15); // Adjust this number for speed (smaller = faster)
};

    const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
        const token = await getToken();
        const res = await axios.post('http://localhost:5000/api/chatbot/ask', 
            { question: input },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setLoading(false); // Stop loading before typing starts
        typeWriter(res.data.answer); // CALL THE TYPEWRITER HERE
        
    } catch (err) {
        setLoading(false);
        setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting." }]);
    }
};
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-gray-100 animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <div className="bg-black p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg"><Bot size={20} /></div>
                            <span className="font-semibold text-sm">Prism AI Agent</span>
                        </div>
                        <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    m.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                                }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {/* {loading && <div className="text-xs text-gray-400 animate-pulse ml-2">Prism AI is thinking...</div>} */}
                        {loading && (
                          <div className="flex justify-start">
                              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                  <span className="flex gap-1">
                                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                  </span>
                              </div>
                          </div>
                      )}
                      
                        {/* optional */}
                        {/* Suggestion Buttons */}
                        {messages.length === 1 && ( // Only show on start or after first message
                            <div className="flex flex-wrap gap-2 px-2 pb-4">
                                {["What is Prism AI?", "Is there a free plan?", "How to use this?"].map((text, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(text);
                                            // Optionally trigger handleSend immediately here
                                        }}
                                        className="text-[11px] bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 shadow-sm transition-all"
                                    >
                                        {text}
                                    </button>
                                ))}
                            </div>
                        )}


                        <div ref={chatEndRef} />
                    </div>

                    {/* Footer Input */}
                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
                        <input 
                            className="flex-1 text-sm outline-none bg-gray-100 p-2.5 rounded-full px-4"
                            placeholder="Message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            className="p-2 bg-black text-white rounded-full hover:opacity-80 transition"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="text-[10px] text-center pb-2 text-gray-400">Powered by Prism AI</div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
};

export default ChatWidget;