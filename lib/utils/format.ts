export function formatDate(date: Date) {
  return date.toLocaleDateString()
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}
