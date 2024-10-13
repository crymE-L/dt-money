import styled from 'styled-components'

export const TransactionsContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 4rem auto 0;
  padding: 0 1.5rem;
`

export const TransactionsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  margin-top: 1.5rem;

  td {
    padding: 1.25rem 2rem;
    background: ${props => props.theme['gray-700']};

    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    &:last-child { 
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  button[type='button'] {
    background: transparent;
    border: 0;
    color: ${props => props.theme['red-300']};
    transition: filter 0.2s;
    padding-top: 0.4rem;

    &:hover {
      transition: 0.2s;
      color: ${props => props.theme['red-500']};
      cursor: pointer;
    }
  }

    button[type='submit'] {
    background: transparent;
    border: 0;
    color: ${props => props.theme['gray-400']};
    transition: filter 0.2s;
    padding-top: 0.4rem;
    margin-right: 1rem;

    &:hover {
      transition: 0.2s;
      color: ${props => props.theme['gray-100']};
      cursor: pointer;
    }
  }
`

interface PriceHighlightProps {
  variant: 'income' | 'outcome'
}

export const PriceHighlight = styled.span<PriceHighlightProps>`
  color: ${props => (props.variant === 'income' ? props.theme['green-300'] : props.theme['red-300'])};
`
