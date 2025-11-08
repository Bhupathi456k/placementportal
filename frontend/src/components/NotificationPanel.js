import React, { useState } from 'react';
import {
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Badge,
  Box,
  Divider,
  Button,
  Chip,
  Avatar
} from '@mui/material';
import {
  Notifications,
  School,
  Business,
  Assignment,
  CheckCircle,
  Cancel,
  Schedule,
  Warning,
  Info,
  Error,
  Delete,
  MarkEmailRead
} from '@mui/icons-material';

const NotificationPanel = ({ userRole, anchorEl, onClose, open }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'drive',
      title: 'New Placement Drive',
      message: 'Google placement drive registrations are now open for Computer Science students',
      time: '2 hours ago',
      read: false,
      priority: 'high',
      icon: <Business sx={{ color: '#4caf50' }} />,
      actionUrl: '/student/drives'
    },
    {
      id: 2,
      type: 'application',
      title: 'Application Status Update',
      message: 'Your application for Microsoft has moved to the interview round',
      time: '4 hours ago',
      read: false,
      priority: 'medium',
      icon: <Assignment sx={{ color: '#2196f3' }} />,
      actionUrl: '/student/applications'
    },
    {
      id: 3,
      type: 'result',
      title: 'Interview Result',
      message: 'Congratulations! You have cleared the technical round at Amazon',
      time: '1 day ago',
      read: true,
      priority: 'high',
      icon: <CheckCircle sx={{ color: '#4caf50' }} />,
      actionUrl: '/student/results'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Interview Reminder',
      message: 'Your interview with Google is scheduled for tomorrow at 2:00 PM',
      time: '2 days ago',
      read: true,
      priority: 'high',
      icon: <Schedule sx={{ color: '#ff9800' }} />,
      actionUrl: '/student/schedule'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Maintenance',
      message: 'The system will be under maintenance on Sunday from 12 AM to 4 AM',
      time: '3 days ago',
      read: true,
      priority: 'low',
      icon: <Info sx={{ color: '#607d8b' }} />,
      actionUrl: null
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, unread, high

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#607d8b';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'drive': return <Business sx={{ color: '#4caf50' }} />;
      case 'application': return <Assignment sx={{ color: '#2196f3' }} />;
      case 'result': return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'reminder': return <Schedule sx={{ color: '#ff9800' }} />;
      case 'warning': return <Warning sx={{ color: '#ff9800' }} />;
      case 'error': return <Cancel sx={{ color: '#f44336' }} />;
      case 'system': return <Info sx={{ color: '#607d8b' }} />;
      default: return <Info sx={{ color: '#607d8b' }} />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.read;
      case 'high': return notif.priority === 'high';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 400,
          maxHeight: 500,
          mt: 1
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <Notifications />
          </Badge>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Button
            size="small"
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </Button>
          <Button
            size="small"
            variant={filter === 'unread' ? 'contained' : 'outlined'}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            size="small"
            variant={filter === 'high' ? 'contained' : 'outlined'}
            onClick={() => setFilter('high')}
            color="error"
          >
            Urgent ({highPriorityCount})
          </Button>
        </Box>
        
        {unreadCount > 0 && (
          <Button
            size="small"
            startIcon={<MarkEmailRead />}
            onClick={markAllAsRead}
            sx={{ textTransform: 'none' }}
          >
            Mark all as read
          </Button>
        )}
      </Box>

      <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
        {filteredNotifications.length === 0 ? (
          <ListItem>
            <ListItemText 
              primary="No notifications" 
              secondary="You're all caught up!" 
              sx={{ textAlign: 'center' }}
            />
          </ListItem>
        ) : (
          filteredNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  backgroundColor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                  borderLeft: notification.priority === 'high' ? `4px solid ${getPriorityColor(notification.priority)}` : 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
                onClick={() => {
                  if (!notification.read) markAsRead(notification.id);
                  if (notification.actionUrl) {
                    // Navigate to action URL
                    console.log('Navigate to:', notification.actionUrl);
                  }
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent' }}>
                    {notification.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notification.read ? 'normal' : 'bold',
                          flex: 1
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: getPriorityColor(notification.priority)
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 0.5 }}
                      >
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                        <Chip
                          label={notification.priority}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: `${getPriorityColor(notification.priority)}20`,
                            color: getPriorityColor(notification.priority)
                          }}
                        />
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < filteredNotifications.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>

      {filteredNotifications.length > 0 && (
        <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
          <Button size="small" sx={{ textTransform: 'none' }}>
            View all notifications
          </Button>
        </Box>
      )}
    </Popover>
  );
};

export default NotificationPanel;