import { render, screen } from '@testing-library/react'
import Home from '../src/pages/index'
import '@testing-library/jest-dom'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('h1', {
      name: "Faça o login para acessar sua agenda",
    })

    expect(heading).toBeInTheDocument()
  })
})