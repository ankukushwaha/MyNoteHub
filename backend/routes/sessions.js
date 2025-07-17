import express from 'express';
import ChatSession from '../models/ChatSession.js';
import Message from '../models/Message.js';
import Visitor from '../models/Visitor.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all chat sessions
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, agentId } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (agentId) {
      query.agentId = agentId;
    }
    
    const sessions = await ChatSession.find(query)
      .populate('visitorId', 'name email avatar isOnline visitorId')
      .populate('agentId', 'name email avatar')
      .sort({ lastActivity: -1 })
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
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get session by ID
router.get('/:id', async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.id)
      .populate('visitorId', 'name email avatar isOnline visitorId location')
      .populate('agentId', 'name email avatar')
      .lean();
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Get messages for this session
    const messages = await Message.find({ sessionId: session._id })
      .sort({ createdAt: 1 })
      .lean();
    
    res.json({
      ...session,
      messages
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Create new chat session
router.post('/', async (req, res) => {
  try {
    const { visitorId, agentId, metadata } = req.body;
    
    // Verify visitor exists
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    // Check if there's already an active session for this visitor
    const existingSession = await ChatSession.findOne({
      visitorId,
      status: 'active'
    });
    
    if (existingSession) {
      return res.status(400).json({ 
        error: 'Active session already exists for this visitor',
        sessionId: existingSession._id
      });
    }
    
    // Create new session
    const session = new ChatSession({
      visitorId,
      agentId: agentId || null,
      sessionId: uuidv4(),
      status: agentId ? 'active' : 'pending',
      metadata: metadata || {}
    });
    
    await session.save();
    
    // Update visitor session count
    await Visitor.findByIdAndUpdate(visitorId, {
      $inc: { sessionCount: 1 }
    });
    
    // Populate the session before returning
    const populatedSession = await ChatSession.findById(session._id)
      .populate('visitorId', 'name email avatar isOnline visitorId')
      .populate('agentId', 'name email avatar')
      .lean();
    
    res.status(201).json(populatedSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Update session
router.put('/:id', async (req, res) => {
  try {
    const { status, agentId, tags, rating, feedback } = req.body;
    
    const updateData = {};
    
    if (status) updateData.status = status;
    if (agentId) updateData.agentId = agentId;
    if (tags) updateData.tags = tags;
    if (rating) updateData.rating = rating;
    if (feedback) updateData.feedback = feedback;
    
    updateData.lastActivity = new Date();
    
    // If closing the session, set endedAt
    if (status === 'closed') {
      updateData.endedAt = new Date();
    }
    
    const session = await ChatSession.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('visitorId', 'name email avatar isOnline visitorId')
    .populate('agentId', 'name email avatar');
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Assign agent to session
router.patch('/:id/assign', async (req, res) => {
  try {
    const { agentId } = req.body;
    
    const session = await ChatSession.findByIdAndUpdate(
      req.params.id,
      { 
        agentId,
        status: 'active',
        lastActivity: new Date()
      },
      { new: true }
    )
    .populate('visitorId', 'name email avatar isOnline visitorId')
    .populate('agentId', 'name email avatar');
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error assigning agent:', error);
    res.status(500).json({ error: 'Failed to assign agent' });
  }
});

// Transfer session to another agent
router.patch('/:id/transfer', async (req, res) => {
  try {
    const { toAgentId, fromAgentId, reason } = req.body;
    
    const session = await ChatSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Add transfer history
    session.transferHistory.push({
      fromAgent: fromAgentId,
      toAgent: toAgentId,
      reason: reason || 'No reason provided'
    });
    
    session.agentId = toAgentId;
    session.status = 'active';
    session.lastActivity = new Date();
    
    await session.save();
    
    const populatedSession = await ChatSession.findById(session._id)
      .populate('visitorId', 'name email avatar isOnline visitorId')
      .populate('agentId', 'name email avatar');
    
    res.json(populatedSession);
  } catch (error) {
    console.error('Error transferring session:', error);
    res.status(500).json({ error: 'Failed to transfer session' });
  }
});

// Close session
router.patch('/:id/close', async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    const session = await ChatSession.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'closed',
        endedAt: new Date(),
        rating: rating || null,
        feedback: feedback || null,
        lastActivity: new Date()
      },
      { new: true }
    )
    .populate('visitorId', 'name email avatar isOnline visitorId')
    .populate('agentId', 'name email avatar');
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error closing session:', error);
    res.status(500).json({ error: 'Failed to close session' });
  }
});

// Get session messages
router.get('/:id/messages', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({ sessionId: req.params.id })
      .sort({ createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('visitorId', 'name avatar')
      .populate('agentId', 'name avatar')
      .lean();
    
    const total = await Message.countDocuments({ sessionId: req.params.id });
    
    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching session messages:', error);
    res.status(500).json({ error: 'Failed to fetch session messages' });
  }
});

// Send message to session
router.post('/:id/messages', async (req, res) => {
  try {
    const { content, messageType = 'text', senderType, agentId, attachments } = req.body;
    
    const session = await ChatSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Create message
    const message = new Message({
      sessionId: req.params.id,
      visitorId: session.visitorId,
      agentId: senderType === 'agent' ? agentId : null,
      content,
      messageType,
      senderType,
      attachments: attachments || [],
      metadata: {
        timestamp: new Date()
      }
    });
    
    await message.save();
    
    // Update session activity
    await ChatSession.findByIdAndUpdate(req.params.id, {
      lastActivity: new Date(),
      $inc: { messageCount: 1 }
    });
    
    // Update visitor message count
    await Visitor.findByIdAndUpdate(session.visitorId, {
      $inc: { totalMessages: 1 }
    });
    
    // Populate message before returning
    const populatedMessage = await Message.findById(message._id)
      .populate('visitorId', 'name avatar')
      .populate('agentId', 'name avatar')
      .lean();
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get session statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    const [
      session,
      messageCount,
      messagesByType,
      averageResponseTime
    ] = await Promise.all([
      ChatSession.findById(sessionId).lean(),
      Message.countDocuments({ sessionId }),
      Message.aggregate([
        { $match: { sessionId: new mongoose.Types.ObjectId(sessionId) } },
        { $group: { _id: '$senderType', count: { $sum: 1 } } }
      ]),
      Message.aggregate([
        { $match: { sessionId: new mongoose.Types.ObjectId(sessionId), senderType: 'agent' } },
        { $group: { _id: null, avgResponseTime: { $avg: '$responseTime' } } }
      ])
    ]);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const duration = session.endedAt 
      ? session.endedAt - session.startedAt 
      : Date.now() - session.startedAt;
    
    res.json({
      sessionId,
      duration,
      messageCount,
      messagesByType,
      averageResponseTime: averageResponseTime[0]?.avgResponseTime || 0,
      status: session.status,
      rating: session.rating
    });
  } catch (error) {
    console.error('Error fetching session stats:', error);
    res.status(500).json({ error: 'Failed to fetch session statistics' });
  }
});

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    const session = await ChatSession.findByIdAndDelete(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Delete all messages in this session
    await Message.deleteMany({ sessionId: req.params.id });
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;