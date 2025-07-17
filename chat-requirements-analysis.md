# Chat Application Requirements & Data Structures

## Requirements Analysis

### UI Layout
1. **Three-column layout:**
   - Column 1: Visitor list with connection status
   - Column 2: Selected visitor's chat messages
   - Column 3: Visitor profile + last 5 chat history

2. **Visitor Management:**
   - List all connected visitors
   - Single visitor selection at a time
   - Unread message counters with highlights
   - Real-time message updates

3. **Message Handling:**
   - Real-time message appending for selected visitor
   - Message highlighting with fade-out effect
   - Customer/User message alignment (left/right)
   - Hover actions for chat details and summary

4. **Modal Features:**
   - Chat details modal
   - Chat summary modal

## Data Structures Required

### 1. Visitor Model
```javascript
{
  _id: ObjectId,
  visitorId: String, // Unique identifier
  name: String,
  email: String,
  phone: String,
  avatar: String,
  isOnline: Boolean,
  lastSeen: Date,
  ipAddress: String,
  userAgent: String,
  location: {
    country: String,
    city: String,
    coordinates: [Number] // [longitude, latitude]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Chat Session Model
```javascript
{
  _id: ObjectId,
  visitorId: ObjectId, // Reference to Visitor
  agentId: ObjectId, // Reference to User/Agent
  status: String, // 'active', 'closed', 'pending'
  startedAt: Date,
  endedAt: Date,
  tags: [String],
  rating: Number, // 1-5 stars
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Message Model
```javascript
{
  _id: ObjectId,
  sessionId: ObjectId, // Reference to ChatSession
  visitorId: ObjectId, // Reference to Visitor
  agentId: ObjectId, // Reference to User/Agent (null if from visitor)
  content: String,
  messageType: String, // 'text', 'image', 'file', 'system'
  senderType: String, // 'visitor', 'agent', 'system'
  isRead: Boolean,
  readAt: Date,
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    timestamp: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Frontend State Structure

#### Chat Store (Redux/Context)
```javascript
{
  visitors: {
    list: [Visitor],
    selectedVisitorId: String,
    onlineCount: Number
  },
  
  messages: {
    [visitorId]: {
      messages: [Message],
      unreadCount: Number,
      lastMessage: Message,
      isTyping: Boolean
    }
  },
  
  ui: {
    activeModal: String, // 'details', 'summary', null
    highlightedMessages: [String], // Message IDs
    loading: Boolean,
    error: String
  },
  
  currentUser: {
    _id: String,
    name: String,
    avatar: String,
    status: String // 'online', 'away', 'busy'
  }
}
```

#### Component Props Structure
```javascript
// VisitorList Component
{
  visitors: [Visitor],
  selectedVisitorId: String,
  unreadCounts: Object, // {visitorId: count}
  onVisitorSelect: Function,
  onlineCount: Number
}

// ChatWindow Component
{
  selectedVisitor: Visitor,
  messages: [Message],
  isTyping: Boolean,
  onSendMessage: Function,
  onMessageHover: Function,
  highlightedMessages: [String]
}

// VisitorProfile Component
{
  visitor: Visitor,
  recentChats: [ChatSession],
  onShowDetails: Function,
  onShowSummary: Function
}
```

## Real-time Events Structure

### Socket.io Events
```javascript
// Client to Server
{
  'join-room': { visitorId, agentId },
  'send-message': { sessionId, content, messageType },
  'typing-start': { sessionId, visitorId },
  'typing-stop': { sessionId, visitorId },
  'mark-read': { messageIds },
  'agent-status': { status } // online, away, busy
}

// Server to Client
{
  'new-message': { message, sessionId, visitorId },
  'visitor-online': { visitor },
  'visitor-offline': { visitorId },
  'typing-indicator': { visitorId, isTyping },
  'message-read': { messageIds },
  'visitor-joined': { visitor, sessionId }
}
```

## API Endpoints Structure

### Visitor Management
- `GET /api/visitors` - Get all visitors
- `GET /api/visitors/:id` - Get visitor details
- `PUT /api/visitors/:id` - Update visitor info
- `GET /api/visitors/:id/sessions` - Get visitor's chat sessions

### Chat Sessions
- `GET /api/sessions` - Get all active sessions
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Close session

### Messages
- `GET /api/sessions/:id/messages` - Get session messages
- `POST /api/sessions/:id/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read
- `GET /api/messages/summary/:sessionId` - Get chat summary

### Analytics
- `GET /api/analytics/chat-summary/:sessionId` - AI-generated summary
- `GET /api/analytics/chat-details/:sessionId` - Detailed analytics

## Implementation Summary

### Frontend Components Created:
1. **ChatDashboard.jsx** - Main three-column layout component
2. **VisitorList.jsx** - First column with visitor list and unread counters
3. **ChatWindow.jsx** - Second column with messages and highlighting
4. **VisitorProfile.jsx** - Third column with visitor info and chat history
5. **ChatModals.jsx** - Modal dialogs for details and summary
6. **ChatContext.jsx** - State management for chat data
7. **useChatSocket.js** - Real-time socket connection hook

### Backend Models Created:
1. **Visitor.js** - Visitor information and status
2. **ChatSession.js** - Chat session management
3. **Message.js** - Message storage and metadata

### Backend Routes Created:
1. **visitors.js** - Visitor management API
2. **sessions.js** - Chat session management API

### Key Features Implemented:
- ✅ Three-column layout as specified
- ✅ Visitor list with online status and unread counters
- ✅ Single visitor selection
- ✅ Message highlighting with fade-out effect
- ✅ Customer/Agent message alignment
- ✅ Hover actions for details and summary
- ✅ Modal windows for additional information
- ✅ Real-time socket communication
- ✅ Comprehensive data structures
- ✅ Proper indexing for performance

### Installation Instructions:
1. Install frontend dependencies: `cd Frontend && npm install`
2. Install backend dependencies: `cd backend && npm install uuid socket.io`
3. Set up MongoDB connection in backend
4. Configure socket.io server
5. Start both frontend and backend servers

### Usage:
- The chat dashboard provides a complete customer service interface
- Agents can manage multiple visitors simultaneously
- Real-time updates ensure smooth communication
- Message highlighting helps track new communications
- Detailed visitor profiles provide context for conversations