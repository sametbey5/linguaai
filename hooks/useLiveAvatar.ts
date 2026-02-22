
import { useState, useEffect } from 'react';

interface UseLiveAvatarProps {
  systemInstruction: string;
  voiceName: string;
}

export const useLiveAvatar = ({ systemInstruction, voiceName }: UseLiveAvatarProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [volume, setVolume] = useState(0); // 0 to 100
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setError(null);
    try {
        // Simulate connection
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsConnected(true);
        console.log("Mock Live Avatar Connected");
    } catch (err) {
      console.error(err);
      setError("Failed to connect.");
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setIsTalking(false);
    setVolume(0);
    console.log("Mock Live Avatar Disconnected");
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  // Simulate some activity if connected
  useEffect(() => {
      if (!isConnected) return;
      
      const interval = setInterval(() => {
          const talking = Math.random() > 0.7;
          setIsTalking(talking);
          setVolume(talking ? Math.random() * 100 : 0);
      }, 500);
      
      return () => clearInterval(interval);
  }, [isConnected]);

  return { connect, disconnect, isConnected, isTalking, volume, error };
};
