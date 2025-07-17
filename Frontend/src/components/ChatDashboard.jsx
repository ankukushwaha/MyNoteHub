import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import VisitorList from './chat/VisitorList';
import ChatWindow from './chat/ChatWindow';
import VisitorProfile from './chat/VisitorProfile';
import ChatModals from './chat/ChatModals';
import { useChatSocket } from '../hooks/useChatSocket';
import { useChatStore } from '../context/ChatContext';

const ChatDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    visitors,
    selectedVisitorId,
    messages,
    unreadCounts,
    currentUser,
    ui,
    selectVisitor,
    addMessage,
    markMessagesAsRead,
    updateVisitorStatus,
    setTypingStatus,
    setHighlightedMessages
  } = useChatStore();

  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Initialize socket connection
  const socket = useChatSocket({
    onNewMessage: handleNewMessage,
    onVisitorStatusChange: handleVisitorStatusChange,
    onTypingIndicator: handleTypingIndicator,
    onMessageRead: handleMessageRead
  });

  // Handle new message from socket
  const handleNewMessage = useCallback((messageData) => {
    const { message, visitorId } = messageData;
    
    addMessage(visitorId, message);
    
    // If visitor is selected, mark as read and highlight
    if (selectedVisitorId === visitorId) {
      markMessagesAsRead(visitorId, [message._id]);
      setHighlightedMessages([message._id]);
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedMessages([]);
      }, 3000);
    }
  }, [selectedVisitorId, addMessage, markMessagesAsRead, setHighlightedMessages]);

  // Handle visitor status changes
  const handleVisitorStatusChange = useCallback((data) => {
    const { visitorId, isOnline } = data;
    updateVisitorStatus(visitorId, isOnline);
  }, [updateVisitorStatus]);

  // Handle typing indicators
  const handleTypingIndicator = useCallback((data) => {
    const { visitorId, isTyping } = data;
    setTypingStatus(visitorId, isTyping);
  }, [setTypingStatus]);

  // Handle message read receipts
  const handleMessageRead = useCallback((data) => {
    const { messageIds, visitorId } = data;
    markMessagesAsRead(visitorId, messageIds);
  }, [markMessagesAsRead]);

  // Handle visitor selection
  const handleVisitorSelect = useCallback((visitorId) => {
    selectVisitor(visitorId);
    
    // Mark all unread messages as read for selected visitor
    const unreadMessages = messages[visitorId]?.messages?.filter(
      msg => !msg.isRead && msg.senderType === 'visitor'
    ) || [];
    
    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(msg => msg._id);
      markMessagesAsRead(visitorId, messageIds);
      
      // Emit read receipt to server
      socket?.emit('mark-read', { messageIds, visitorId });
    }
  }, [selectVisitor, messages, markMessagesAsRead, socket]);

  // Handle sending messages
  const handleSendMessage = useCallback((content, messageType = 'text') => {
    if (!selectedVisitorId || !content.trim()) return;
    
    const messageData = {
      sessionId: visitors.find(v => v._id === selectedVisitorId)?.currentSessionId,
      content: content.trim(),
      messageType,
      senderType: 'agent',
      agentId: currentUser._id
    };
    
    socket?.emit('send-message', messageData);
  }, [selectedVisitorId, visitors, currentUser, socket]);

  // Handle message hover actions
  const handleMessageHover = useCallback((messageId, action) => {
    const selectedVisitor = visitors.find(v => v._id === selectedVisitorId);
    const message = messages[selectedVisitorId]?.messages?.find(m => m._id === messageId);
    
    if (action === 'details') {
      setModalData({
        type: 'details',
        message,
        visitor: selectedVisitor
      });
      setActiveModal('details');
    } else if (action === 'summary') {
      setModalData({
        type: 'summary',
        sessionId: selectedVisitor?.currentSessionId,
        visitor: selectedVisitor
      });
      setActiveModal('summary');
    }
  }, [visitors, messages, selectedVisitorId]);

  // Get selected visitor data
  const selectedVisitor = visitors.find(v => v._id === selectedVisitorId);
  const selectedVisitorMessages = messages[selectedVisitorId]?.messages || [];
  const isTyping = messages[selectedVisitorId]?.isTyping || false;
  const highlightedMessages = ui.highlightedMessages || [];

  // Get visitor's recent chat history (last 5 sessions)
  const recentChats = selectedVisitor?.recentSessions?.slice(0, 5) || [];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, zIndex: 1 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Chat Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {visitors.filter(v => v.isOnline).length} visitors online
        </Typography>
      </Paper>

      <Divider />

      {/* Main Chat Interface */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Column 1: Visitor List */}
          <Grid item xs={12} md={3} sx={{ borderRight: 1, borderColor: 'divider' }}>
            <VisitorList
              visitors={visitors}
              selectedVisitorId={selectedVisitorId}
              unreadCounts={unreadCounts}
              onVisitorSelect={handleVisitorSelect}
              onlineCount={visitors.filter(v => v.isOnline).length}
            />
          </Grid>

          {/* Column 2: Chat Window */}
          <Grid item xs={12} md={6} sx={{ borderRight: 1, borderColor: 'divider' }}>
            {selectedVisitor ? (
              <ChatWindow
                selectedVisitor={selectedVisitor}
                messages={selectedVisitorMessages}
                isTyping={isTyping}
                onSendMessage={handleSendMessage}
                onMessageHover={handleMessageHover}
                highlightedMessages={highlightedMessages}
                currentUser={currentUser}
              />
            ) : (
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: 'text.secondary'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Select a visitor to start chatting
                </Typography>
                <Typography variant="body2">
                  Choose a visitor from the list to view their messages
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Column 3: Visitor Profile */}
          <Grid item xs={12} md={3}>
            {selectedVisitor ? (
              <VisitorProfile
                visitor={selectedVisitor}
                recentChats={recentChats}
                onShowDetails={() => setActiveModal('visitorDetails')}
                onShowSummary={() => setActiveModal('visitorSummary')}
              />
            ) : (
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 2,
                  color: 'text.secondary'
                }}
              >
                <Typography variant="body2" align="center">
                  Visitor profile and chat history will appear here when a visitor is selected
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Modals */}
      <ChatModals
        activeModal={activeModal}
        modalData={modalData}
        onClose={() => {
          setActiveModal(null);
          setModalData(null);
        }}
      />
    </Box>
  );
};

export default ChatDashboard;