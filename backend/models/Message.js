import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true,
    index: true
  },
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: true,
    index: true
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system', 'emoji'],
    default: 'text',
    index: true
  },
  senderType: {
    type: String,
    enum: ['visitor', 'agent', 'system'],
    required: true,
    index: true
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  attachments: [{
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    thumbnailUrl: String
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    deliveryStatus: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    },
    readReceipts: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      readAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reaction: {
      type: String,
      enum: ['like', 'dislike', 'love', 'laugh', 'angry', 'sad']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
messageSchema.index({ sessionId: 1, createdAt: -1 });
messageSchema.index({ visitorId: 1, createdAt: -1 });
messageSchema.index({ agentId: 1, createdAt: -1 });
messageSchema.index({ isRead: 1, senderType: 1 });
messageSchema.index({ messageType: 1, createdAt: -1 });

// Virtual for time ago
messageSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
});

// Method to mark as read
messageSchema.methods.markAsRead = function(userId = null) {
  this.isRead = true;
  this.readAt = new Date();
  
  if (userId) {
    this.metadata.readReceipts.push({
      userId: userId,
      readAt: new Date()
    });
  }
  
  return this.save();
};

// Method to edit message
messageSchema.methods.editContent = function(newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Method to add reaction
messageSchema.methods.addReaction = function(userId, reaction) {
  // Remove existing reaction from same user
  this.reactions = this.reactions.filter(r => !r.userId.equals(userId));
  
  // Add new reaction
  this.reactions.push({
    userId: userId,
    reaction: reaction
  });
  
  return this.save();
};

// Static method to get unread count for a visitor
messageSchema.statics.getUnreadCount = function(visitorId, agentId) {
  return this.countDocuments({
    visitorId: visitorId,
    senderType: 'visitor',
    isRead: false,
    agentId: agentId
  });
};

// Static method to mark multiple messages as read
messageSchema.statics.markMultipleAsRead = function(messageIds, userId) {
  return this.updateMany(
    { _id: { $in: messageIds } },
    { 
      $set: { 
        isRead: true, 
        readAt: new Date() 
      },
      $push: {
        'metadata.readReceipts': {
          userId: userId,
          readAt: new Date()
        }
      }
    }
  );
};

const Message = mongoose.model('Message', messageSchema);

export default Message;