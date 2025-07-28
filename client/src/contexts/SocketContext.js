import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          userId: user.id,
          userRole: user.role
        }
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
      });

      // User management events
      newSocket.on('user-online', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('user-offline', (users) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
        setSocket(null);
        setConnected(false);
      };
    }
  }, [user]);

  // Socket utility functions
  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join-room', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave-room', roomId);
    }
  };

  const sendMessage = (roomId, message) => {
    if (socket) {
      socket.emit('send-message', {
        roomId,
        message,
        sender: user
      });
    }
  };

  const sendTyping = (roomId, isTyping) => {
    if (socket) {
      socket.emit('typing', {
        roomId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        isTyping
      });
    }
  };

  const sendNotification = (userId, notification) => {
    if (socket) {
      socket.emit('send-notification', {
        userId,
        notification
      });
    }
  };

  const value = {
    socket,
    connected,
    onlineUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    sendNotification
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};