import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorFallback from './ErrorFallback.jsx'

describe('ErrorFallback', () => {
  it('renders generic error when no error passed', () => {
    render(<ErrorFallback resetError={() => {}} />)
    expect(screen.getByText('Algo ha fallado')).toBeInTheDocument()
    expect(screen.getByText(/Ha ocurrido un error inesperado/)).toBeInTheDocument()
  })

  it('renders network message when error is network-like', () => {
    render(<ErrorFallback error={new Error('Failed to fetch')} resetError={() => {}} />)
    expect(screen.getByText('Sin conexión')).toBeInTheDocument()
    expect(screen.getByText(/Inténtalo en unos minutos/)).toBeInTheDocument()
  })

  it('shows Reintentar when resetError is provided', () => {
    render(<ErrorFallback resetError={() => {}} />)
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument()
  })
})
