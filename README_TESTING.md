# Testing Guide for Chat Application

This document provides comprehensive instructions for running and writing tests for the chat application.

## Backend Testing

### Setup
The backend uses Jest with Supertest for API testing and MongoDB Memory Server for database testing.

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure
- `tests/auth.controller.test.js` - Authentication endpoint tests
- `tests/message.controller.test.js` - Message endpoint tests  
- `tests/models.test.js` - Database model tests
- `tests/setup.js` - Test configuration and database setup

### What's Tested
- User signup, login, logout functionality
- Message sending and retrieval
- Database model validations
- Error handling and edge cases
- Authentication middleware

## Frontend Testing

### Setup
The frontend uses Vitest with React Testing Library for component testing.

### Running Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Structure
- `src/test/components/` - Component tests
- `src/test/hooks/` - Custom hook tests
- `src/test/setup.js` - Test configuration and mocks

### What's Tested
- Component rendering and behavior
- User interactions
- State management (Zustand stores)
- Mock API calls and external dependencies

## Environment Variables for Testing

Create a `.env.test` file in the backend directory:

```
NODE_ENV=test
JWT_SECRET=test-secret-key
MONGODB_URI=mongodb://localhost:27017/chat-app-test
```

## Writing New Tests

### Backend API Tests
1. Use the existing test files as templates
2. Mock external services (Cloudinary, Socket.io)
3. Test both success and error scenarios
4. Use MongoDB Memory Server for database operations

### Frontend Component Tests
1. Mock external dependencies and API calls
2. Test user interactions with `fireEvent`
3. Verify component state changes
4. Use proper accessibility selectors

## Coverage Reports

Both backend and frontend generate coverage reports when running:
- `npm run test:coverage`

Reports are generated in the `coverage/` directory and can be viewed in a browser.

## CI/CD Integration

Add these steps to your CI pipeline:

```yaml
# Backend tests
- cd backend
- npm install
- npm test

# Frontend tests  
- cd ../frontend
- npm install
- npm test
```

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Mock Dependencies**: Mock external services and APIs
4. **Test Edge Cases**: Don't just test happy paths
5. **Keep Tests Independent**: Tests should not depend on each other
6. **Regular Maintenance**: Update tests when code changes

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**: Ensure MongoDB Memory Server is properly configured
2. **Import Errors**: Check that all imports are correctly mocked
3. **Async Test Timeouts**: Use proper async/await syntax and increase timeout if needed
4. **Component Rendering Issues**: Verify all required props are provided

### Debug Mode

Run tests with additional logging:

```bash
# Backend
DEBUG=* npm test

# Frontend  
VITE_DEBUG=true npm test
```
