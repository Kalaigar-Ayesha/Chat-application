import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Navbar from '../../components/Navbar.jsx'

// Mock the auth store
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: () => ({
    logout: vi.fn(),
    authUser: {
      _id: '1',
      fullName: 'Test User',
      email: 'test@example.com'
    }
  })
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the app title and logo', () => {
    renderWithRouter(<Navbar />)
    
    expect(screen.getByText('Chatty')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /chatty/i })).toBeInTheDocument()
  })

  it('renders settings link', () => {
    renderWithRouter(<Navbar />)
    
    const settingsLink = screen.getByRole('link', { name: /settings/i })
    expect(settingsLink).toBeInTheDocument()
    expect(settingsLink).toHaveAttribute('href', '/settings')
  })

  it('renders profile link when user is authenticated', () => {
    renderWithRouter(<Navbar />)
    
    const profileLink = screen.getByRole('link', { name: /profile/i })
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute('href', '/profile')
  })

  it('renders logout button when user is authenticated', () => {
    const { useAuthStore } = require('../../store/useAuthStore')
    const mockLogout = vi.fn()
    
    useAuthStore.mockReturnValue({
      logout: mockLogout,
      authUser: {
        _id: '1',
        fullName: 'Test User',
        email: 'test@example.com'
      }
    })

    renderWithRouter(<Navbar />)
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    expect(logoutButton).toBeInTheDocument()
    
    fireEvent.click(logoutButton)
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('has correct CSS classes and structure', () => {
    renderWithRouter(<Navbar />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-base-100', 'border-b', 'border-base-300', 'fixed', 'w-full', 'top-0', 'z-40', 'backdrop-blur-lg', 'bg-base-100/80')
  })

  it('renders MessageSquare icon', () => {
    renderWithRouter(<Navbar />)
    
    const messageIcon = document.querySelector('.text-primary')
    expect(messageIcon).toBeInTheDocument()
  })
})
