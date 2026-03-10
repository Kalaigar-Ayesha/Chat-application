import request from 'supertest';
import { app } from '../src/app.js';
import User from '../src/models/user.model.js';
import Message from '../src/models/message.model.js';
import jwt from 'jsonwebtoken';

const getAuthToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret');
};

describe('Message Controller', () => {
  let user1, user2, user1Token, user2Token;

  beforeEach(async () => {
    user1 = await User.create({
      fullName: 'User One',
      email: 'user1@example.com',
      password: 'hashedpassword1'
    });

    user2 = await User.create({
      fullName: 'User Two',
      email: 'user2@example.com',
      password: 'hashedpassword2'
    });

    user1Token = getAuthToken(user1._id);
    user2Token = getAuthToken(user2._id);
  });

  describe('GET /api/messages/users', () => {
    it('should get users for sidebar excluding logged in user', async () => {
      const response = await request(app)
        .get('/api/messages/users')
        .set('Cookie', `jwt=${user1Token}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].email).toBe(user2.email);
      expect(response.body[0]).not.toHaveProperty('password');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/messages/users')
        .expect(401);
    });
  });

  describe('GET /api/messages/:id', () => {
    beforeEach(async () => {
      await Message.create({
        senderId: user1._id,
        receiverId: user2._id,
        text: 'Hello from user1'
      });

      await Message.create({
        senderId: user2._id,
        receiverId: user1._id,
        text: 'Hello from user2'
      });
    });

    it('should get messages between two users', async () => {
      const response = await request(app)
        .get(`/api/messages/${user2._id}`)
        .set('Cookie', `jwt=${user1Token}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].text).toBe('Hello from user1');
      expect(response.body[1].text).toBe('Hello from user2');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get(`/api/messages/${user2._id}`)
        .expect(401);
    });
  });

  describe('POST /api/messages/send/:id', () => {
    it('should send a text message successfully', async () => {
      const messageData = {
        text: 'Hello, this is a test message'
      };

      const response = await request(app)
        .post(`/api/messages/send/${user2._id}`)
        .set('Cookie', `jwt=${user1Token}`)
        .send(messageData)
        .expect(201);

      expect(response.body.text).toBe(messageData.text);
      expect(response.body.senderId.toString()).toBe(user1._id.toString());
      expect(response.body.receiverId.toString()).toBe(user2._id.toString());
    });

    it('should return 401 for unauthenticated request', async () => {
      const messageData = {
        text: 'Hello, this is a test message'
      };

      const response = await request(app)
        .post(`/api/messages/send/${user2._id}`)
        .send(messageData)
        .expect(401);
    });

    it('should handle empty message body', async () => {
      const response = await request(app)
        .post(`/api/messages/send/${user2._id}`)
        .set('Cookie', `jwt=${user1Token}`)
        .send({})
        .expect(201);

      expect(response.body.text).toBeUndefined();
      expect(response.body.image).toBeUndefined();
    });
  });
});
