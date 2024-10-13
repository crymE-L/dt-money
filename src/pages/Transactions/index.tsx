import { Header } from '../../components/Header'
import { Summary } from '../../components/Summary'
import { SearchForm } from './components/SearchForm'
import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles'
import { TransactionContext } from '../../contexts/TransactionsContext'
import { dateFormatter, priceFormatter } from '../../utils/formatter'
import { useContextSelector } from 'use-context-selector'
import { PencilSimple, Trash } from 'phosphor-react'
import { z } from 'zod'

const editTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
})

type EditTransaactionFormInputs = z.infer<typeof editTransactionFormSchema>

export function Transactions() {
  const transactions = useContextSelector(TransactionContext, context => {
    return context.transactions
  })

  const deleteTransaction = useContextSelector(TransactionContext, context => {
    return context.deleteTransaction
  })

  async function handleDeleteTransaction(id: number) {
    await deleteTransaction(id)
  }

  const editTransaction = useContextSelector(TransactionContext, context => {
    return context.editTransaction
  })

  async function handleEditTransaction(
    id: number,
    data: EditTransaactionFormInputs
  ) {
    const { description, price, category, type } = data

    await editTransaction(id, { description, price, category, type })
  }

  const openModal = () => {
    console.log('open modal')
  }

  return (
    <div>
      <Header />
      <Summary />

      <TransactionsContainer>
        <SearchForm />

        <TransactionsTable>
          <tbody>
            {transactions.map(transaction => {
              return (
                <tr key={transaction.id}>
                  <td width="40%"> {transaction.description} </td>
                  <td>
                    <PriceHighlight variant={transaction.type}>
                      {transaction.type === 'outcome' && '-'}
                      {priceFormatter.format(transaction.price)}
                    </PriceHighlight>
                  </td>
                  <td> {transaction.category} </td>
                  <td>
                    {' '}
                    {dateFormatter.format(new Date(transaction.createdAt))}
                  </td>
                  <td>
                    <button type="submit" onClick={openModal}>
                      <PencilSimple size={24} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <Trash size={24} weight="bold" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
    </div>
  )
}
