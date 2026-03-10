import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act } from 'react'
import useAuthStore from '../../store/useAuthStore'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

// Mock socket.io-client
vi.mock('../../lib/socket', () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn()
  }
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: []
    })
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const state = useAuthStore.getState()
    
    expect(state.authUser).toBeNull()
    expect(state.isSigningUp).toBe(false)
    expect(state.isLoggingIn).toBe(false)
    expect(state.isUpdatingProfile).toBe(false)
    expect(state.isCheckingAuth).toBe(true)
    expect(state.onlineUsers).toEqual([])
  })

  it('should set auth user', () => {
    const user = {
      _id: '1',
      fullName: 'Test User',
      email: 'test@example.com'
    }

    act(() => {
      useAuthStore.getState().setAuthUser(user)
    })

    expect(useAuthStore.getState().authUser).toEqual(user)
  })

  it('should set signing up state', () => {
    act(() => {
      useAuthStore.getState().setIsSigningUp(true)
    })

    expect(useAuthStore.getState().isSigningUp).toBe(true)

    act(() => {
      useAuthStore.getState().setIsSigningUp(false)
    })

    expect(useAuthStore.getState().isSigningUp).toBe(false)
  })

  it('should set logging in state', () => {
    act(() => {
      useAuthStore.getState().setIsLoggingIn(true)
    })

    expect(useAuthStore.getState().isLoggingIn).toBe(true)
  })

  it('should set updating profile state', () => {
    act(() => {
      useAuthStore.getState().setIsUpdatingProfile(true)
    })

    expect(useAuthStore.getState().isUpdatingProfile).toBe(true)
  })

  it('should set checking auth state', () => {
    act(() => {
      useAuthStore.getState().setIsCheckingAuth(false)
    })

    expect(useAuthStore.getState().isCheckingAuth).toBe(false)
  })

  it('should set online users', () => {
    const onlineUsers = ['user1', 'user2']

    act(() => {
      useAuthStore.getState().setOnlineUsers(onlineUsers)
    })

    expect(useAuthStore.getState().onlineUsers).toEqual(onlineUsers)
  })

  it('should clear auth user on logout', () => {
    const user = {
      _id: '1',
      fullName: 'Test User',
      email: 'test@example.com'
    }

    act(() => {
      useAuthStore.getState().setAuthUser(user)
    })

    expect(useAuthStore.getState().authUser).toEqual(user)

    act(() => {
      useAuthStore.getState().logout()
    })

    expect(useAuthStore.getState().authUser).toBeNull()
  })
})
