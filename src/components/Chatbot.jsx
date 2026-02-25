import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import './Chatbot.css';

const INITIAL_MESSAGES = [
    { id: 1, text: "Hi there! I'm the StyleUpSpaces AI Assistant. 👋", sender: 'bot' },
    { id: 2, text: "How can I help you today? I can assist with interior design, painting, rental agreements, packing, or any other home services.", sender: 'bot' }
];

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        // 1. Add User Message
        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // 2. Simulate AI Typing
        setIsTyping(true);

        // 3. Generate Fake AI Response
        setTimeout(() => {
            let botReply = "I understand you need help with that. Our support team will contact you shortly to provide detailed pricing and schedules.";

            const lowerInput = userMsg.text.toLowerCase();
            if (lowerInput.includes('paint') || lowerInput.includes('color')) {
                botReply = "Are you looking for interior or exterior painting? We offer free premium color consultations and use trusted brand paints seamlessly applied by our pros!";
            } else if (lowerInput.includes('interior') || lowerInput.includes('design')) {
                botReply = "Our interior design experts can transform your space! We provide 3D renders before starting. What room are you looking to redesign?";
            } else if (lowerInput.includes('rent') || lowerInput.includes('agreement')) {
                botReply = "We handle legal rental agreements efficiently! You can upload your documents through your profile or have an agent assist you.";
            } else if (lowerInput.includes('pack') || lowerInput.includes('move')) {
                botReply = "Moving can be stressful! We offer premium Packers & Movers with damage-free guarantees. Are you moving locally or inter-city?";
            } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
                botReply = "Our pricing is highly competitive and transparent! It varies based on standard and premium packages. Would you like me to connect you with an estimator?";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply, sender: 'bot' }]);
            setIsTyping(false);
        }, 1500); // 1.5 second delay to feel realistic
    };

    return (
        <div className="chatbot-wrapper">
            {/* The Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <Bot size={22} />
                            </div>
                            <div>
                                <div className="chatbot-title">StyleUpSpaces AI</div>
                                <div className="chatbot-status">
                                    <div className="chatbot-status-dot"></div>
                                    Online
                                </div>
                            </div>
                        </div>
                        <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chatbot-message-row ${msg.sender}`}>
                                <div className="chatbot-message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chatbot-typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-area">
                        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                className="chatbot-input"
                                placeholder="Type your message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="chatbot-send-btn"
                                disabled={!inputValue.trim()}
                            >
                                <Send size={18} style={{ marginLeft: '-2px' }} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    className="chatbot-toggle-btn"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open support chat"
                >
                    <MessageSquare size={28} />
                </button>
            )}
        </div>
    );
};

export default Chatbot;
