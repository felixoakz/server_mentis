export type TransactionCreationObject = {
  accountId: string,
  amount: number,
  description?: string
}

export type TransactionUpdateObject = {
  amount: number,
  description?: string
}
