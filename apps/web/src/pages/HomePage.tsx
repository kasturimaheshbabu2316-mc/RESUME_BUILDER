import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold text-brand-700">Resume Builder</h1>
      <p className="text-gray-500">Create, preview, and export professional resumes.</p>
      <Link to="/editor" className="btn-primary">
        Create New Resume
      </Link>
    </main>
  )
}
