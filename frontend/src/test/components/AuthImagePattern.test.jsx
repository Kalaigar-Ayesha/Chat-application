import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AuthImagePattern from '../../components/AuthImagePattern.jsx'

describe('AuthImagePattern Component', () => {
  it('renders title and subtitle correctly', () => {
    const title = 'Welcome to Chat'
    const subtitle = 'Connect with friends and family'
    
    render(<AuthImagePattern title={title} subtitle={subtitle} />)
    
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.getByText(subtitle)).toBeInTheDocument()
  })

  it('renders a grid of 9 squares', () => {
    render(<AuthImagePattern title="Test" subtitle="Test" />)
    
    const squares = document.querySelectorAll('.aspect-square')
    expect(squares).toHaveLength(9)
  })

  it('applies animate-pulse to even-indexed squares', () => {
    render(<AuthImagePattern title="Test" subtitle="Test" />)
    
    const squares = document.querySelectorAll('.aspect-square')
    
    squares.forEach((square, index) => {
      if (index % 2 === 0) {
        expect(square).toHaveClass('animate-pulse')
      } else {
        expect(square).not.toHaveClass('animate-pulse')
      }
    })
  })

  it('applies correct CSS classes to squares', () => {
    render(<AuthImagePattern title="Test" subtitle="Test" />)
    
    const squares = document.querySelectorAll('.aspect-square')
    
    squares.forEach(square => {
      expect(square).toHaveClass('rounded-2xl', 'bg-primary/10')
    })
  })

  it('has correct container structure', () => {
    render(<AuthImagePattern title="Test" subtitle="Test" />)
    
    const container = document.querySelector('.hidden.lg\\:flex')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('items-center', 'justify-center', 'bg-base-200', 'p-12')
  })

  it('centers content correctly', () => {
    render(<AuthImagePattern title="Test" subtitle="Test" />)
    
    const textContainer = document.querySelector('.max-w-md.text-center')
    expect(textContainer).toBeInTheDocument()
  })

  it('renders title with correct styling', () => {
    render(<AuthImagePattern title="Test Title" subtitle="Test Subtitle" />)
    
    const titleElement = screen.getByText('Test Title')
    expect(titleElement).toHaveClass('text-2xl', 'font-bold', 'mb-4')
  })

  it('renders subtitle with correct styling', () => {
    render(<AuthImagePattern title="Test Title" subtitle="Test Subtitle" />)
    
    const subtitleElement = screen.getByText('Test Subtitle')
    expect(subtitleElement).toHaveClass('text-base-content/60')
  })
})
