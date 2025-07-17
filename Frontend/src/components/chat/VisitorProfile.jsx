import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Chat as ChatIcon,
  Star as StarIcon,
  Info as InfoIcon,
  Summarize as SummarizeIcon
} from '@mui/icons-material';

const VisitorProfile = ({ visitor, recentChats, onShowDetails, onShowSummary }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    }
    return `${diffMins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'closed': return 'default';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        sx={{
          fontSize: 16,
          color: i < rating ? 'warning.main' : 'grey.300'
        }}
      />
    ));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Visitor Profile
        </Typography>
      </Box>

      {/* Visitor Info */}
      <Box sx={{ p: 2 }}>
        <Card elevation={0} sx={{ bgcolor: 'grey.50' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {/* Avatar and Basic Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={visitor.avatar}
                sx={{ width: 60, height: 60, mr: 2 }}
              >
                {visitor.name?.charAt(0) || 'V'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {visitor.name || `Visitor ${visitor.visitorId?.slice(-4)}`}
                </Typography>
                <Chip
                  label={visitor.isOnline ? 'Online' : 'Offline'}
                  size="small"
                  color={visitor.isOnline ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Contact Information */}
            <Box sx={{ mb: 2 }}>
              {visitor.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{visitor.email}</Typography>
                </Box>
              )}
              
              {visitor.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{visitor.phone}</Typography>
                </Box>
              )}
              
              {visitor.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {visitor.location.city}, {visitor.location.country}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {visitor.isOnline ? 'Online now' : `Last seen ${formatDate(visitor.lastSeen)}`}
                </Typography>
              </Box>
            </Box>

            {/* Statistics */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {visitor.sessionCount || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sessions
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {visitor.totalMessages || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Messages
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {formatDuration(visitor.firstVisit, new Date())}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Member for
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<InfoIcon />}
                onClick={onShowDetails}
                fullWidth
              >
                Details
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SummarizeIcon />}
                onClick={onShowSummary}
                fullWidth
              >
                Summary
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Chat History */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Recent Chat History
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, overflow: 'auto', px: 2 }}>
          {recentChats.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100px',
                color: 'text.secondary'
              }}
            >
              <Typography variant="body2">
                No recent chat history
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {recentChats.map((chat, index) => (
                <React.Fragment key={chat._id}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 1,
                      alignItems: 'flex-start'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <ChatIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Chat #{chat.sessionId?.slice(-6)}
                          </Typography>
                          <Chip
                            label={chat.status}
                            size="small"
                            color={getStatusColor(chat.status)}
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {formatDate(chat.startedAt)} • {formatDuration(chat.startedAt, chat.endedAt)}
                          </Typography>
                          
                          {chat.messageCount && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {chat.messageCount} messages
                            </Typography>
                          )}
                          
                          {chat.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              {renderStars(chat.rating)}
                              <Typography variant="caption" color="text.secondary">
                                ({chat.rating}/5)
                              </Typography>
                            </Box>
                          )}
                          
                          {chat.tags && chat.tags.length > 0 && (
                            <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {chat.tags.slice(0, 2).map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 16, fontSize: '0.6rem' }}
                                />
                              ))}
                              {chat.tags.length > 2 && (
                                <Typography variant="caption" color="text.secondary">
                                  +{chat.tags.length - 2} more
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentChats.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VisitorProfile;