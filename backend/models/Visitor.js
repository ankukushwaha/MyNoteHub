import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    default: 'Anonymous Visitor'
  },
  email: {
    type: String,
    sparse: true
  },
  phone: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String,
    default: null
  },
  isOnline: {
    type: Boolean,
    default: false,
    index: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  location: {
    country: String,
    city: String,
    coordinates: [Number] // [longitude, latitude]
  },
  sessionCount: {
    type: Number,
    default: 0
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  firstVisit: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
visitorSchema.index({ isOnline: 1, lastSeen: -1 });
visitorSchema.index({ createdAt: -1 });

// Virtual for full name
visitorSchema.virtual('displayName').get(function() {
  return this.name || `Visitor ${this.visitorId.slice(-4)}`;
});

// Method to update online status
visitorSchema.methods.updateOnlineStatus = function(isOnline) {
  this.isOnline = isOnline;
  if (!isOnline) {
    this.lastSeen = new Date();
  }
  return this.save();
};

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;