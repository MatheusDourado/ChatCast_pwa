import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);

    return (
        <ChatContext.Provider value={{
            isRecognizing, 
            setIsRecognizing,
            messages, 
            setMessages,
            isSpeaking,
            setIsSpeaking
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
