import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Fade,
  Tooltip,
  Chip,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Info as InfoIcon,
  Summarize as SummarizeIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const ChatWindow = ({
  selectedVisitor,
  messages,
  isTyping,
  onSendMessage,
  onMessageHover,
  highlightedMessages,
  currentUser
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const MessageBubble = ({ message, isOwn, isHighlighted }) => {
    const isHovered = hoveredMessageId === message._id;
    
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          mb: 1,
          position: 'relative'
        }}
        onMouseEnter={() => setHoveredMessageId(message._id)}
        onMouseLeave={() => setHoveredMessageId(null)}
      >
        <Box
          sx={{
            maxWidth: '70%',
            display: 'flex',
            flexDirection: isOwn ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            gap: 1
          }}
        >
          {/* Avatar */}
          {!isOwn && (
            <Avatar
              src={selectedVisitor.avatar}
              sx={{ width: 32, height: 32, mb: 0.5 }}
            >
              {selectedVisitor.name?.charAt(0) || 'V'}
            </Avatar>
          )}
          
          {/* Message Content */}
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              bgcolor: isOwn ? 'primary.main' : 'grey.100',
              color: isOwn ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              borderBottomLeftRadius: isOwn ? 2 : 0.5,
              borderBottomRightRadius: isOwn ? 0.5 : 2,
              position: 'relative',
              transition: 'all 0.3s ease',
              transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isHighlighted 
                ? '0 4px 20px rgba(25, 118, 210, 0.3)' 
                : 'none',
              animation: isHighlighted 
                ? 'highlight 3s ease-in-out' 
                : 'none',
              '@keyframes highlight': {
                '0%': {
                  backgroundColor: isOwn ? 'primary.light' : 'info.light',
                  transform: 'scale(1.02)'
                },
                '100%': {
                  backgroundColor: isOwn ? 'primary.main' : 'grey.100',
                  transform: 'scale(1)'
                }
              }
            }}
          >
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {message.content}
            </Typography>
            
            {/* Message Time */}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 0.5,
                opacity: 0.7,
                fontSize: '0.7rem'
              }}
            >
              {formatMessageTime(message.createdAt)}
              {message.isEdited && ' (edited)'}
            </Typography>
          </Paper>
          
          {/* Hover Actions */}
          {isHovered && !isOwn && (
            <Fade in={isHovered}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  ml: 1,
                  position: 'absolute',
                  right: isOwn ? 'auto' : -60,
                  left: isOwn ? -60 : 'auto',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}
              >
                <Tooltip title="Message Details">
                  <IconButton
                    size="small"
                    onClick={() => onMessageHover(message._id, 'details')}
                    sx={{
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Chat Summary">
                  <IconButton
                    size="small"
                    onClick={() => onMessageHover(message._id, 'summary')}
                    sx={{
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <SummarizeIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
    );
  };

  const TypingIndicator = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        color: 'text.secondary'
      }}
    >
      <Avatar
        src={selectedVisitor.avatar}
        sx={{ width: 24, height: 24 }}
      >
        {selectedVisitor.name?.charAt(0) || 'V'}
      </Avatar>
      <Typography variant="caption">
        {selectedVisitor.name || 'Visitor'} is typing...
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 4,
              height: 4,
              bgcolor: 'text.secondary',
              borderRadius: '50%',
              animation: 'typing 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
              '@keyframes typing': {
                '0%, 60%, 100%': { transform: 'translateY(0)' },
                '30%': { transform: 'translateY(-10px)' }
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={selectedVisitor.avatar}>
            {selectedVisitor.name?.charAt(0) || 'V'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              {selectedVisitor.name || `Visitor ${selectedVisitor.visitorId?.slice(-4)}`}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={selectedVisitor.isOnline ? 'Online' : 'Offline'}
                size="small"
                color={selectedVisitor.isOnline ? 'success' : 'default'}
                variant="outlined"
              />
              {selectedVisitor.location && (
                <Typography variant="caption" color="text.secondary">
                  {selectedVisitor.location.city}, {selectedVisitor.location.country}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.senderType === 'agent'}
                isHighlighted={highlightedMessages.includes(message._id)}
              />
            ))}
            
            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}
            
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      <Divider />

      {/* Message Input */}
      <Box sx={{ p: 2 }}>
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3
              }
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" color="primary">
              <AttachFileIcon />
            </IconButton>
            <IconButton size="small" color="primary">
              <EmojiIcon />
            </IconButton>
            <IconButton
              type="submit"
              size="small"
              color="primary"
              disabled={!messageInput.trim()}
              sx={{
                bgcolor: messageInput.trim() ? 'primary.main' : 'transparent',
                color: messageInput.trim() ? 'primary.contrastText' : 'inherit',
                '&:hover': {
                  bgcolor: messageInput.trim() ? 'primary.dark' : 'action.hover'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;