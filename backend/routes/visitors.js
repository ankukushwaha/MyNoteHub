import express from 'express';
import Visitor from '../models/Visitor.js';
import ChatSession from '../models/ChatSession.js';
import Message from '../models/Message.js';

const router = express.Router();

// Get all visitors
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, online, search } = req.query;
    
    let query = {};
    
    // Filter by online status
    if (online !== undefined) {
      query.isOnline = online === 'true';
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { visitorId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const visitors = await Visitor.find(query)
      .sort({ isOnline: -1, lastSeen: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    // Get unread message counts for each visitor
    const visitorsWithUnreadCounts = await Promise.all(
      visitors.map(async (visitor) => {
        const unreadCount = await Message.countDocuments({
          visitorId: visitor._id,
          senderType: 'visitor',
          isRead: false
        });
        
        return {
          ...visitor,
          unreadCount
        };
      })
    );
    
    const total = await Visitor.countDocuments(query);
    
    res.json({
      visitors: visitorsWithUnreadCounts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
});

// Get visitor by ID
router.get('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).lean();
    
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    // Get recent chat sessions (last 5)
    const recentSessions = await ChatSession.find({ visitorId: visitor._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    // Get unread message count
    const unreadCount = await Message.countDocuments({
      visitorId: visitor._id,
      senderType: 'visitor',
      isRead: false
    });
    
    res.json({
      ...visitor,
      recentSessions,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching visitor:', error);
    res.status(500).json({ error: 'Failed to fetch visitor' });
  }
});

// Update visitor information
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, avatar },
      { new: true, runValidators: true }
    );
    
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    res.json(visitor);
  } catch (error) {
    console.error('Error updating visitor:', error);
    res.status(500).json({ error: 'Failed to update visitor' });
  }
});

// Get visitor's chat sessions
router.get('/:id/sessions', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { visitorId: req.params.id };
    
    if (status) {
      query.status = status;
    }
    
    const sessions = await ChatSession.find(query)
      .populate('agentId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await ChatSession.countDocuments(query);
    
    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching visitor sessions:', error);
    res.status(500).json({ error: 'Failed to fetch visitor sessions' });
  }
});

// Create new visitor
router.post('/', async (req, res) => {
  try {
    const { visitorId, name, email, phone, ipAddress, userAgent, location } = req.body;
    
    // Check if visitor already exists
    let visitor = await Visitor.findOne({ visitorId });
    
    if (visitor) {
      // Update existing visitor
      visitor = await Visitor.findOneAndUpdate(
        { visitorId },
        { 
          name: name || visitor.name,
          email: email || visitor.email,
          phone: phone || visitor.phone,
          isOnline: true,
          lastSeen: new Date(),
          ipAddress: ipAddress || visitor.ipAddress,
          userAgent: userAgent || visitor.userAgent,
          location: location || visitor.location
        },
        { new: true }
      );
    } else {
      // Create new visitor
      visitor = new Visitor({
        visitorId,
        name,
        email,
        phone,
        ipAddress,
        userAgent,
        location,
        isOnline: true
      });
      
      await visitor.save();
    }
    
    res.status(201).json(visitor);
  } catch (error) {
    console.error('Error creating/updating visitor:', error);
    res.status(500).json({ error: 'Failed to create/update visitor' });
  }
});

// Update visitor online status
router.patch('/:id/status', async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { 
        isOnline,
        lastSeen: new Date()
      },
      { new: true }
    );
    
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    res.json(visitor);
  } catch (error) {
    console.error('Error updating visitor status:', error);
    res.status(500).json({ error: 'Failed to update visitor status' });
  }
});

// Delete visitor
router.delete('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    // Also delete related sessions and messages
    await ChatSession.deleteMany({ visitorId: req.params.id });
    await Message.deleteMany({ visitorId: req.params.id });
    
    res.json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('Error deleting visitor:', error);
    res.status(500).json({ error: 'Failed to delete visitor' });
  }
});

// Get visitor statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const visitorId = req.params.id;
    
    const [
      totalSessions,
      totalMessages,
      averageSessionDuration,
      averageRating
    ] = await Promise.all([
      ChatSession.countDocuments({ visitorId }),
      Message.countDocuments({ visitorId }),
      ChatSession.aggregate([
        { $match: { visitorId: new mongoose.Types.ObjectId(visitorId), endedAt: { $ne: null } } },
        { $project: { duration: { $subtract: ['$endedAt', '$startedAt'] } } },
        { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
      ]),
      ChatSession.aggregate([
        { $match: { visitorId: new mongoose.Types.ObjectId(visitorId), rating: { $ne: null } } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ])
    ]);
    
    res.json({
      totalSessions,
      totalMessages,
      averageSessionDuration: averageSessionDuration[0]?.avgDuration || 0,
      averageRating: averageRating[0]?.avgRating || 0
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    res.status(500).json({ error: 'Failed to fetch visitor statistics' });
  }
});

export default router;