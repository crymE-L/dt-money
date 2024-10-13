import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { createContext } from 'use-context-selector'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt: string
}

interface TransactionContextType {
  transactions: Transaction[]
  createTransaction: (data: CreateTransactionInput) => Promise<void>
  fetchTransactions: (query?: string) => Promise<void>
  editTransaction: (id: number, data: EditTransactionInput) => Promise<void>
  deleteTransaction: (id: number) => Promise<void>
}

interface TransactionsProviderProps {
  children: React.ReactNode
}

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface EditTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

export const TransactionContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, price, category, type } = data

      const response = await api.post('transactions', {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      })

      setTransactions(state => [...state, response.data])
    },
    []
  )

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }, [])

  const editTransaction = useCallback(
    async (id: number, data: EditTransactionInput) => {
      const { description, price, category, type } = data

      await api.put(`transactions/${id}`, {
        description,
        price,
        category,
        type,
      })

      setTransactions(state =>
        state.map(transaction => {
          if (transaction.id === id) {
            return {
              ...transaction,
              description,
              price,
              category,
              type,
            }
          }

          return transaction
        })
      )
    },
    []
  )

  const deleteTransaction = useCallback(async (id: number) => {
    await api.delete(`transactions/${id}`)

    setTransactions(state => state.filter(transaction => transaction.id !== id))
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        createTransaction,
        fetchTransactions,
        editTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
