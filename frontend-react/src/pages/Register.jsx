import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authAPI } from '../utils/api'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authAPI.register(formData)

      const loginResponse = await authAPI.login({
        email: formData.email,
        password: formData.password,
      })

      const { access_token, user } = loginResponse.data
      localStorage.setItem('kn_token', access_token)
      localStorage.setItem('kn_user', JSON.stringify(user))

      toast.success('Account created successfully.')
      navigate('/courses')
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed. Please try again.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="order-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 lg:order-1 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Create account</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Start learning today</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create your KnowledgeNest account to explore courses, submit reviews, and manage your learning path.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                placeholder="Minimum 6 characters"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="order-1 hidden rounded-3xl border border-slate-200 bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/20 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">KnowledgeNest</p>
          <h1 className="mt-8 text-5xl font-semibold leading-tight tracking-tight">
            Build a learning profile that feels premium.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Enroll in cloud and software engineering content, leave thoughtful reviews, and keep everything in one polished dashboard.
          </p>
          <div className="mt-10 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-white">Modern UI</p>
              <p className="mt-1">Neutral tones and refined spacing</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-white">Fast onboarding</p>
              <p className="mt-1">Instant login after sign up</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
