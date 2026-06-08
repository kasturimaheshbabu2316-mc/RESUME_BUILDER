export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8 dark:bg-gray-900">
      <div className="card w-full max-w-md">
        <h1 className="mb-6 text-2xl font-bold">Sign In</h1>
        <form className="flex flex-col gap-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input mt-1" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input mt-1" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary mt-2">Sign In</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          No account?{' '}
          <a href="/register" className="text-brand-600 hover:underline">Create one</a>
        </p>
      </div>
    </main>
  )
}
