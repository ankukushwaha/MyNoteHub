import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  Summarize as SummarizeIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Star as StarIcon
} from '@mui/icons-material';

const ChatModals = ({ activeModal, modalData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch summary data when summary modal is opened
  useEffect(() => {
    if (activeModal === 'summary' && modalData?.sessionId) {
      fetchChatSummary(modalData.sessionId);
    }
  }, [activeModal, modalData?.sessionId]);

  const fetchChatSummary = async (sessionId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/analytics/chat-summary/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat summary');
      }
      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      year: 'numeric',
      month: 'long',
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

  const MessageDetailsModal = () => {
    const { message, visitor } = modalData || {};
    
    if (!message) return null;

    return (
      <Dialog open={activeModal === 'details'} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              <Typography variant="h6">Message Details</Typography>
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            {/* Message Content */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Message Content
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  "{message.content}"
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={message.messageType}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={message.senderType}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                  {message.isRead && (
                    <Chip
                      label="Read"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Timestamp Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Timestamp Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <ScheduleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Sent At"
                    secondary={formatDate(message.createdAt)}
                  />
                </ListItem>
                
                {message.readAt && (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <ScheduleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Read At"
                      secondary={formatDate(message.readAt)}
                    />
                  </ListItem>
                )}
                
                {message.isEdited && (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <ScheduleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Edited At"
                      secondary={formatDate(message.editedAt)}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>

            {/* Visitor Information */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Visitor Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={visitor?.avatar}>
                      {visitor?.name?.charAt(0) || 'V'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={visitor?.name || 'Anonymous Visitor'}
                    secondary={visitor?.email || visitor?.visitorId}
                  />
                </ListItem>
                
                {visitor?.location && (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <LocationIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Location"
                      secondary={`${visitor.location.city}, ${visitor.location.country}`}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>

            {/* Technical Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Technical Details
              </Typography>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Message ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {message._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Session ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {message.sessionId}
                    </Typography>
                  </Grid>
                  {message.metadata?.ipAddress && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        IP Address
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {message.metadata.ipAddress}
                      </Typography>
                    </Grid>
                  )}
                  {message.metadata?.userAgent && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        User Agent
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {message.metadata.userAgent}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const ChatSummaryModal = () => {
    const { visitor } = modalData || {};

    return (
      <Dialog open={activeModal === 'summary'} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SummarizeIcon color="primary" />
              <Typography variant="h6">Chat Summary</Typography>
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {summaryData && (
            <Grid container spacing={3}>
              {/* Session Overview */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Session Overview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="h6">
                        {formatDuration(summaryData.startedAt, summaryData.endedAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Messages
                      </Typography>
                      <Typography variant="h6">
                        {summaryData.messageCount}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={summaryData.status}
                        size="small"
                        color={summaryData.status === 'closed' ? 'success' : 'warning'}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Rating
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {summaryData.rating ? (
                          <>
                            {renderStars(summaryData.rating)}
                            <Typography variant="body2">
                              ({summaryData.rating}/5)
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not rated
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* AI Summary */}
              {summaryData.aiSummary && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    AI-Generated Summary
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <Typography variant="body1">
                      {summaryData.aiSummary}
                    </Typography>
                  </Paper>
                </Grid>
              )}

              {/* Key Topics */}
              {summaryData.keyTopics && summaryData.keyTopics.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Topics Discussed
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {summaryData.keyTopics.map((topic, index) => (
                      <Chip
                        key={index}
                        label={topic}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Grid>
              )}

              {/* Customer Feedback */}
              {summaryData.feedback && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Customer Feedback
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body1">
                      "{summaryData.feedback}"
                    </Typography>
                  </Paper>
                </Grid>
              )}

              {/* Resolution Status */}
              {summaryData.resolutionStatus && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Resolution Status
                  </Typography>
                  <Chip
                    label={summaryData.resolutionStatus}
                    color={summaryData.resolutionStatus === 'Resolved' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <MessageDetailsModal />
      <ChatSummaryModal />
    </>
  );
};

export default ChatModals;