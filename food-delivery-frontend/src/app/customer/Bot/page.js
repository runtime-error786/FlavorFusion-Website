"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import "./Style.css";

const notificationSound = '/not.mp3'; // Adjust the path according to your file location

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [notification, setNotification] = useState(false);

    const toggle = () => {
        setIsOpen(prevIsOpen => !prevIsOpen);
        if (!isOpen) {
            setChatHistory([{ sender: 'chatbot', message: 'Hi, I am Chatbot' }]);
        }
    };

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSend = async () => {
        if (message.trim() !== '') {
            const newChatHistory = [...chatHistory, { sender: 'user', message }];
            setChatHistory(newChatHistory);

            try {
                const response = await axios.post('http://localhost:2002/api/chat', { message });

                if (response.status === 200) {
                    const data = response.data;
                    setChatHistory([...newChatHistory, { sender: 'chatbot', message: data.response }]);
                    setNotification(true);
                } else {
                    console.error('Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
            }

            setMessage('');
        }
    };

    useEffect(() => {
        if (notification) {
            // Play notification sound
            const audio = new Audio(notificationSound);
            audio.play();

            // Reset notification state
            setNotification(false);
        }
    }, [notification]);

    return (
        <div className="chatbotContainer">
            <div className="chatIcon" onClick={toggle}>
            <img src="/botLogo.png" width={60} alt="Chat Icon" className="yellowBackgroundImage" />
            </div>
            {isOpen && (
                <div className="chatPopup">
                    <div className="header">
                        <div className="closeButton" onClick={toggle}>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                        <div className="topButton">
                            Chat
                        </div>
                    </div>
                    <div className="chatContent">
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={chat.sender === 'chatbot' ? "chatbotMessage" : "userMessage"}>
                                {chat.message}
                            </div>
                        ))}
                    </div>
                    <div className="inputContainer">
                        <input
                            type="text"
                            value={message}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            className="messageInput"
                        />
                        <button className="sendButton" onClick={handleSend}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
