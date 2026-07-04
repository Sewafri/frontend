"use client"
export function LoginForm() {
  return (
    <form className="space-y-4">
      <input name="email" type="email" placeholder="Email" className="w-full rounded border px-3 py-2" />
      <input name="password" type="password" placeholder="Password" className="w-full rounded border px-3 py-2" />
      <button type="submit" className="w-full rounded bg-primary py-2 text-white font-medium">Sign in</button>
    </form>
  )
}
