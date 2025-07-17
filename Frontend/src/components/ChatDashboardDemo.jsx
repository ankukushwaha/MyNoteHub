import React, { useState, useEffect } from 'react';
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

// Mock data for demonstration
const mockVisitors = [
  {
    _id: '1',
    visitorId: 'visitor_001',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1234567890',
    avatar: null,
    isOnline: true,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    location: {
      city: 'New York',
      country: 'USA'
    },
    sessionCount: 3,
    totalMessages: 45,
    firstVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    recentSessions: [
      {
        _id: 'session_1',
        sessionId: 'sess_001',
        status: 'active',
        startedAt: new Date(Date.now() - 15 * 60 * 1000),
        endedAt: null,
        messageCount: 12,
        rating: null,
        tags: ['support', 'billing']
      },
      {
        _id: 'session_2',
        sessionId: 'sess_002',
        status: 'closed',
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        messageCount: 8,
        rating: 5,
        tags: ['technical', 'resolved']
      }
    ]
  },
  {
    _id: '2',
    visitorId: 'visitor_002',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: null,
    avatar: null,
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    location: {
      city: 'London',
      country: 'UK'
    },
    sessionCount: 1,
    totalMessages: 15,
    firstVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    recentSessions: [
      {
        _id: 'session_3',
        sessionId: 'sess_003',
        status: 'closed',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endedAt: new Date(Date.now() - 90 * 60 * 1000),
        messageCount: 15,
        rating: 4,
        tags: ['general', 'inquiry']
      }
    ]
  },
  {
    _id: '3',
    visitorId: 'visitor_003',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    phone: '+1987654321',
    avatar: null,
    isOnline: true,
    lastSeen: new Date(),
    location: {
      city: 'Toronto',
      country: 'Canada'
    },
    sessionCount: 2,
    totalMessages: 28,
    firstVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    recentSessions: [
      {
        _id: 'session_4',
        sessionId: 'sess_004',
        status: 'pending',
        startedAt: new Date(Date.now() - 5 * 60 * 1000),
        endedAt: null,
        messageCount: 3,
        rating: null,
        tags: ['urgent']
      }
    ]
  }
];

const mockMessages = {
  '1': [
    {
      _id: 'msg_1',
      content: 'Hello, I need help with my billing issue.',
      senderType: 'visitor',
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 9 * 60 * 1000)
    },
    {
      _id: 'msg_2',
      content: 'Hi John! I\'d be happy to help you with your billing question. Can you please provide more details about the issue?',
      senderType: 'agent',
      createdAt: new Date(Date.now() - 8 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 7 * 60 * 1000)
    },
    {
      _id: 'msg_3',
      content: 'I was charged twice for my subscription this month.',
      senderType: 'visitor',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 4 * 60 * 1000)
    },
    {
      _id: 'msg_4',
      content: 'I understand your concern. Let me check your account details and resolve this for you right away.',
      senderType: 'agent',
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 1 * 60 * 1000)
    }
  ],
  '2': [
    {
      _id: 'msg_5',
      content: 'Hi, I have a question about your product features.',
      senderType: 'visitor',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000)
    },
    {
      _id: 'msg_6',
      content: 'Hello Sarah! I\'d be glad to help you with information about our features. What specifically would you like to know?',
      senderType: 'agent',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 90 * 1000)
    }
  ],
  '3': [
    {
      _id: 'msg_7',
      content: 'This is urgent! My account has been suspended.',
      senderType: 'visitor',
      createdAt: new Date(Date.now() - 3 * 60 * 1000),
      isRead: false,
      readAt: null
    },
    {
      _id: 'msg_8',
      content: 'Please help me restore my account access immediately.',
      senderType: 'visitor',
      createdAt: new Date(Date.now() - 1 * 60 * 1000),
      isRead: false,
      readAt: null
    }
  ]
};

const mockUnreadCounts = {
  '1': 0,
  '2': 0,
  '3': 2
};

const mockCurrentUser = {
  _id: 'agent_001',
  name: 'Agent Smith',
  avatar: null,
  status: 'online'
};

const ChatDashboardDemo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedVisitorId, setSelectedVisitorId] = useState('1');
  const [highlightedMessages, setHighlightedMessages] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [unreadCounts, setUnreadCounts] = useState(mockUnreadCounts);
  const [isTyping, setIsTyping] = useState(false);

  // Handle visitor selection
  const handleVisitorSelect = (visitorId) => {
    setSelectedVisitorId(visitorId);
    
    // Mark messages as read when visitor is selected
    if (unreadCounts[visitorId] > 0) {
      setUnreadCounts(prev => ({
        ...prev,
        [visitorId]: 0
      }));
      
      // Update messages to mark as read
      setMessages(prev => ({
        ...prev,
        [visitorId]: prev[visitorId]?.map(msg => ({
          ...msg,
          isRead: true,
          readAt: msg.readAt || new Date()
        })) || []
      }));
    }
  };

  // Handle sending messages
  const handleSendMessage = (content, messageType = 'text') => {
    if (!selectedVisitorId || !content.trim()) return;
    
    const newMessage = {
      _id: `msg_${Date.now()}`,
      content: content.trim(),
      senderType: 'agent',
      createdAt: new Date(),
      isRead: true,
      readAt: new Date()
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedVisitorId]: [...(prev[selectedVisitorId] || []), newMessage]
    }));
    
    // Simulate visitor typing and response after 2 seconds
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const visitorResponse = {
          _id: `msg_${Date.now()}_response`,
          content: 'Thank you for your help!',
          senderType: 'visitor',
          createdAt: new Date(),
          isRead: false,
          readAt: null
        };
        
        setMessages(prev => ({
          ...prev,
          [selectedVisitorId]: [...(prev[selectedVisitorId] || []), visitorResponse]
        }));
        
        // Highlight the new message
        setHighlightedMessages([visitorResponse._id]);
        setTimeout(() => {
          setHighlightedMessages([]);
        }, 3000);
      }, 2000);
    }, 1000);
  };

  // Handle message hover actions
  const handleMessageHover = (messageId, action) => {
    const selectedVisitor = mockVisitors.find(v => v._id === selectedVisitorId);
    const message = messages[selectedVisitorId]?.find(m => m._id === messageId);
    
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
        sessionId: selectedVisitor?.recentSessions?.[0]?._id,
        visitor: selectedVisitor
      });
      setActiveModal('summary');
    }
  };

  // Get selected visitor data
  const selectedVisitor = mockVisitors.find(v => v._id === selectedVisitorId);
  const selectedVisitorMessages = messages[selectedVisitorId] || [];
  const recentChats = selectedVisitor?.recentSessions || [];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, zIndex: 1 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Chat Dashboard - Demo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {mockVisitors.filter(v => v.isOnline).length} visitors online
        </Typography>
      </Paper>

      <Divider />

      {/* Main Chat Interface */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Column 1: Visitor List */}
          <Grid item xs={12} md={3} sx={{ borderRight: 1, borderColor: 'divider' }}>
            <VisitorList
              visitors={mockVisitors}
              selectedVisitorId={selectedVisitorId}
              unreadCounts={unreadCounts}
              onVisitorSelect={handleVisitorSelect}
              onlineCount={mockVisitors.filter(v => v.isOnline).length}
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
                currentUser={mockCurrentUser}
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

export default ChatDashboardDemo;