import React, { useState, useMemo } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Circle as CircleIcon,
  Person as PersonIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

const VisitorList = ({ 
  visitors, 
  selectedVisitorId, 
  unreadCounts, 
  onVisitorSelect, 
  onlineCount 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOnline, setFilterOnline] = useState(false);

  // Filter and search visitors
  const filteredVisitors = useMemo(() => {
    let filtered = visitors;

    // Filter by online status
    if (filterOnline) {
      filtered = filtered.filter(visitor => visitor.isOnline);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(visitor => 
        visitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.visitorId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by online status first, then by last activity
    return filtered.sort((a, b) => {
      if (a.isOnline !== b.isOnline) {
        return b.isOnline - a.isOnline; // Online first
      }
      return new Date(b.lastSeen) - new Date(a.lastSeen); // Most recent first
    });
  }, [visitors, searchTerm, filterOnline]);

  const handleVisitorClick = (visitorId) => {
    onVisitorSelect(visitorId);
  };

  const formatLastSeen = (lastSeen) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getVisitorAvatar = (visitor) => {
    if (visitor.avatar) {
      return <Avatar src={visitor.avatar} alt={visitor.name} />;
    }
    return (
      <Avatar sx={{ bgcolor: visitor.isOnline ? 'success.main' : 'grey.400' }}>
        <PersonIcon />
      </Avatar>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Visitors ({filteredVisitors.length})
          </Typography>
          <Tooltip title={filterOnline ? 'Show all visitors' : 'Show online only'}>
            <IconButton 
              size="small" 
              onClick={() => setFilterOnline(!filterOnline)}
              color={filterOnline ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search visitors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        
        {/* Online Status */}
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircleIcon sx={{ color: 'success.main', fontSize: 12 }} />
          <Typography variant="caption" color="text.secondary">
            {onlineCount} online
          </Typography>
        </Box>
      </Box>

      {/* Visitor List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {filteredVisitors.map((visitor, index) => {
            const isSelected = visitor._id === selectedVisitorId;
            const unreadCount = unreadCounts[visitor._id] || 0;
            const hasUnread = unreadCount > 0;

            return (
              <React.Fragment key={visitor._id}>
                <ListItem 
                  disablePadding
                  sx={{
                    bgcolor: isSelected ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: isSelected ? 'action.selected' : 'action.hover'
                    }
                  }}
                >
                  <ListItemButton
                    onClick={() => handleVisitorClick(visitor._id)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderLeft: isSelected ? 3 : 0,
                      borderColor: 'primary.main'
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <CircleIcon 
                            sx={{ 
                              color: visitor.isOnline ? 'success.main' : 'grey.400',
                              fontSize: 12,
                              bgcolor: 'background.paper',
                              borderRadius: '50%'
                            }} 
                          />
                        }
                      >
                        {getVisitorAvatar(visitor)}
                      </Badge>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="subtitle2" 
                            noWrap
                            sx={{ 
                              fontWeight: hasUnread ? 600 : 400,
                              color: hasUnread ? 'text.primary' : 'text.secondary'
                            }}
                          >
                            {visitor.name || `Visitor ${visitor.visitorId?.slice(-4)}`}
                          </Typography>
                          {hasUnread && (
                            <Chip
                              label={unreadCount > 99 ? '99+' : unreadCount}
                              size="small"
                              color="error"
                              sx={{ 
                                height: 20, 
                                fontSize: '0.75rem',
                                minWidth: 20,
                                '& .MuiChip-label': { px: 0.5 }
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {visitor.email || visitor.visitorId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {visitor.isOnline ? 'Online' : formatLastSeen(visitor.lastSeen)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < filteredVisitors.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
        
        {/* Empty State */}
        {filteredVisitors.length === 0 && (
          <Box 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              color: 'text.secondary' 
            }}
          >
            <PersonIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">
              {searchTerm ? 'No visitors found' : 'No visitors connected'}
            </Typography>
            {searchTerm && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Try adjusting your search terms
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VisitorList;