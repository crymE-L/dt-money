import * as Dialog from '@radix-ui/react-dialog'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import * as z from 'zod'

import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from './styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { TransactionContext } from '../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'

const editTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
})

type NewTransactionFormInputs = z.infer<typeof editTransactionFormSchema>

interface EdiTransactionModalProps {
  id: number
  close: () => void
}

export function EditTransactionModal({ id, close }: EdiTransactionModalProps) {
  const editTransaction = useContextSelector(TransactionContext, context => {
    return context.createTransaction
  })

  const transactions = useContextSelector(TransactionContext, context => {
    return context.transactions
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(editTransactionFormSchema),
    defaultValues: {
      description: transactions.find(transaction => transaction.id === id)?.description || 'Descrição',
      price: transactions.find(transaction => transaction.id === id)?.price || 0,
      category: transactions.find(transaction => transaction.id === id)?.category || 'Categoria',
      type: transactions.find(transaction => transaction.id === id)?.type || 'income',
    },
  })

  async function handleEditTransaction(data: NewTransactionFormInputs) {
    const { description, price, category, type } = data

    await editTransaction({
      description,
      price,
      category,
      type,
    })

    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content onSubmit={close}>
        <Dialog.Title> Editar transação </Dialog.Title>

        <CloseButton>
          <X />
        </CloseButton>

        <form
          onSubmit={handleSubmit(async (data: { description: string; price: number; category: string; type: "income" | "outcome" }) => {
            await handleEditTransaction(data)
            close()
          })}
        >
          <input
            type="text"
            required
            {...register('description')}
          />
          <input
            type="number"
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type="text"
            required
            {...register('category')}
          />

          <Controller
            control={control}
            name="type"
            render={({ field }: { field: { onChange: (value: string) => void; value: string } }) => {
              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButton value="income" variant="income">
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>

                  <TransactionTypeButton value="outcome" variant="outcome">
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }}
          />

          <button type="submit" disabled={isSubmitting}>
            Editar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
