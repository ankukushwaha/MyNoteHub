import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
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
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'pending', 'transferred'],
    default: 'pending',
    index: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date,
    default: null
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedback: {
    type: String,
    trim: true,
    default: null
  },
  messageCount: {
    type: Number,
    default: 0
  },
  avgResponseTime: {
    type: Number, // in seconds
    default: 0
  },
  transferHistory: [{
    fromAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    toAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    transferredAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    source: {
      type: String,
      enum: ['website', 'mobile', 'api'],
      default: 'website'
    },
    page: String,
    referrer: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
chatSessionSchema.index({ status: 1, createdAt: -1 });
chatSessionSchema.index({ agentId: 1, status: 1 });
chatSessionSchema.index({ visitorId: 1, createdAt: -1 });

// Virtual for session duration
chatSessionSchema.virtual('duration').get(function() {
  if (this.endedAt) {
    return this.endedAt - this.startedAt;
  }
  return Date.now() - this.startedAt;
});

// Method to close session
chatSessionSchema.methods.closeSession = function(rating = null, feedback = null) {
  this.status = 'closed';
  this.endedAt = new Date();
  if (rating) this.rating = rating;
  if (feedback) this.feedback = feedback;
  return this.save();
};

// Method to assign agent
chatSessionSchema.methods.assignAgent = function(agentId) {
  this.agentId = agentId;
  this.status = 'active';
  return this.save();
};

// Method to transfer session
chatSessionSchema.methods.transferToAgent = function(fromAgentId, toAgentId, reason) {
  this.transferHistory.push({
    fromAgent: fromAgentId,
    toAgent: toAgentId,
    reason: reason
  });
  this.agentId = toAgentId;
  this.status = 'active';
  return this.save();
};

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;