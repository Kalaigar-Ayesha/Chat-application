import mongoose from 'mongoose';
import User from '../src/models/user.model.js';
import Message from '../src/models/message.model.js';

describe('User Model', () => {
  it('should create a user with valid data', async () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.fullName).toBe(userData.fullName);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.profilePic).toBe('');
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
  });

  it('should require email field', async () => {
    const user = new User({
      fullName: 'Test User',
      password: 'password123'
    });

    await expect(user.save()).rejects.toThrow();
  });

  it('should require fullName field', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123'
    });

    await expect(user.save()).rejects.toThrow();
  });

  it('should require password field', async () => {
    const user = new User({
      fullName: 'Test User',
      email: 'test@example.com'
    });

    await expect(user.save()).rejects.toThrow();
  });

  it('should enforce unique email', async () => {
    const userData = {
      fullName: 'Test User',
      email: 'duplicate@example.com',
      password: 'password123'
    };

    await User.create(userData);

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should enforce minimum password length', async () => {
    const user = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      password: '123'
    });

    await expect(user.save()).rejects.toThrow();
  });
});

describe('Message Model', () => {
  let user1, user2;

  beforeEach(async () => {
    user1 = await User.create({
      fullName: 'User One',
      email: 'user1@example.com',
      password: 'password123'
    });

    user2 = await User.create({
      fullName: 'User Two',
      email: 'user2@example.com',
      password: 'password123'
    });
  });

  it('should create a message with valid data', async () => {
    const messageData = {
      senderId: user1._id,
      receiverId: user2._id,
      text: 'Hello, this is a test message'
    };

    const message = new Message(messageData);
    const savedMessage = await message.save();

    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.senderId.toString()).toBe(user1._id.toString());
    expect(savedMessage.receiverId.toString()).toBe(user2._id.toString());
    expect(savedMessage.text).toBe(messageData.text);
    expect(savedMessage.image).toBeUndefined();
    expect(savedMessage.createdAt).toBeDefined();
    expect(savedMessage.updatedAt).toBeDefined();
  });

  it('should create a message with image', async () => {
    const messageData = {
      senderId: user1._id,
      receiverId: user2._id,
      image: 'https://example.com/image.jpg'
    };

    const message = new Message(messageData);
    const savedMessage = await message.save();

    expect(savedMessage.image).toBe(messageData.image);
    expect(savedMessage.text).toBeUndefined();
  });

  it('should require senderId field', async () => {
    const message = new Message({
      receiverId: user2._id,
      text: 'Hello'
    });

    await expect(message.save()).rejects.toThrow();
  });

  it('should require receiverId field', async () => {
    const message = new Message({
      senderId: user1._id,
      text: 'Hello'
    });

    await expect(message.save()).rejects.toThrow();
  });

  it('should allow message with only senderId and receiverId', async () => {
    const message = new Message({
      senderId: user1._id,
      receiverId: user2._id
    });

    const savedMessage = await message.save();
    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.text).toBeUndefined();
    expect(savedMessage.image).toBeUndefined();
  });
});
