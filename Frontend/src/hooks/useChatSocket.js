import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useChatSocket = ({
  onNewMessage,
  onVisitorStatusChange,
  onTypingIndicator,
  onMessageRead,
  onVisitorJoined,
  onVisitorLeft,
  onError
}) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const initializeSocket = () => {
      try {
        socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
          transports: ['websocket'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000
        });

        const socket = socketRef.current;

        // Connection event handlers
        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
          setIsConnected(true);
          setConnectionError(null);
          
          // Join agent room
          socket.emit('join-agent-room', {
            agentId: getCurrentUserId(),
            status: 'online'
          });
        });

        socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setConnectionError(error.message);
          setIsConnected(false);
          onError?.(error);
        });

        socket.on('reconnect', (attemptNumber) => {
          console.log('Socket reconnected after', attemptNumber, 'attempts');
          setIsConnected(true);
          setConnectionError(null);
        });

        socket.on('reconnect_error', (error) => {
          console.error('Socket reconnection error:', error);
          setConnectionError(error.message);
        });

        // Chat event handlers
        socket.on('new-message', (data) => {
          console.log('New message received:', data);
          onNewMessage?.(data);
        });

        socket.on('visitor-online', (data) => {
          console.log('Visitor came online:', data);
          onVisitorStatusChange?.({ visitorId: data.visitorId, isOnline: true });
        });

        socket.on('visitor-offline', (data) => {
          console.log('Visitor went offline:', data);
          onVisitorStatusChange?.({ visitorId: data.visitorId, isOnline: false });
        });

        socket.on('visitor-joined', (data) => {
          console.log('New visitor joined:', data);
          onVisitorJoined?.(data);
        });

        socket.on('visitor-left', (data) => {
          console.log('Visitor left:', data);
          onVisitorLeft?.(data);
        });

        socket.on('typing-indicator', (data) => {
          console.log('Typing indicator:', data);
          onTypingIndicator?.(data);
        });

        socket.on('message-read', (data) => {
          console.log('Message read:', data);
          onMessageRead?.(data);
        });

        socket.on('agent-assigned', (data) => {
          console.log('Agent assigned to session:', data);
          // Handle agent assignment
        });

        socket.on('session-ended', (data) => {
          console.log('Session ended:', data);
          // Handle session end
        });

        // Error handlers
        socket.on('error', (error) => {
          console.error('Socket error:', error);
          onError?.(error);
        });

        socket.on('chat-error', (error) => {
          console.error('Chat error:', error);
          onError?.(error);
        });

      } catch (error) {
        console.error('Failed to initialize socket:', error);
        setConnectionError(error.message);
        onError?.(error);
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [onNewMessage, onVisitorStatusChange, onTypingIndicator, onMessageRead, onVisitorJoined, onVisitorLeft, onError]);

  // Helper function to get current user ID
  const getCurrentUserId = () => {
    // This should be retrieved from your auth context or local storage
    return localStorage.getItem('userId') || 'default-agent-id';
  };

  // Socket methods
  const sendMessage = (messageData) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', messageData);
    } else {
      console.error('Socket not connected');
    }
  };

  const joinVisitorRoom = (visitorId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-visitor-room', {
        visitorId,
        agentId: getCurrentUserId()
      });
    }
  };

  const leaveVisitorRoom = (visitorId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-visitor-room', {
        visitorId,
        agentId: getCurrentUserId()
      });
    }
  };

  const markMessagesAsRead = (messageIds, visitorId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('mark-read', {
        messageIds,
        visitorId,
        agentId: getCurrentUserId()
      });
    }
  };

  const startTyping = (visitorId, sessionId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing-start', {
        visitorId,
        sessionId,
        agentId: getCurrentUserId()
      });
    }
  };

  const stopTyping = (visitorId, sessionId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing-stop', {
        visitorId,
        sessionId,
        agentId: getCurrentUserId()
      });
    }
  };

  const updateAgentStatus = (status) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('agent-status', {
        agentId: getCurrentUserId(),
        status
      });
    }
  };

  const assignSession = (sessionId, agentId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('assign-session', {
        sessionId,
        agentId: agentId || getCurrentUserId()
      });
    }
  };

  const endSession = (sessionId, reason) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('end-session', {
        sessionId,
        agentId: getCurrentUserId(),
        reason
      });
    }
  };

  const transferSession = (sessionId, toAgentId, reason) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('transfer-session', {
        sessionId,
        fromAgentId: getCurrentUserId(),
        toAgentId,
        reason
      });
    }
  };

  // Return socket instance and utility functions
  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    
    // Message methods
    sendMessage,
    markMessagesAsRead,
    
    // Room methods
    joinVisitorRoom,
    leaveVisitorRoom,
    
    // Typing methods
    startTyping,
    stopTyping,
    
    // Agent methods
    updateAgentStatus,
    
    // Session methods
    assignSession,
    endSession,
    transferSession,
    
    // Utility methods
    emit: (event, data) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit(event, data);
      }
    },
    
    on: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    
    off: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    }
  };
};

export { useChatSocket };