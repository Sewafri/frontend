export function CheckoutForm() {
  return (
    <form className="space-y-4">
      <input name="card" placeholder="Card number" aria-label="Card number" className="w-full rounded border px-3 py-2" />
      <button type="submit" className="w-full rounded bg-primary py-2 text-text-primary dark:text-white font-medium">Pay</button>
    </form>
  )
}
