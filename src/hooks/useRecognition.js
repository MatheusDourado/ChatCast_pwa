import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { askGPT3 } from '../services/gptService'; 

const useRecognition = () => {
    const { isRecognizing, setIsRecognizing, messages, setMessages, setIsSpeaking } = useChat();
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [shouldRestartListening, setShouldRestartListening] = useState(false);
    const isMobile = window.innerWidth <= 600;
    const recognition = useRef(new (window.SpeechRecognition || window.webkitSpeechRecognition)());
    // const [isSpeaking, setIsSpeaking] = useState(false);


    const startListening = useCallback(() => {
        if (recognition.current?.state !== 'active' && !window.speechSynthesis.speaking) {
            setIsRecognizing(true);
            recognition.current.abort();
            recognition.current.start();
        }
    }, [recognition, setIsRecognizing]);
    
    const stopListening = () => {
        if (isRecognizing) {
            setIsRecognizing(false);
            recognition.current.stop();
        }
    };

    const speak = useCallback((message) => {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'pt-BR';
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => voice.lang.includes('pt-BR')); 
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
            // setIsAISpeaking(true);
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            // setIsAISpeaking(false);
            setIsSpeaking(false);
            if (!isMobile) { 
                setShouldRestartListening(true);  
            }
        };
        
        utterance.rate = 1.1;
        utterance.pitch = 1.1;
        
        window.speechSynthesis.speak(utterance);
    }, [isMobile, setIsSpeaking])

    useEffect(() => {
        if (shouldRestartListening && !isAISpeaking) {
            startListening();
            setShouldRestartListening(false);
        }
    }, [shouldRestartListening, isAISpeaking, startListening]);
    

    useEffect(() => {
        const currentRecognition = recognition.current;

        const handleResult = async (event) => {
            const transcript = event.results[0][0].transcript.trim();
            const updatedMessages = [...messages, { role: 'user', content: transcript }];
            setMessages(updatedMessages);
                        
            console.log("Você disse: ", transcript)

            const response = await askGPT3(updatedMessages);
            setMessages([...updatedMessages, { role: 'system', content: response }]);
            speak(response);
        };

        currentRecognition.onresult = handleResult;

        return () => {
            currentRecognition.removeEventListener('result', handleResult);
        };
    }, [isRecognizing, messages, setMessages, startListening, speak]);

    return { startListening, stopListening, isAISpeaking };
};

export default useRecognition;
