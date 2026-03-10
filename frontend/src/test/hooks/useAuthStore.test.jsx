import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act } from 'react'

vi.mock('../../lib/axios.js', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockSocket = {
  connected: false,
  connect: vi.fn(),
  disconnect: vi.fn(),
  on: vi.fn(),
}

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}))

import { axiosInstance } from '../../lib/axios.js'
import { useAuthStore } from '../../store/useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,
    })
    vi.clearAllMocks()
    mockSocket.connected = false
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

  it('checkAuth sets authUser and clears isCheckingAuth', async () => {
    const user = { _id: '1', fullName: 'Test User', email: 'test@example.com' }
    axiosInstance.get.mockResolvedValueOnce({ data: user })

    await act(async () => {
      await useAuthStore.getState().checkAuth()
    })

    const state = useAuthStore.getState()
    expect(state.authUser).toEqual(user)
    expect(state.isCheckingAuth).toBe(false)
  })

  it('connectSocket does nothing without authUser', () => {
    act(() => {
      useAuthStore.getState().connectSocket()
    })
    expect(useAuthStore.getState().socket).toBeNull()
  })

  it('logout clears authUser on success', async () => {
    const user = { _id: '1', fullName: 'Test User', email: 'test@example.com' }
    useAuthStore.setState({ authUser: user })
    axiosInstance.post.mockResolvedValueOnce({ data: {} })

    await act(async () => {
      await useAuthStore.getState().logout()
    })

    expect(useAuthStore.getState().authUser).toBeNull()
  })
})
