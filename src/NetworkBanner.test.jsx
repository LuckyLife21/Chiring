import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import NetworkBanner from './NetworkBanner.jsx'

describe('NetworkBanner', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true })
  })

  it('renders nothing when online', () => {
    const { container } = render(<NetworkBanner />)
    expect(container.firstChild).toBeNull()
  })

  it('renders offline message when navigator.onLine is false', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true })
    render(<NetworkBanner />)
    expect(screen.getByText(/Sin conexión/)).toBeInTheDocument()
  })
})
