import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  visitors: [],
  selectedVisitorId: null,
  messages: {}, // { visitorId: { messages: [], unreadCount: 0, lastMessage: null, isTyping: false } }
  unreadCounts: {}, // { visitorId: count }
  currentUser: {
    _id: null,
    name: '',
    avatar: '',
    status: 'online'
  },
  ui: {
    activeModal: null,
    highlightedMessages: [],
    loading: false,
    error: null
  }
};

// Action types
const ActionTypes = {
  SET_VISITORS: 'SET_VISITORS',
  ADD_VISITOR: 'ADD_VISITOR',
  UPDATE_VISITOR: 'UPDATE_VISITOR',
  REMOVE_VISITOR: 'REMOVE_VISITOR',
  SELECT_VISITOR: 'SELECT_VISITOR',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  MARK_MESSAGES_READ: 'MARK_MESSAGES_READ',
  SET_TYPING_STATUS: 'SET_TYPING_STATUS',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_HIGHLIGHTED_MESSAGES: 'SET_HIGHLIGHTED_MESSAGES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ACTIVE_MODAL: 'SET_ACTIVE_MODAL'
};

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_VISITORS:
      return {
        ...state,
        visitors: action.payload
      };

    case ActionTypes.ADD_VISITOR:
      return {
        ...state,
        visitors: [...state.visitors, action.payload]
      };

    case ActionTypes.UPDATE_VISITOR:
      return {
        ...state,
        visitors: state.visitors.map(visitor =>
          visitor._id === action.payload.id
            ? { ...visitor, ...action.payload.updates }
            : visitor
        )
      };

    case ActionTypes.REMOVE_VISITOR:
      return {
        ...state,
        visitors: state.visitors.filter(visitor => visitor._id !== action.payload),
        selectedVisitorId: state.selectedVisitorId === action.payload ? null : state.selectedVisitorId
      };

    case ActionTypes.SELECT_VISITOR:
      return {
        ...state,
        selectedVisitorId: action.payload
      };

    case ActionTypes.SET_MESSAGES:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.visitorId]: {
            messages: action.payload.messages,
            unreadCount: action.payload.unreadCount || 0,
            lastMessage: action.payload.messages[action.payload.messages.length - 1] || null,
            isTyping: state.messages[action.payload.visitorId]?.isTyping || false
          }
        }
      };

    case ActionTypes.ADD_MESSAGE:
      const { visitorId, message } = action.payload;
      const currentMessages = state.messages[visitorId]?.messages || [];
      const newMessages = [...currentMessages, message];
      const isUnread = message.senderType === 'visitor' && !message.isRead;
      const currentUnreadCount = state.unreadCounts[visitorId] || 0;
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [visitorId]: {
            ...state.messages[visitorId],
            messages: newMessages,
            lastMessage: message,
            unreadCount: isUnread ? (state.messages[visitorId]?.unreadCount || 0) + 1 : (state.messages[visitorId]?.unreadCount || 0)
          }
        },
        unreadCounts: {
          ...state.unreadCounts,
          [visitorId]: isUnread ? currentUnreadCount + 1 : currentUnreadCount
        }
      };

    case ActionTypes.UPDATE_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.visitorId]: {
            ...state.messages[action.payload.visitorId],
            messages: state.messages[action.payload.visitorId].messages.map(msg =>
              msg._id === action.payload.messageId
                ? { ...msg, ...action.payload.updates }
                : msg
            )
          }
        }
      };

    case ActionTypes.MARK_MESSAGES_READ:
      const { visitorId: readVisitorId, messageIds } = action.payload;
      const visitorMessages = state.messages[readVisitorId]?.messages || [];
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [readVisitorId]: {
            ...state.messages[readVisitorId],
            messages: visitorMessages.map(msg =>
              messageIds.includes(msg._id)
                ? { ...msg, isRead: true, readAt: new Date() }
                : msg
            ),
            unreadCount: 0
          }
        },
        unreadCounts: {
          ...state.unreadCounts,
          [readVisitorId]: 0
        }
      };

    case ActionTypes.SET_TYPING_STATUS:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.visitorId]: {
            ...state.messages[action.payload.visitorId],
            isTyping: action.payload.isTyping
          }
        }
      };

    case ActionTypes.UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload.visitorId]: action.payload.count
        }
      };

    case ActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload }
      };

    case ActionTypes.SET_HIGHLIGHTED_MESSAGES:
      return {
        ...state,
        ui: {
          ...state.ui,
          highlightedMessages: action.payload
        }
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload
        }
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload
        }
      };

    case ActionTypes.SET_ACTIVE_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          activeModal: action.payload
        }
      };

    default:
      return state;
  }
};

// Context
const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Action creators
  const setVisitors = useCallback((visitors) => {
    dispatch({ type: ActionTypes.SET_VISITORS, payload: visitors });
  }, []);

  const addVisitor = useCallback((visitor) => {
    dispatch({ type: ActionTypes.ADD_VISITOR, payload: visitor });
  }, []);

  const updateVisitor = useCallback((id, updates) => {
    dispatch({ type: ActionTypes.UPDATE_VISITOR, payload: { id, updates } });
  }, []);

  const removeVisitor = useCallback((visitorId) => {
    dispatch({ type: ActionTypes.REMOVE_VISITOR, payload: visitorId });
  }, []);

  const selectVisitor = useCallback((visitorId) => {
    dispatch({ type: ActionTypes.SELECT_VISITOR, payload: visitorId });
  }, []);

  const setMessages = useCallback((visitorId, messages, unreadCount = 0) => {
    dispatch({
      type: ActionTypes.SET_MESSAGES,
      payload: { visitorId, messages, unreadCount }
    });
  }, []);

  const addMessage = useCallback((visitorId, message) => {
    dispatch({
      type: ActionTypes.ADD_MESSAGE,
      payload: { visitorId, message }
    });
  }, []);

  const updateMessage = useCallback((visitorId, messageId, updates) => {
    dispatch({
      type: ActionTypes.UPDATE_MESSAGE,
      payload: { visitorId, messageId, updates }
    });
  }, []);

  const markMessagesAsRead = useCallback((visitorId, messageIds) => {
    dispatch({
      type: ActionTypes.MARK_MESSAGES_READ,
      payload: { visitorId, messageIds }
    });
  }, []);

  const setTypingStatus = useCallback((visitorId, isTyping) => {
    dispatch({
      type: ActionTypes.SET_TYPING_STATUS,
      payload: { visitorId, isTyping }
    });
  }, []);

  const updateUnreadCount = useCallback((visitorId, count) => {
    dispatch({
      type: ActionTypes.UPDATE_UNREAD_COUNT,
      payload: { visitorId, count }
    });
  }, []);

  const setCurrentUser = useCallback((user) => {
    dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: user });
  }, []);

  const setHighlightedMessages = useCallback((messageIds) => {
    dispatch({ type: ActionTypes.SET_HIGHLIGHTED_MESSAGES, payload: messageIds });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  const setActiveModal = useCallback((modal) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_MODAL, payload: modal });
  }, []);

  // Update visitor online status
  const updateVisitorStatus = useCallback((visitorId, isOnline) => {
    updateVisitor(visitorId, {
      isOnline,
      lastSeen: isOnline ? new Date() : new Date()
    });
  }, [updateVisitor]);

  // Get total unread count
  const getTotalUnreadCount = useCallback(() => {
    return Object.values(state.unreadCounts).reduce((total, count) => total + count, 0);
  }, [state.unreadCounts]);

  // Get visitor by ID
  const getVisitorById = useCallback((visitorId) => {
    return state.visitors.find(visitor => visitor._id === visitorId);
  }, [state.visitors]);

  // Get messages for visitor
  const getMessagesForVisitor = useCallback((visitorId) => {
    return state.messages[visitorId]?.messages || [];
  }, [state.messages]);

  const value = {
    // State
    ...state,
    
    // Actions
    setVisitors,
    addVisitor,
    updateVisitor,
    removeVisitor,
    selectVisitor,
    setMessages,
    addMessage,
    updateMessage,
    markMessagesAsRead,
    setTypingStatus,
    updateUnreadCount,
    setCurrentUser,
    setHighlightedMessages,
    setLoading,
    setError,
    setActiveModal,
    updateVisitorStatus,
    
    // Computed values
    getTotalUnreadCount,
    getVisitorById,
    getMessagesForVisitor
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use chat context
export const useChatStore = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatStore must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;